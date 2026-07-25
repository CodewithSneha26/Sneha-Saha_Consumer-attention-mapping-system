import cv2
from ultralytics import YOLO

# Load YOLO model
model = YOLO("yolov8n.pt")

# Open webcam (0 = default laptop camera)
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam")
    exit()

print("Webcam started. Press 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Could not read frame")
        break

    # Run YOLO detection on this frame
    results = model(frame, verbose=False)

    # Draw boxes on the frame
    annotated_frame = results[0].plot()

    # Count people detected
    person_count = 0
    for box in results[0].boxes:
        class_id = int(box.cls[0])
        if model.names[class_id] == "person":
            person_count += 1

    # Show count on screen
    cv2.putText(annotated_frame, f"People detected: {person_count}", 
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # Display the frame
    cv2.imshow("Consumer Attention Mapping - Live Detection", annotated_frame)

    # Press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()