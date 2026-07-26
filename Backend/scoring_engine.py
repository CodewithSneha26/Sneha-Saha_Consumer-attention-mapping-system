from database import SessionLocal
import models

def calculate_shelf_scores():
    db = SessionLocal()

    attention_records = db.query(models.AttentionRecord).all()
    interactions = db.query(models.ProductInteraction).all()

    db.close()

    if not attention_records:
        print("No attention data found. Run unified_tracking.py first.")
        return {}

    # Gather raw metrics per shelf
    shelf_data = {}

    for r in attention_records:
        if r.zone not in shelf_data:
            shelf_data[r.zone] = {
                "total_attention_time": 0,
                "total_interactions": 0,
                "picked_up_count": 0,
                "purchased_count": 0,
                "returned_count": 0,
                "compared_count": 0
            }
        shelf_data[r.zone]["total_attention_time"] += r.duration_seconds

    for i in interactions:
        if i.shelf_zone not in shelf_data:
            shelf_data[i.shelf_zone] = {
                "total_attention_time": 0,
                "total_interactions": 0,
                "picked_up_count": 0,
                "purchased_count": 0,
                "returned_count": 0,
                "compared_count": 0
            }
        shelf_data[i.shelf_zone]["total_interactions"] += 1
        if "Picked Up" in i.interaction_type:
            shelf_data[i.shelf_zone]["picked_up_count"] += 1
        if "Purchased" in i.interaction_type:
            shelf_data[i.shelf_zone]["purchased_count"] += 1
        if "Returned" in i.interaction_type:
            shelf_data[i.shelf_zone]["returned_count"] += 1
        if "Compared" in i.interaction_type:
            shelf_data[i.shelf_zone]["compared_count"] += 1

    # Normalize values (0-100 scale) for fair weighting
    max_attention = max((s["total_attention_time"] for s in shelf_data.values()), default=1) or 1
    max_interactions = max((s["total_interactions"] for s in shelf_data.values()), default=1) or 1

    scores = {}
    for shelf, data in shelf_data.items():
        attention_score = (data["total_attention_time"] / max_attention) * 100
        interaction_freq_score = (data["total_interactions"] / max_interactions) * 100
        pickup_rate = (data["picked_up_count"] / data["total_interactions"] * 100) if data["total_interactions"] > 0 else 0
        conversion_rate = (data["purchased_count"] / data["total_interactions"] * 100) if data["total_interactions"] > 0 else 0
        repeat_rate = (data["compared_count"] / data["total_interactions"] * 100) if data["total_interactions"] > 0 else 0

        final_score = (
            attention_score * 0.35 +
            interaction_freq_score * 0.25 +
            pickup_rate * 0.20 +
            conversion_rate * 0.15 +
            repeat_rate * 0.05
        )

        scores[shelf] = {
            "attractiveness_score": round(final_score, 2),
            "attention_duration_seconds": data["total_attention_time"],
            "total_interactions": data["total_interactions"],
            "picked_up_count": data["picked_up_count"],
            "purchased_count": data["purchased_count"],
            "compared_count": data["compared_count"],
            "returned_count": data["returned_count"]
        }

    return scores


if __name__ == "__main__":
    scores = calculate_shelf_scores()
    print("--- Product Attractiveness Scoring ---\n")
    
    sorted_shelves = sorted(scores.items(), key=lambda x: x[1]["attractiveness_score"], reverse=True)
    
    for rank, (shelf, data) in enumerate(sorted_shelves, start=1):
        print(f"#{rank}: {shelf}")
        print(f"   Attractiveness Score: {data['attractiveness_score']}/100")
        print(f"   Attention Duration: {data['attention_duration_seconds']}s")
        print(f"   Total Interactions: {data['total_interactions']}")
        print(f"   Picked Up: {data['picked_up_count']} | Purchased: {data['purchased_count']} | Compared: {data['compared_count']}")
        print()