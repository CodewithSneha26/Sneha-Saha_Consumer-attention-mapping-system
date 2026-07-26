import scoring_engine
import behavior_analysis
from fastapi import UploadFile, File
import shutil
import os
import detection
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models
import schemas
import auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Consumer Attention Mapping System - Backend is running!"}

@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = auth.hash_password(user.password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_pw,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=schemas.Token)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = auth.create_access_token(data={"sub": db_user.email, "role": db_user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/stores", response_model=schemas.StoreResponse)
def create_store(store: schemas.StoreCreate, db: Session = Depends(get_db)):
    new_store = models.Store(
        name=store.name,
        location=store.location
    )
    db.add(new_store)
    db.commit()
    db.refresh(new_store)
    return new_store

@app.get("/stores", response_model=list[schemas.StoreResponse])
def get_stores(db: Session = Depends(get_db)):
    stores = db.query(models.Store).all()
    return stores

@app.post("/shelves", response_model=schemas.ShelfResponse)
def create_shelf(shelf: schemas.ShelfCreate, db: Session = Depends(get_db)):
    store = db.query(models.Store).filter(models.Store.id == shelf.store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    new_shelf = models.Shelf(
        store_id=shelf.store_id,
        shelf_name=shelf.shelf_name,
        zone=shelf.zone
    )
    db.add(new_shelf)
    db.commit()
    db.refresh(new_shelf)
    return new_shelf

@app.get("/shelves", response_model=list[schemas.ShelfResponse])
def get_shelves(db: Session = Depends(get_db)):
    shelves = db.query(models.Shelf).all()
    return shelves

@app.post("/cameras", response_model=schemas.CameraResponse)
def create_camera(camera: schemas.CameraCreate, db: Session = Depends(get_db)):
    store = db.query(models.Store).filter(models.Store.id == camera.store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    new_camera = models.Camera(
        store_id=camera.store_id,
        camera_name=camera.camera_name,
        location_description=camera.location_description
    )
    db.add(new_camera)
    db.commit()
    db.refresh(new_camera)
    return new_camera

@app.get("/cameras", response_model=list[schemas.CameraResponse])
def get_cameras(db: Session = Depends(get_db)):
    cameras = db.query(models.Camera).all()
    return cameras

@app.post("/detect-people")
def detect_people_endpoint(file: UploadFile = File(...)):
    # Save the uploaded image temporarily
    upload_folder = "uploaded_images"
    os.makedirs(upload_folder, exist_ok=True)
    
    file_path = os.path.join(upload_folder, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Run detection
    result = detection.detect_people(file_path)
    
    return result

@app.get("/behavior-analysis/{track_id}")
def get_behavior_analysis(track_id: int, db: Session = Depends(get_db)):
    result = behavior_analysis.classify_shopper(track_id, db)
    return result

@app.get("/shelf-scores")
def get_shelf_scores():
    scores = scoring_engine.calculate_shelf_scores()
    return scores

