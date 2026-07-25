import cv2
from ultralytics import YOLO
import time
from database import SessionLocal, engine, Base
import models

Base.metadata.create_all(bind=engine)

model = YOLO("yolov8n.pt")
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam")
    exit()

frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))

def get_zone(center_x, frame_width):
    if center_x < frame_width / 3:
        return "Zone A (Left)"
    elif center_x < 2 * frame_width / 3:
        return "Zone B (Middle)"
    else:
        return "Zone C (Right)"

print("Zone tracking started. Press 'q' to quit.")

# Track which zone each person is currently in, and entry time
current_zone = {}
entry_time = {}
zone_history = {}

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model.track(frame, persist=True, verbose=False, classes=[0])
    annotated_frame = results[0].plot()

    # Draw zone divider lines
    cv2.line(annotated_frame, (frame_width // 3, 0), (frame_width // 3, frame.shape[0]), (255, 255, 0), 2)
    cv2.line(annotated_frame, (2 * frame_width // 3, 0), (2 * frame_width // 3, frame.shape[0]), (255, 255, 0), 2)

    if results[0].boxes.id is not None:
        for box, track_id in zip(results[0].boxes.xyxy, results[0].boxes.id):
            x1, y1, x2, y2 = box.tolist()
            center_x = (x1 + x2) / 2
            track_id = int(track_id)

            zone = get_zone(center_x, frame_width)

            if track_id not in current_zone:
                # Person just entered (first time seen)
                current_zone[track_id] = zone
                entry_time[track_id] = time.time()
                zone_history.setdefault(track_id, []).append(zone)
                print(f"Person {track_id} entered {zone}")

            elif current_zone[track_id] != zone:
                # Person moved to a new zone
                old_zone = current_zone[track_id]
                duration = time.time() - entry_time[track_id]
                print(f"Person {track_id} left {old_zone} after {duration:.1f}s, entered {zone}")

                current_zone[track_id] = zone
                entry_time[track_id] = time.time()
                zone_history.setdefault(track_id, []).append(zone)

    cv2.imshow("Zone Tracking", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# Save final zone durations to database
db = SessionLocal()
print("\n--- Zone Tracking Summary ---")
for track_id, zone in current_zone.items():
    duration = time.time() - entry_time[track_id]
    print(f"Person {track_id}: currently in {zone}, {duration:.1f}s in this zone")
    
    zone_record = models.DetectionSession(
        person_track_id=track_id,
        dwell_time_seconds=int(duration),
        positions_recorded=len(zone_history.get(track_id, []))
    )
    db.add(zone_record)

db.commit()
db.close()
print("\nZone data saved to database!")