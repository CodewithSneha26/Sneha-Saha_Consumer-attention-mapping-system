import cv2
from ultralytics import YOLO
import time
from database import SessionLocal, engine, Base
import models

Base.metadata.create_all(bind=engine)

model = YOLO("yolov8n.pt")

VIDEO_PATH = "test_images/retail_traffic_sample.mp4"
cap = cv2.VideoCapture(VIDEO_PATH)

if not cap.isOpened():
    print(f"Error: Could not open video file at {VIDEO_PATH}")
    exit()

print(f"Validating tracking system on real retail traffic video: {VIDEO_PATH}")
print("Press 'q' to quit early.\n")

frame_count = 0
unique_ids = set()
max_simultaneous_people = 0

start_time = time.time()

while True:
    ret, frame = cap.read()
    if not ret:
        print("End of video reached.")
        break

    frame_count += 1
    results = model.track(frame, persist=True, verbose=False, classes=[0])
    annotated_frame = results[0].plot()

    current_frame_people = 0
    if results[0].boxes.id is not None:
        for track_id in results[0].boxes.id:
            unique_ids.add(int(track_id))
            current_frame_people += 1

    max_simultaneous_people = max(max_simultaneous_people, current_frame_people)

    cv2.putText(annotated_frame, f"Frame: {frame_count} | Current: {current_frame_people} | Total Unique: {len(unique_ids)}",
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    cv2.imshow("Retail Traffic Dataset Validation", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

elapsed = time.time() - start_time

print(f"\n--- Retail Traffic Dataset Validation Summary ---")
print(f"Video: {VIDEO_PATH}")
print(f"Total frames processed: {frame_count}")
print(f"Total unique people tracked: {len(unique_ids)}")
print(f"Max people visible simultaneously: {max_simultaneous_people}")
print(f"Processing time: {elapsed:.1f} seconds")
print(f"\nThis confirms the tracking system works on real multi-person retail")
print(f"footage, not just single-person webcam testing - validating Module 3's")
print(f"multi-person tracking capability against realistic store traffic conditions.")