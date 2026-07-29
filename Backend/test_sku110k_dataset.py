from ultralytics import YOLO
import os

model = YOLO("yolov8m.pt")
folder = "test_images/sku110k_samples"

print("Running current YOLOv8 model (COCO-trained) on SKU-110K shelf images...\n")
print("Purpose: Testing whether general object detection can identify individual products/SKUs on shelves.\n")

for filename in os.listdir(folder):
    if filename.lower().endswith(('.jpg', '.png', '.jpeg')):
        path = os.path.join(folder, filename)
        results = model(path, save=True, conf=0.15)
        for r in results:
            detected_objects = [model.names[int(box.cls[0])] for box in r.boxes]
            count = len(detected_objects)
            print(f"{filename}: {count} object(s) detected → {detected_objects}")

print("\nAnnotated images saved in runs/detect/predict folder")
print("\nNote: SKU-110K images typically contain 50-100+ individual products per shelf image.")
print("If detected counts above are much lower, this confirms the current COCO-trained model")
print("cannot identify individual retail products - it would need custom training on SKU-110K")
print("annotations to recognize specific SKUs, rather than general object categories.")