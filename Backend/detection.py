from ultralytics import YOLO

# Load YOLO model once when the app starts (not every time a request comes in)
model = YOLO("yolov8n.pt")

def detect_people(image_path: str):
    results = model(image_path)
    
    detections = []
    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            
            # We only care about "person" detections for this project
            if class_name == "person":
                confidence = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                
                detections.append({
                    "confidence": round(confidence, 2),
                    "bounding_box": {
                        "x1": round(x1, 1),
                        "y1": round(y1, 1),
                        "x2": round(x2, 1),
                        "y2": round(y2, 1)
                    }
                })
    
    return {
        "total_people_detected": len(detections),
        "detections": detections
    }