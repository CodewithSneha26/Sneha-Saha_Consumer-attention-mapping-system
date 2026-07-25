from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)

class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)

class Shelf(Base):
    __tablename__ = "shelves"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    shelf_name = Column(String, nullable=False)
    zone = Column(String, nullable=True)

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    camera_name = Column(String, nullable=False)
    location_description = Column(String, nullable=True)

from datetime import datetime

class DetectionSession(Base):
    __tablename__ = "detection_sessions"

    id = Column(Integer, primary_key=True, index=True)
    person_track_id = Column(Integer, nullable=False)
    dwell_time_seconds = Column(Integer, nullable=False)
    positions_recorded = Column(Integer, nullable=False)
    created_at = Column(String, default=lambda: datetime.now().isoformat())

class AttentionRecord(Base):
    __tablename__ = "attention_records"

    id = Column(Integer, primary_key=True, index=True)
    person_track_id = Column(Integer, nullable=False)
    zone = Column(String, nullable=True)
    attention_status = Column(String, nullable=False)
    duration_seconds = Column(Integer, nullable=False)
    created_at = Column(String, default=lambda: datetime.now().isoformat())

class ProductInteraction(Base):
    __tablename__ = "product_interactions"

    id = Column(Integer, primary_key=True, index=True)
    person_track_id = Column(Integer, nullable=False)
    shelf_zone = Column(String, nullable=False)
    interaction_type = Column(String, nullable=False)  # "Viewed", "Picked Up" (simulated)
    duration_seconds = Column(Integer, nullable=False)
    created_at = Column(String, default=lambda: datetime.now().isoformat())

class JourneyLog(Base):
    __tablename__ = "journey_logs"

    id = Column(Integer, primary_key=True, index=True)
    person_track_id = Column(Integer, nullable=False)
    zone = Column(String, nullable=False)
    sequence_number = Column(Integer, nullable=False)  # order in which this zone was visited
    entered_at = Column(String, default=lambda: datetime.now().isoformat())

class PositionPoint(Base):
    __tablename__ = "position_points"

    id = Column(Integer, primary_key=True, index=True)
    person_track_id = Column(Integer, nullable=False)
    x = Column(Integer, nullable=False)
    y = Column(Integer, nullable=False)
    recorded_at = Column(String, default=lambda: datetime.now().isoformat())