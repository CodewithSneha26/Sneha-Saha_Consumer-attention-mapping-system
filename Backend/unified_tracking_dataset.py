import cv2
from ultralytics import YOLO
import time
from database import SessionLocal, engine, Base
import models

import sys

VIDEO_PATH = sys.argv[1] if len(sys.argv) > 1 else "test_images/retail_traffic_sample.mp4"

repeat_visits = {}
journey_sequence = {}

db_init = SessionLocal()
shelves_in_db = db_init.query(models.Shelf).all()
db_init.close()

NUM_ZONES = min(len(shelves_in_db), 5) if len(shelves_in_db) > 0 else 3
zone_to_shelf = {}
if NUM_ZONES > 0 and len(shelves_in_db) > 0:
    for i in range(NUM_ZONES):
        zone_to_shelf[f"Zone {i}"] = shelves_in_db[i].shelf_name
else:
    NUM_ZONES = 3
    zone_to_shelf = {"Zone 0": "Zone A", "Zone 1": "Zone B", "Zone 2": "Zone C"}

print(f"Dataset-based analysis. Mapping {NUM_ZONES} zones to shelves: {zone_to_shelf}")

Base.metadata.create_all(bind=engine)

yolo_model = YOLO("yolov8n.pt")

cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    print(f"Error: Could not open {VIDEO_PATH}")
    exit()

frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))

def get_zone(center_x, frame_width):
    zone_index = min(int(center_x / (frame_width / NUM_ZONES)), NUM_ZONES - 1)
    return zone_to_shelf.get(f"Zone {zone_index}", f"Zone {zone_index}")

print("Processing dataset video for attention/zone analysis...")

person_state = {}
frame_num = 0

while True:
    ret, frame = cap.read()
    if not ret:
        print("End of video.")
        break
    frame_num += 1

    results = yolo_model.track(frame, persist=True, verbose=False, classes=[0])

    if results[0].boxes.id is not None:
        for box, track_id in zip(results[0].boxes.xyxy, results[0].boxes.id):
            x1, y1, x2, y2 = box.tolist()
            center_x = (x1 + x2) / 2
            center_y = (y1 + y2) / 2
            track_id = int(track_id)
            zone = get_zone(center_x, frame_width)
            # Simulate "attentive" if facing forward-ish; for dataset video, treat as Attentive by default
            attention_status = "Attentive"

            db_pos = SessionLocal()
            point = models.PositionPoint(person_track_id=track_id, x=int(center_x), y=int(center_y))
            db_pos.add(point)
            db_pos.commit()
            db_pos.close()

            if track_id not in person_state:
                person_state[track_id] = {"zone": zone, "attention": attention_status, "state_start_time": time.time(), "frame_start": frame_num}
            else:
                prev = person_state[track_id]
                if prev["zone"] != zone:
                    duration_frames = frame_num - prev["frame_start"]
                    duration = duration_frames / 30  # approx seconds assuming 30fps

                    db = SessionLocal()
                    record = models.AttentionRecord(
                        person_track_id=track_id, zone=prev["zone"],
                        attention_status=prev["attention"], duration_seconds=int(duration)
                    )
                    db.add(record)
                    db.commit()
                    db.close()

                    key = (track_id, prev["zone"])
                    repeat_visits[key] = repeat_visits.get(key, 0) + 1
                    print(f"Person {track_id}: in {prev['zone']} for ~{duration:.1f}s (visit #{repeat_visits[key]})")

                    if duration >= 2:
                        db2 = SessionLocal()
                        interaction = models.ProductInteraction(
                            person_track_id=track_id, shelf_zone=prev["zone"],
                            interaction_type="Product Viewed", duration_seconds=int(duration)
                        )
                        db2.add(interaction)
                        db2.commit()
                        db2.close()

                    person_state[track_id] = {"zone": zone, "attention": attention_status, "state_start_time": time.time(), "frame_start": frame_num}

cap.release()
print(f"\nDataset analysis complete. Processed {frame_num} frames, {len(person_state)} unique people.")
print("Data saved to database - now generating updated scores/heatmaps/reports from this dataset.")