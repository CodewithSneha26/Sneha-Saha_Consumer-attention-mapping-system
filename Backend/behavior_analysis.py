from database import SessionLocal
import models

def classify_shopper(track_id: int, db):
    attention_records = db.query(models.AttentionRecord).filter(
        models.AttentionRecord.person_track_id == track_id
    ).all()

    interactions = db.query(models.ProductInteraction).filter(
        models.ProductInteraction.person_track_id == track_id
    ).all()

    if not attention_records:
        return "Unknown (no data)"

    zones_visited = set(r.zone for r in attention_records)
    total_time = sum(r.duration_seconds for r in attention_records)
    total_interactions = len(interactions)
    picked_up_count = sum(1 for i in interactions if "Picked Up" in i.interaction_type)
    purchased_count = sum(1 for i in interactions if "Purchased" in i.interaction_type)
    compared_count = sum(1 for i in interactions if "Compared" in i.interaction_type)

    # Rule-based classification
    if purchased_count >= 1 and len(zones_visited) == 1:
        segment = "Brand Loyal Customer"
    elif compared_count >= 1 or (len(zones_visited) >= 2 and picked_up_count >= 2):
        segment = "Comparison Shopper"
    elif len(zones_visited) >= 3 and total_time > 15:
        segment = "Explorer"
    elif total_time < 5 and total_interactions <= 1:
        segment = "Quick Buyer"
    elif picked_up_count >= 1 and total_time < 8:
        segment = "Impulse Buyer"
    else:
        segment = "Explorer"

    return {
        "person_track_id": track_id,
        "segment": segment,
        "zones_visited": list(zones_visited),
        "total_time_seconds": total_time,
        "total_interactions": total_interactions,
        "picked_up_count": picked_up_count,
        "purchased_count": purchased_count,
        "compared_count": compared_count
    }


if __name__ == "__main__":
    db = SessionLocal()

    all_ids = db.query(models.AttentionRecord.person_track_id).distinct().all()
    person_ids = [row[0] for row in all_ids]

    print("--- Consumer Behavior Analysis ---\n")
    for pid in person_ids:
        result = classify_shopper(pid, db)
        print(result)
        print()

    db.close()