from scoring_engine import calculate_shelf_scores

def generate_recommendations():
    scores = calculate_shelf_scores()

    if not scores:
        print("No scoring data available.")
        return []

    sorted_shelves = sorted(scores.items(), key=lambda x: x[1]["attractiveness_score"], reverse=True)
    avg_score = sum(s["attractiveness_score"] for _, s in sorted_shelves) / len(sorted_shelves)

    recommendations = []

    for shelf, data in sorted_shelves:
        score = data["attractiveness_score"]
        shelf_recs = []

        # 1. Shelf optimization recommendation
        if score >= avg_score * 1.3:
            shelf_recs.append({
                "type": "Shelf Optimization",
                "text": f"'{shelf}' is a top performer (score: {score}). Maintain current positioning as a benchmark."
            })
        elif score <= avg_score * 0.5:
            shelf_recs.append({
                "type": "Shelf Optimization",
                "text": f"'{shelf}' is underperforming (score: {score}). Recommend relocating to a higher-traffic zone."
            })
        else:
            shelf_recs.append({
                "type": "Shelf Optimization",
                "text": f"'{shelf}' shows average performance (score: {score}). Continue monitoring."
            })

        # 2. Product placement recommendation
        if data["shelf_visibility_score"] < 30:
            shelf_recs.append({
                "type": "Product Placement",
                "text": f"Low visibility detected on '{shelf}'. Consider moving key products to eye-level shelving."
            })
        else:
            shelf_recs.append({
                "type": "Product Placement",
                "text": f"'{shelf}' has good visibility. Current product placement is effective."
            })

        # 3. Promotional placement suggestion
        if data["conversion_potential_score"] < 20 and data["total_interactions"] > 0:
            shelf_recs.append({
                "type": "Promotional Placement",
                "text": f"'{shelf}' has interactions but low conversion. Consider adding promotional signage or discount tags here."
            })
        elif data["total_interactions"] == 0:
            shelf_recs.append({
                "type": "Promotional Placement",
                "text": f"'{shelf}' shows zero engagement. A promotional campaign or featured display could help draw attention."
            })
        else:
            shelf_recs.append({
                "type": "Promotional Placement",
                "text": f"'{shelf}' converts well already; no urgent promotional changes needed."
            })

        # 4. Consumer engagement recommendation
        if data["returned_count"] > data["purchased_count"] * 2:
            shelf_recs.append({
                "type": "Consumer Engagement",
                "text": f"High 'return' behavior on '{shelf}' suggests interest without commitment. Consider clearer product information or pricing labels."
            })
        elif data["compared_count"] >= 1:
            shelf_recs.append({
                "type": "Consumer Engagement",
                "text": f"Customers are comparing products at '{shelf}'. Consider adding comparison charts or bundle offers to simplify decisions."
            })
        else:
            shelf_recs.append({
                "type": "Consumer Engagement",
                "text": f"Engagement pattern at '{shelf}' looks stable. No specific action needed."
            })

        # 5. Layout improvement suggestion
        if data["engagement_score"] < 20:
            shelf_recs.append({
                "type": "Layout Improvement",
                "text": f"'{shelf}' sees low foot traffic engagement. Consider repositioning it closer to high-traffic store zones or entry points."
            })
        else:
            shelf_recs.append({
                "type": "Layout Improvement",
                "text": f"'{shelf}' is well-positioned within current store layout."
            })

        recommendations.append({
            "shelf": shelf,
            "attractiveness_score": score,
            "recommendations": shelf_recs
        })

    return recommendations


if __name__ == "__main__":
    recs = generate_recommendations()
    print("--- Full Optimization & Recommendation Report ---\n")
    for shelf_rec in recs:
        print(f"📍 {shelf_rec['shelf']} (Score: {shelf_rec['attractiveness_score']})")
        for r in shelf_rec["recommendations"]:
            print(f"   [{r['type']}] {r['text']}")
        print()