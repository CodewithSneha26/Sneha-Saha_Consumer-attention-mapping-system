from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class StoreCreate(BaseModel):
    name: str
    location: str

class StoreResponse(BaseModel):
    id: int
    name: str
    location: str

    class Config:
        from_attributes = True

class ShelfCreate(BaseModel):
    store_id: int
    shelf_name: str
    zone: str | None = None

class ShelfResponse(BaseModel):
    id: int
    store_id: int
    shelf_name: str
    zone: str | None

    class Config:
        from_attributes = True

class CameraCreate(BaseModel):
    store_id: int
    camera_name: str
    location_description: str | None = None

class CameraResponse(BaseModel):
    id: int
    store_id: int
    camera_name: str
    location_description: str | None

    class Config:
        from_attributes = True