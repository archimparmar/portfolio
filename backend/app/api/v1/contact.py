from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.post("/", response_model=schemas.ContactMessageOut, status_code=status.HTTP_201_CREATED)
def submit_contact_message(
    message_in: schemas.ContactMessageCreate,
    db: Session = Depends(get_db)
):
    db_message = models.ContactMessage(
        name=message_in.name,
        email=message_in.email,
        message=message_in.message
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Place hook here for email notifications or logging in the terminal
    print(f"NEW PORTFOLIO MESSAGE from {db_message.name} ({db_message.email}): {db_message.message}")
    
    return db_message
