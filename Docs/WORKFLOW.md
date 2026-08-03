╔════════════════════════════════════════════════════════════════════════════════════╗
║                 CONSUMER ATTENTION MAPPING SYSTEM WORKFLOW                        ║
╚════════════════════════════════════════════════════════════════════════════════════╝

                                        START
                                          │
                                          ▼

┌──────────────────────────────────────────────────────────────────────────────────┐
│ 1. USER AUTHENTICATION & ACCESS                                                   │
│──────────────────────────────────────────────────────────────────────────────────│
│ • User Registration                                                               │
│ • JWT / OAuth2 Login                                                              │
│ • Role Verification                                                               │
│ • User Profile Management                                                         │
│ Roles: Store Manager | Retail Analyst | Marketing Manager | Administrator         │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼

┌──────────────────────────────────────────────────────────────────────────────────┐
│ 2. STORE & SHELF MANAGEMENT                                                       │
│──────────────────────────────────────────────────────────────────────────────────│
│ • Register Store                                                                  │
│ • Shelf Mapping                                                                   │
│ • Product Placement                                                               │
│ • Zone Configuration                                                              │
│ • Camera Assignment                                                               │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼

┌──────────────────────────────────────────────────────────────────────────────────┐
│ 3. RETAIL CAMERA INPUT                                                            │
│──────────────────────────────────────────────────────────────────────────────────│
│ • Live Camera Feed                                                                │
│ • Video Streaming                                                                 │
│ • Frame Extraction                                                                │
│ • Image Preprocessing                                                             │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼

┌──────────────────────────────────────────────────────────────────────────────────┐
│ 4. CONSUMER DETECTION & TRACKING ENGINE                                           │
│──────────────────────────────────────────────────────────────────────────────────│
│ • Person Detection (YOLOv8)                                                       │
│ • Multi-Person Tracking (DeepSORT / ByteTrack)                                   │
│ • Shopper Identification                                                          │
│ • Entry / Exit Monitoring                                                         │
│ • Zone Tracking                                                                   │
│ • Journey Path Tracking                                                           │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼

┌──────────────────────────────────────────────────────────────────────────────────┐
│ 5. ATTENTION ANALYSIS ENGINE                                                      │
│──────────────────────────────────────────────────────────────────────────────────│
│ • Gaze Estimation                                                                 │
│ • Head Pose Analysis                                                              │
│ • Shelf Attention Detection                                                       │
│ • Product Focus Detection                                                         │
│ • Dwell Time Calculation                                                          │
│ • Repeated Attention Events                                                       │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼

┌──────────────────────────────────────────────────────────────────────────────────┐
│ 6. PRODUCT INTERACTION ANALYSIS                                                   │
│──────────────────────────────────────────────────────────────────────────────────│
│ • Product Viewed                                                                  │
│ • Product Picked Up                                                               │
│ • Product Returned                                                                │
│ • Product Purchased                                                               │
│ • Product Comparison Analysis                                                     │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼

┌──────────────────────────────────────────────────────────────────────────────────┐
│ 7. CONSUMER BEHAVIOR INTELLIGENCE                                                 │
│──────────────────────────────────────────────────────────────────────────────────│
│ • Shopping Pattern Analysis                                                       │
│ • Consumer Segmentation                                                           │
│ • Product Preference Analysis                                                     │
│ • Journey Analytics                                                               │
│ • Movement Behavior Analysis                                                      │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼

                    ┌─────────────────────────────────────────────┐
                    │ Consumer Segmentation                       │
                    ├─────────────────────────────────────────────┤
                    │ • Explorer                                 │
                    │ • Quick Buyer                              │
                    │ • Comparison Shopper                       │
                    │ • Impulse Buyer                            │
                    │ • Brand Loyal Customer                     │
                    └─────────────────────────────────────────────┘
                                          │
                                          ▼

┌──────────────────────────────────────────────────────────────────────────────────┐
│ 8. ATTENTION HEATMAP GENERATION                                                   │
│──────────────────────────────────────────────────────────────────────────────────│
│ • Store Heatmap                                                                   │
│ • Shelf Heatmap                                                                   │
│ • Product Heatmap                                                                 │
│ • Customer Traffic Heatmap                                                        │
│ • Engagement Hotspots                                                             │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼

┌──────────────────────────────────────────────────────────────────────────────────┐
│ 9. PRODUCT ATTRACTIVENESS SCORING ENGINE                                          │
│──────────────────────────────────────────────────────────────────────────────────│
│ Attention Duration        → 35%                                                   │
│ Interaction Frequency     → 25%                                                   │
│ Product Pickup Rate       → 20%                                                   │
│ Purchase Conversion       → 15%                                                   │
│ Repeat Engagement         → 5%                                                    │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼

┌──────────────────────────────────────────────────────────────────────────────────┐
│ 10. RECOMMENDATION & OPTIMIZATION ENGINE                                          │
│──────────────────────────────────────────────────────────────────────────────────│
│ • Shelf Optimization                                                              │
│ • Product Placement Recommendation                                                │
│ • Promotion Optimization                                                          │
│ • Consumer Engagement Suggestions                                                 │
│ • Store Layout Improvement                                                        │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼

                 ┌───────────────────────────────────────────────────────┐
                 │                ANALYTICS DASHBOARD                    │
                 ├───────────────┬────────────────┬──────────────────────┤
                 │ Store Manager │ Retail Analyst │ Marketing Manager    │
                 ├───────────────┼────────────────┼──────────────────────┤
                 │ Traffic       │ Heatmaps       │ Campaign Analytics   │
                 │ Shelf Reports │ Behavior       │ Product Visibility   │
                 │ Conversion    │ Journey        │ Promotions           │
                 └───────────────┴────────────────┴──────────────────────┘
                                          │
                                          ▼

        ┌───────────────────────────────┬────────────────────────────────┐
        │ Notifications & Alerts        │ Reports & Export               │
        ├───────────────────────────────┼────────────────────────────────┤
        │ Shelf Alerts                  │ Attention Report               │
        │ Camera Health                 │ Shelf Report                   │
        │ Traffic Alerts                │ Engagement Report              │
        │ Platform Notifications        │ PDF / Excel Export             │
        └───────────────────────────────┴────────────────────────────────┘
                                          │
                                          ▼
                                          
┌──────────────────────────────────────────────────────────────────────────────────┐
│ DEPLOYMENT                                                                        │
│──────────────────────────────────────────────────────────────────────────────────│
│ Docker → AWS / Azure → Monitoring → Logging → Production                         │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          
                                          
                                         END