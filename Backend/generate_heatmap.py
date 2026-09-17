import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend - prevents tkinter errors in server context
from database import SessionLocal
import models
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

FRAME_WIDTH = 640
FRAME_HEIGHT = 480

def generate_store_heatmap():
    """1. Overall store heatmap - all position points regardless of attention"""
    db = SessionLocal()
    points = db.query(models.PositionPoint).all()
    db.close()

    if not points:
        print("No position data found.")
        return

    x_coords = [p.x for p in points]
    y_coords = [p.y for p in points]

    plt.figure(figsize=(10, 7))
    sns.kdeplot(x=x_coords, y=y_coords, cmap="Reds", fill=True, thresh=0.05, levels=100)
    plt.xlim(0, FRAME_WIDTH)
    plt.ylim(FRAME_HEIGHT, 0)
    plt.title("1. Store Heatmap - Overall Presence")
    plt.xlabel("Store Width (pixels)")
    plt.ylabel("Store Depth (pixels)")
    plt.savefig("heatmap_1_store.png", dpi=150)
    print("Saved: heatmap_1_store.png")
    plt.close()


def generate_traffic_heatmap():
    """4. Customer traffic heatmap - shows movement density (same base data, framed as 'traffic')"""
    db = SessionLocal()
    points = db.query(models.PositionPoint).all()
    db.close()

    if not points:
        return

    x_coords = [p.x for p in points]
    y_coords = [p.y for p in points]

    plt.figure(figsize=(10, 7))
    plt.hist2d(x_coords, y_coords, bins=30, cmap="Blues")
    plt.colorbar(label="Traffic density (visits)")
    plt.xlim(0, FRAME_WIDTH)
    plt.ylim(FRAME_HEIGHT, 0)
    plt.title("4. Customer Traffic Heatmap")
    plt.xlabel("Store Width (pixels)")
    plt.ylabel("Store Depth (pixels)")
    plt.savefig("heatmap_4_traffic.png", dpi=150)
    print("Saved: heatmap_4_traffic.png")
    plt.close()


def generate_shelf_heatmaps():
    """2. Shelf heatmap generation - separate heatmap per shelf/zone, using AttentionRecord data"""
    db = SessionLocal()
    records = db.query(models.AttentionRecord).all()
    db.close()

    if not records:
        print("No attention records found.")
        return

    zone_durations = {}
    for r in records:
        zone_durations[r.zone] = zone_durations.get(r.zone, 0) + r.duration_seconds

    zones = list(zone_durations.keys())
    durations = list(zone_durations.values())

    plt.figure(figsize=(10, 6))
    bars = plt.bar(zones, durations, color='orangered')
    plt.title("2. Shelf Heatmap - Total Dwell Time per Shelf")
    plt.xlabel("Shelf / Zone")
    plt.ylabel("Total Attention Duration (seconds)")
    plt.xticks(rotation=20, ha='right')
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2, height, f'{height}s', ha='center', va='bottom')
    plt.tight_layout()
    plt.savefig("heatmap_2_shelves.png", dpi=150)
    print("Saved: heatmap_2_shelves.png")
    plt.close()

    return zone_durations


def generate_product_attention_heatmap():
    """3. Product attention heatmap - based on ProductInteraction data (Viewed/Picked Up/etc per shelf)"""
    db = SessionLocal()
    interactions = db.query(models.ProductInteraction).all()
    db.close()

    if not interactions:
        print("No product interaction data found.")
        return

    shelf_interaction_counts = {}
    for i in interactions:
        key = (i.shelf_zone, i.interaction_type)
        shelf_interaction_counts[key] = shelf_interaction_counts.get(key, 0) + 1

    shelves = sorted(set(k[0] for k in shelf_interaction_counts.keys()))
    types = sorted(set(k[1] for k in shelf_interaction_counts.keys()))

    matrix = np.zeros((len(types), len(shelves)))
    for (shelf, itype), count in shelf_interaction_counts.items():
        matrix[types.index(itype)][shelves.index(shelf)] = count

    plt.figure(figsize=(12, 6))
    sns.heatmap(matrix, annot=True, fmt='g', xticklabels=shelves, yticklabels=types, cmap="YlOrRd")
    plt.title("3. Product Attention Heatmap - Interaction Type by Shelf")
    plt.xlabel("Shelf")
    plt.ylabel("Interaction Type")
    plt.xticks(rotation=20, ha='right')
    plt.tight_layout()
    plt.savefig("heatmap_3_product_attention.png", dpi=150)
    print("Saved: heatmap_3_product_attention.png")
    plt.close()


def engagement_hotspot_analysis(zone_durations):
    """5. Engagement hotspot analysis - identify and name the top hotspots"""
    if not zone_durations:
        print("No zone data for hotspot analysis.")
        return

    sorted_zones = sorted(zone_durations.items(), key=lambda x: x[1], reverse=True)

    print("\n--- 5. Engagement Hotspot Analysis ---")
    for rank, (zone, duration) in enumerate(sorted_zones, start=1):
        label = "🔥 TOP HOTSPOT" if rank == 1 else ("Secondary hotspot" if rank == 2 else "Low engagement")
        print(f"#{rank}: {zone} - {duration}s total attention - {label}")


if __name__ == "__main__":
    print("Generating all Module 7 heatmaps...\n")
    generate_store_heatmap()
    generate_traffic_heatmap()
    zone_durations = generate_shelf_heatmaps()
    generate_product_attention_heatmap()
    engagement_hotspot_analysis(zone_durations)
    print("\nAll heatmaps generated successfully!")