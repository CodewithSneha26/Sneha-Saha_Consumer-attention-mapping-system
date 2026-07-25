from ultralytics import YOLO

# Load the pre-trained YOLOv8 model (downloads automatically first time)
model = YOLO("yolov8n.pt")

# Run detection on your test image
results = model("test_images/person1.png", save=True)

# Print what was detected
for result in results:
    for box in result.boxes:
        class_id = int(box.cls[0])
        class_name = model.names[class_id]
        confidence = float(box.conf[0])
        print(f"Detected: {class_name} (confidence: {confidence:.2f})")