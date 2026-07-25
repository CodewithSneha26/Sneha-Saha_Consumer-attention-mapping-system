import cv2
from ultralytics import YOLO
import time
from database import SessionLocal, engine, Base
import models

Base.metadata.create_all(bind=engine)

# Load models
yolo_model = YOLO("yolov8n.pt")
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier('haarcascade_eye.xml')

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

print("Unified tracking started. Press 'q' to quit.")

# Track state per person: zone, attention status, and how long in current state
person_state = {}  # {id: {"zone": ..., "attention": ..., "state_start_time": ...}}

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Step 1: YOLO person detection + tracking
    results = yolo_model.track(frame, persist=True, verbose=False, classes=[0])
    annotated_frame = results[0].plot()

    # Step 2: Face/eye detection (overall attention in frame)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(80, 80))
    attention_status = "Looking Away"
    for (fx, fy, fw, fh) in faces:
        face_gray = gray[fy:fy + fh, fx:fx + fw]
        eyes = eye_cascade.detectMultiScale(face_gray, scaleFactor=1.1, minNeighbors=5)
        if len(eyes) >= 2:
            attention_status = "Attentive"
        break  # just use the first detected face for simplicity

    # Step 3: Combine with YOLO tracking IDs and zones
    if results[0].boxes.id is not None:
        for box, track_id in zip(results[0].boxes.xyxy, results[0].boxes.id):
            x1, y1, x2, y2 = box.tolist()
            center_x = (x1 + x2) / 2
            track_id = int(track_id)
            zone = get_zone(center_x, frame_width)

            if track_id not in person_state:
                person_state[track_id] = {
                    "zone": zone,
                    "attention": attention_status,
                    "state_start_time": time.time()
                }
            else:
                # If zone or attention changed, log the previous state duration
                prev = person_state[track_id]
                if prev["zone"] != zone or prev["attention"] != attention_status:
                    duration = time.time() - prev["state_start_time"]

                    db = SessionLocal()
                    record = models.AttentionRecord(
                        person_track_id=track_id,
                        zone=prev["zone"],
                        attention_status=prev["attention"],
                        duration_seconds=int(duration)
                    )
                    db.add(record)
                    db.commit()
                    db.close()

                    print(f"Person {track_id}: {prev['attention']} in {prev['zone']} for {duration:.1f}s")

                    person_state[track_id] = {
                        "zone": zone,
                        "attention": attention_status,
                        "state_start_time": time.time()
                    }

    # Draw zone lines
    cv2.line(annotated_frame, (frame_width // 3, 0), (frame_width // 3, frame.shape[0]), (255, 255, 0), 2)
    cv2.line(annotated_frame, (2 * frame_width // 3, 0), (2 * frame_width // 3, frame.shape[0]), (255, 255, 0), 2)

    cv2.putText(annotated_frame, f"Attention: {attention_status}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

    cv2.imshow("Unified Consumer Attention Tracking", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# Save final states when quitting
db = SessionLocal()
for track_id, state in person_state.items():
    duration = time.time() - state["state_start_time"]
    record = models.AttentionRecord(
        person_track_id=track_id,
        zone=state["zone"],
        attention_status=state["attention"],
        duration_seconds=int(duration)
    )
    db.add(record)
db.commit()
db.close()
print("\nFinal attention data saved to database!")