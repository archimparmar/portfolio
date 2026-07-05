from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.get("/posts", response_model=List[schemas.BlogPostOut])
def get_posts(db: Session = Depends(get_db)):
    return db.query(models.BlogPost).filter(models.BlogPost.is_draft == False).order_by(models.BlogPost.published_at.desc()).all()

@router.get("/posts/{slug}", response_model=schemas.BlogPostOut)
def get_post_by_slug(slug: str, db: Session = Depends(get_db)):
    post = db.query(models.BlogPost).filter(
        models.BlogPost.slug == slug, 
        models.BlogPost.is_draft == False
    ).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post
