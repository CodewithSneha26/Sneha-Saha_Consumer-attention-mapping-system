from database import SessionLocal
import models
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

def generate_attention_heatmap(frame_width=640, frame_height=480, output_path="attention_heatmap.png"):
    db = SessionLocal()
    points = db.query(models.PositionPoint).all()
    db.close()

    if not points:
        print("No position data found. Run unified_tracking.py first to collect data.")
        return

    x_coords = [p.x for p in points]
    y_coords = [p.y for p in points]

    print(f"Generating heatmap from {len(points)} recorded position points...")

    plt.figure(figsize=(10, 7))
    sns.kdeplot(
        x=x_coords,
        y=y_coords,
        cmap="Reds",
        fill=True,
        thresh=0.05,
        levels=100
    )
    plt.xlim(0, frame_width)
    plt.ylim(frame_height, 0)  # invert y-axis since image coordinates start top-left
    plt.title("Consumer Attention Heatmap - Store Floor")
    plt.xlabel("Store Width (pixels)")
    plt.ylabel("Store Depth (pixels)")
    plt.savefig(output_path, dpi=150)
    print(f"Heatmap saved to: {output_path}")
    plt.show()

if __name__ == "__main__":
    generate_attention_heatmap()