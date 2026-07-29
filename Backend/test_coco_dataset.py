from ultralytics import YOLO
import os

model = YOLO("yolov8n.pt")
folder = "test_images/coco_samples"

print("Running YOLOv8 (COCO-trained) on real COCO dataset images...\n")

for filename in os.listdir(folder):
    if filename.lower().endswith(('.jpg', '.png', '.jpeg')):
        path = os.path.join(folder, filename)
        results = model(path, save=True)
        for r in results:
            detected_objects = [model.names[int(box.cls[0])] for box in r.boxes]
            print(f"{filename}: detected → {detected_objects}")

print("\nAnnotated images saved in runs/detect/predict folder")