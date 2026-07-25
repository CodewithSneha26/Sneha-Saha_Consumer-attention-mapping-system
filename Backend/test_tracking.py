import cv2
from ultralytics import YOLO

# Load YOLO model
model = YOLO("yolov8n.pt")

# Open webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam")
    exit()

print("Tracking started. Press 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Could not read frame")
        break

    # Use YOLO's built-in tracking (instead of plain detection)
    # persist=True means it remembers people across frames
    results = model.track(frame, persist=True, verbose=False, classes=[0])  # class 0 = person

    # Draw boxes with tracking IDs on the frame
    annotated_frame = results[0].plot()

    # Count unique people currently visible
    person_count = 0
    if results[0].boxes.id is not None:
        person_count = len(results[0].boxes.id)

    # Show count on screen
    cv2.putText(annotated_frame, f"People tracked: {person_count}", 
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # Display the frame
    cv2.imshow("Consumer Attention Mapping - Multi-Person Tracking", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()