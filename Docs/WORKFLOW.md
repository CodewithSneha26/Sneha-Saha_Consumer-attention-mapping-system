# Consumer Attention Mapping System - Project Workflow

```mermaid
graph TD
    %% Core Styling Definitions
    classDef titleStyle fill:#1e293b,stroke:#0f172a,stroke-width:2px,color:#fff,font-weight:bold;
    classDef startEnd fill:#475569,stroke:#334155,stroke-width:2px,color:#fff,font-weight:bold;
    classDef engineBox fill:#f8fafc,stroke:#475569,stroke-width:2px,font-weight:bold;
    classDef subBox fill:#f1f5f9,stroke:#94a3b8,stroke-width:1px;
    classDef matrixBox fill:#eff6ff,stroke:#3b82f6,stroke-width:2px;

    %% Title and Entry
    Title[CONSUMER ATTENTION MAPPING SYSTEM WORKFLOW]:::titleStyle
    Title --> Start([START]):::startEnd
    
    %% Step 1
    Start --> Step1["1. USER AUTHENTICATION & ACCESS<br>Roles: Store Manager | Retail Analyst | Marketing Manager | Administrator"]:::engineBox
    subgraph S1 [Authentication Features]
        Step1 --> S1_1[• User Registration]:::subBox
        Step1 --> S1_2[• JWT / OAuth2 Login]:::subBox
        Step1 --> S1_3[• Role Verification]:::subBox
        Step1 --> S1_4[• User Profile Management]:::subBox
    end

    %% Step 2
    S1 --> Step2["2. STORE & SHELF MANAGEMENT"]:::engineBox
    subgraph S2 [Management Features]
        Step2 --> S2_1[• Register Store]:::subBox
        Step2 --> S2_2[• Shelf Mapping]:::subBox
        Step2 --> S2_3[• Product Placement]:::subBox
        Step2 --> S2_4[• Zone Configuration]:::subBox
        Step2 --> S2_5[• Camera Assignment]:::subBox
    end

    %% Step 3
    S2 --> Step3["3. RETAIL CAMERA INPUT"]:::engineBox
    subgraph S3 [Ingestion Features]
        Step3 --> S3_1[• Live Camera Feed]:::subBox
        Step3 --> S3_2[• Video Streaming]:::subBox
        Step3 --> S3_3[• Frame Extraction]:::subBox
        Step3 --> S3_4[• Image Preprocessing]:::subBox
    end

    %% Step 4
    S3 --> Step4["4. CONSUMER DETECTION & TRACKING ENGINE"]:::engineBox
    subgraph S4 [Tracking Features]
        Step4 --> S4_1[• Person Detection YOLOv8]:::subBox
        Step4 --> S4_2[• Multi-Person Tracking DeepSORT / ByteTrack]:::subBox
        Step4 --> S4_3[• Shopper Identification]:::subBox
        Step4 --> S4_4[• Entry / Exit Monitoring]:::subBox
        Step4 --> S4_5[• Zone Tracking]:::subBox
        Step4 --> S4_6[• Journey Path Tracking]:::subBox
    end

    %% Step 5
    S4 --> Step5["5. ATTENTION ANALYSIS ENGINE"]:::engineBox
    subgraph S5 [Attention Metrics]
        Step5 --> S5_1[• Gaze Estimation]:::subBox
        Step5 --> S5_2[• Head Pose Analysis]:::subBox
        Step5 --> S5_3[• Shelf Attention Detection]:::subBox
        Step5 --> S5_4[• Product Focus Detection]:::subBox
        Step5 --> S5_5[• Dwell Time Calculation]:::subBox
        Step5 --> S5_6[• Repeated Attention Events]:::subBox
    end

    %% Step 6
    S5 --> Step6["6. PRODUCT INTERACTION ANALYSIS"]:::engineBox
    subgraph S6 [Interaction Types]
        Step6 --> S6_1[• Product Viewed]:::subBox
        Step6 --> S6_2[• Product Picked Up]:::subBox
        Step6 --> S6_3[• Product Returned]:::subBox
        Step6 --> S6_4[• Product Purchased]:::subBox
        Step6 --> S6_5[• Product Comparison Analysis]:::subBox
    end

    %% Step 7
    S6 --> Step7["7. CONSUMER BEHAVIOR INTELLIGENCE"]:::engineBox
    subgraph S7 [Intelligence Features]
        Step7 --> S7_1[• Shopping Pattern Analysis]:::subBox
        Step7 --> S7_2[• Consumer Segmentation]:::subBox
        Step7 --> S7_3[• Product Preference Analysis]:::subBox
        Step7 --> S7_4[• Journey Analytics]:::subBox
        Step7 --> S7_5[• Movement Behavior Analysis]:::subBox
    end
    
    S7 --> SegBox["CONSUMER SEGMENTATION ROLES<br>• Explorer<br>• Quick Buyer<br>• Comparison Shopper<br>• Impulse Buyer<br>• Brand Loyal Customer"]:::matrixBox

    %% Step 8
    SegBox --> Step8["8. ATTENTION HEATMAP GENERATION"]:::engineBox
    subgraph S8 [Heatmap Categories]
        Step8 --> S8_1[• Store Heatmap]:::subBox
        Step8 --> S8_2[• Shelf Heatmap]:::subBox
        Step8 --> S8_3[• Product Heatmap]:::subBox
        Step8 --> S8_4[• Customer Traffic Heatmap]:::subBox
        Step8 --> S8_5[• Engagement Hotspots]:::subBox
    end

    %% Step 9
    S8 --> Step9["9. PRODUCT ATTRACTIVENESS SCORING ENGINE<br>• Attention Duration ───> 35%<br>• Interaction Frequency ──> 25%<br>• Product Pickup Rate ───> 20%<br>• Purchase Conversion ───> 15%<br>• Repeat Engagement ────> 5%"]:::matrixBox

    %% Step 10
    Step9 --> Step10["10. RECOMMENDATION & OPTIMIZATION ENGINE"]:::engineBox
    subgraph S10 [Optimization Features]
        Step10 --> S10_1[• Shelf Optimization]:::subBox
        Step10 --> S10_2[• Product Placement Recommendation]:::subBox
        Step10 --> S10_3[• Promotion Optimization]:::subBox
        Step10 --> S10_4[• Consumer Engagement Suggestions]:::subBox
        Step10 --> S10_5[• Store Layout Improvement]:::subBox
    end

    %% Analytics Dashboard Matrix
    S10 --> DashTitle[ANALYTICS DASHBOARD MATRIX]:::titleStyle
    
    subgraph DashMatrix [Role Analytics Matrix]
        ManagerBox["STORE MANAGER<br>• Traffic Analytics<br>• Shelf Reports<br>• Conversion"]:::subBox
        AnalystBox["RETAIL ANALYST<br>• Heatmaps<br>• Behavior Analysis<br>• Journey Analytics"]:::subBox
        MarketingBox["MARKETING MANAGER<br>• Campaign Analytics<br>• Product Visibility<br>• Promotions"]:::subBox
    end
    DashTitle --> ManagerBox & AnalystBox & MarketingBox

    %% Downstream Actions
    ManagerBox & AnalystBox & MarketingBox --> ActionsTitle[SYSTEM OUTPUT CHANNELS]:::titleStyle
    
    subgraph ActionsMatrix [Outputs]
        AlertsBox["NOTIFICATIONS & ALERTS<br>• Shelf Alerts<br>• Camera Health<br>• Traffic Alerts<br>• Platform Notifications"]:::subBox
        ReportsBox["REPORTS & EXPORT<br>• Attention Report<br>• Shelf Report<br>• Engagement Report<br>• PDF / Excel Export"]:::subBox
    end
    ActionsTitle --> AlertsBox & ReportsBox

    %% Final Infrastructure & Exit
    AlertsBox & ReportsBox --> Step11["11. DEPLOYMENT PIPELINE<br>Docker ──> AWS / Azure ──> Monitoring ──> Logging ──> Production"]:::matrixBox
    Step11 --> End([END]):::startEnd