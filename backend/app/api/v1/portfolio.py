from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from app.database.session import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.get("/projects", response_model=List[schemas.ProjectOut])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).order_by(models.Project.display_order.asc(), models.Project.id.asc()).all()

@router.get("/skills", response_model=List[schemas.SkillOut])
def get_skills(db: Session = Depends(get_db)):
    return db.query(models.Skill).filter(models.Skill.is_active == True).all()

@router.get("/experiences", response_model=List[schemas.ExperienceOut])
def get_experiences(db: Session = Depends(get_db)):
    return db.query(models.Experience).order_by(models.Experience.display_order.asc(), models.Experience.id.asc()).all()

@router.get("/research-papers", response_model=List[schemas.ResearchPaperOut])
def get_research_papers(db: Session = Depends(get_db)):
    return db.query(models.ResearchPaper).all()

@router.get("/achievements", response_model=List[schemas.AchievementOut])
def get_achievements(db: Session = Depends(get_db)):
    return db.query(models.Achievement).order_by(models.Achievement.display_order.asc(), models.Achievement.id.asc()).all()

@router.get("/social-links", response_model=List[schemas.SocialLinkOut])
def get_social_links(db: Session = Depends(get_db)):
    return db.query(models.SocialLink).all()

@router.get("/education", response_model=List[schemas.EducationOut])
def get_education(db: Session = Depends(get_db)):
    return db.query(models.Education).order_by(models.Education.display_order.asc(), models.Education.id.asc()).all()

@router.get("/certifications", response_model=List[schemas.CertificationOut])
def get_certifications(db: Session = Depends(get_db)):
    return db.query(models.Certification).order_by(models.Certification.display_order.asc(), models.Certification.id.asc()).all()

@router.get("/technical-events", response_model=List[schemas.TechnicalEventOut])
def get_technical_events(db: Session = Depends(get_db)):
    return db.query(models.TechnicalEvent).order_by(models.TechnicalEvent.display_order.asc(), models.TechnicalEvent.id.asc()).all()

@router.get("/site-settings", response_model=Dict[str, str])
def get_site_settings(db: Session = Depends(get_db)):
    settings_list = db.query(models.SiteSetting).all()
    return {setting.key: setting.value for setting in settings_list}
