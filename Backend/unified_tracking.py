import cv2
from ultralytics import YOLO
import time
from database import SessionLocal, engine, Base
import models

# Track how many times each person has looked at each shelf
repeat_visits = {}  # {(track_id, shelf_name): visit_count}
journey_sequence = {}  # {track_id: current_sequence_number}
# Fetch actual shelves from database to map zones to real shelf names
db_init = SessionLocal()
shelves_in_db = db_init.query(models.Shelf).all()
db_init.close()

# Map our 3 camera zones to real shelf names (if available), else use generic names
zone_to_shelf = {}
if len(shelves_in_db) >= 3:
    zone_to_shelf["Zone A (Left)"] = shelves_in_db[0].shelf_name
    zone_to_shelf["Zone B (Middle)"] = shelves_in_db[1].shelf_name
    zone_to_shelf["Zone C (Right)"] = shelves_in_db[2].shelf_name
else:
    zone_to_shelf["Zone A (Left)"] = "Zone A (Left)"
    zone_to_shelf["Zone B (Middle)"] = "Zone B (Middle)"
    zone_to_shelf["Zone C (Right)"] = "Zone C (Right)"

print(f"Zone-to-shelf mapping: {zone_to_shelf}")

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
        raw_zone = "Zone A (Left)"
    elif center_x < 2 * frame_width / 3:
        raw_zone = "Zone B (Middle)"
    else:
        raw_zone = "Zone C (Right)"
    return zone_to_shelf.get(raw_zone, raw_zone)

print("Unified tracking started. Press 'q' to quit.")

person_state = {}
pending_state = {}
DEBOUNCE_SECONDS = 0.8

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    results = yolo_model.track(frame, persist=True, verbose=False, classes=[0])
    annotated_frame = results[0].plot()

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(80, 80))
    attention_status = "Looking Away"
    for (fx, fy, fw, fh) in faces:
        face_gray = gray[fy:fy + fh, fx:fx + fw]
        eyes = eye_cascade.detectMultiScale(face_gray, scaleFactor=1.1, minNeighbors=5)
        if len(eyes) >= 2:
            attention_status = "Attentive"
        break

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
                pending_state[track_id] = {"zone": zone, "attention": attention_status, "since": time.time()}
            else:
                prev = person_state[track_id]
                pending = pending_state.get(track_id)

                if pending and pending["zone"] == zone and pending["attention"] == attention_status:
                    if time.time() - pending["since"] >= DEBOUNCE_SECONDS and (prev["zone"] != zone or prev["attention"] != attention_status):
                        confirm_change = True
                    else:
                        confirm_change = False
                else:
                    pending_state[track_id] = {"zone": zone, "attention": attention_status, "since": time.time()}
                    confirm_change = False

                if confirm_change:
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

                    key = (track_id, prev["zone"])
                    repeat_visits[key] = repeat_visits.get(key, 0) + 1

                    print(f"Person {track_id}: {prev['attention']} in {prev['zone']} for {duration:.1f}s (visit #{repeat_visits[key]})")

                    # Log journey step only when zone actually changes (not just attention flip)
                    if prev["zone"] != zone:
                        journey_sequence[track_id] = journey_sequence.get(track_id, 0) + 1
                        db3 = SessionLocal()
                        journey_step = models.JourneyLog(
                            person_track_id=track_id,
                            zone=zone,
                            sequence_number=journey_sequence[track_id]
                        )
                        db3.add(journey_step)
                        db3.commit()
                        db3.close()
                    # Infer interaction type
                    prior_visits_to_shelf = repeat_visits.get(key, 0)
                    zones_visited_by_person = set(
                        z for (pid, z) in repeat_visits.keys() if pid == track_id
                    )

                    interaction_type = None

                    if prev["attention"] == "Attentive":
                        if duration >= 6:
                            interaction_type = "Product Purchased (simulated - very long engagement)"
                        elif duration >= 3:
                            interaction_type = "Product Picked Up (simulated)"
                        elif duration >= 1:
                            interaction_type = "Product Viewed"

                        if len(zones_visited_by_person) >= 2 and prior_visits_to_shelf >= 2:
                            interaction_type = "Product Compared (simulated - multiple shelf revisits)"

                    elif prev["attention"] == "Looking Away" and prior_visits_to_shelf >= 2 and duration < 2:
                        interaction_type = "Product Returned (simulated - quick disengagement)"

                    # This save now runs for ANY interaction_type - Viewed, Picked Up, Purchased, Compared, Returned
                    if interaction_type:
                        db2 = SessionLocal()
                        interaction = models.ProductInteraction(
                            person_track_id=track_id,
                            shelf_zone=prev["zone"],
                            interaction_type=interaction_type,
                            duration_seconds=int(duration)
                        )
                        db2.add(interaction)
                        db2.commit()
                        db2.close()
                        print(f"  --> Interaction logged: {interaction_type}")

                    person_state[track_id] = {
                        "zone": zone,
                        "attention": attention_status,
                        "state_start_time": time.time()
                    }

    cv2.line(annotated_frame, (frame_width // 3, 0), (frame_width // 3, frame.shape[0]), (255, 255, 0), 2)
    cv2.line(annotated_frame, (2 * frame_width // 3, 0), (2 * frame_width // 3, frame.shape[0]), (255, 255, 0), 2)

    cv2.putText(annotated_frame, f"Attention: {attention_status}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

    cv2.imshow("Unified Consumer Attention Tracking", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

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