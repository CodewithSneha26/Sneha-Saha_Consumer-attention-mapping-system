from database import SessionLocal, engine, Base
import models

Base.metadata.create_all(bind=engine)
import cv2
from ultralytics import YOLO
import time

model = YOLO("yolov8n.pt")
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam")
    exit()

print("Position tracking started. Press 'q' to quit.")

# Store each person's position history: {id: [(x, y, timestamp), ...]}
tracking_data = {}

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model.track(frame, persist=True, verbose=False, classes=[0])
    annotated_frame = results[0].plot()

    if results[0].boxes.id is not None:
        for box, track_id in zip(results[0].boxes.xyxy, results[0].boxes.id):
            x1, y1, x2, y2 = box.tolist()
            center_x = (x1 + x2) / 2
            center_y = (y1 + y2) / 2
            track_id = int(track_id)

            if track_id not in tracking_data:
                tracking_data[track_id] = []

            tracking_data[track_id].append({
                "x": round(center_x, 1),
                "y": round(center_y, 1),
                "timestamp": time.time()
            })

    cv2.imshow("Position Tracking", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# Save tracking summary to database
db = SessionLocal()

print("\n--- Tracking Summary ---")
for person_id, positions in tracking_data.items():
    duration = positions[-1]["timestamp"] - positions[0]["timestamp"]
    print(f"Person ID {person_id}: tracked for {duration:.1f} seconds, {len(positions)} position points recorded")

    session_record = models.DetectionSession(
        person_track_id=person_id,
        dwell_time_seconds=int(duration),
        positions_recorded=len(positions)
    )
    db.add(session_record)

db.commit()
db.close()
print("\nData saved to database successfully!")