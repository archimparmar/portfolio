from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
import uuid
from app.database.session import get_db
from app.models import models
from app.schemas import schemas
from app.auth.deps import get_current_user

router = APIRouter()

# Guard dependency for all admin routes
admin_dependency = Depends(get_current_user)

# --- Projects Admin ---
@router.post("/projects", response_model=schemas.ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), _=admin_dependency):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.put("/projects/{project_id}", response_model=schemas.ProjectOut)
def update_project(project_id: int, project: schemas.ProjectUpdate, db: Session = Depends(get_db), _=admin_dependency):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in project.model_dump(exclude_unset=True).items():
        setattr(db_project, key, value)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db), _=admin_dependency):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return None

# --- Skills Admin ---
@router.post("/skills", response_model=schemas.SkillOut, status_code=status.HTTP_201_CREATED)
def create_skill(skill: schemas.SkillCreate, db: Session = Depends(get_db), _=admin_dependency):
    db_skill = models.Skill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.put("/skills/{skill_id}", response_model=schemas.SkillOut)
def update_skill(skill_id: int, skill: schemas.SkillUpdate, db: Session = Depends(get_db), _=admin_dependency):
    db_skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    for key, value in skill.model_dump(exclude_unset=True).items():
        setattr(db_skill, key, value)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(skill_id: int, db: Session = Depends(get_db), _=admin_dependency):
    db_skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(db_skill)
    db.commit()
    return None

# --- Experience Admin ---
@router.post("/experiences", response_model=schemas.ExperienceOut, status_code=status.HTTP_201_CREATED)
def create_experience(experience: schemas.ExperienceCreate, db: Session = Depends(get_db), _=admin_dependency):
    db_exp = models.Experience(**experience.model_dump())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp

@router.put("/experiences/{experience_id}", response_model=schemas.ExperienceOut)
def update_experience(experience_id: int, experience: schemas.ExperienceUpdate, db: Session = Depends(get_db), _=admin_dependency):
    db_exp = db.query(models.Experience).filter(models.Experience.id == experience_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    for key, value in experience.model_dump(exclude_unset=True).items():
        setattr(db_exp, key, value)
    db.commit()
    db.refresh(db_exp)
    return db_exp

@router.delete("/experiences/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experience(experience_id: int, db: Session = Depends(get_db), _=admin_dependency):
    db_exp = db.query(models.Experience).filter(models.Experience.id == experience_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(db_exp)
    db.commit()
    return None

# --- Research Paper Admin ---
@router.post("/research-papers", response_model=schemas.ResearchPaperOut, status_code=status.HTTP_201_CREATED)
def create_research_paper(paper: schemas.ResearchPaperCreate, db: Session = Depends(get_db), _=admin_dependency):
    db_paper = models.ResearchPaper(**paper.model_dump())
    db.add(db_paper)
    db.commit()
    db.refresh(db_paper)
    return db_paper

@router.put("/research-papers/{paper_id}", response_model=schemas.ResearchPaperOut)
def update_research_paper(paper_id: int, paper: schemas.ResearchPaperUpdate, db: Session = Depends(get_db), _=admin_dependency):
    db_paper = db.query(models.ResearchPaper).filter(models.ResearchPaper.id == paper_id).first()
    if not db_paper:
        raise HTTPException(status_code=404, detail="Research paper not found")
    for key, value in paper.model_dump(exclude_unset=True).items():
        setattr(db_paper, key, value)
    db.commit()
    db.refresh(db_paper)
    return db_paper

@router.delete("/research-papers/{paper_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_research_paper(paper_id: int, db: Session = Depends(get_db), _=admin_dependency):
    db_paper = db.query(models.ResearchPaper).filter(models.ResearchPaper.id == paper_id).first()
    if not db_paper:
        raise HTTPException(status_code=404, detail="Research paper not found")
    db.delete(db_paper)
    db.commit()
    return None

# --- Achievement Admin ---
@router.post("/achievements", response_model=schemas.AchievementOut, status_code=status.HTTP_201_CREATED)
def create_achievement(achievement: schemas.AchievementCreate, db: Session = Depends(get_db), _=admin_dependency):
    db_ach = models.Achievement(**achievement.model_dump())
    db.add(db_ach)
    db.commit()
    db.refresh(db_ach)
    return db_ach

@router.put("/achievements/{achievement_id}", response_model=schemas.AchievementOut)
def update_achievement(achievement_id: int, achievement: schemas.AchievementUpdate, db: Session = Depends(get_db), _=admin_dependency):
    db_ach = db.query(models.Achievement).filter(models.Achievement.id == achievement_id).first()
    if not db_ach:
        raise HTTPException(status_code=404, detail="Achievement not found")
    for key, value in achievement.model_dump(exclude_unset=True).items():
        setattr(db_ach, key, value)
    db.commit()
    db.refresh(db_ach)
    return db_ach

@router.delete("/achievements/{achievement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_achievement(achievement_id: int, db: Session = Depends(get_db), _=admin_dependency):
    db_ach = db.query(models.Achievement).filter(models.Achievement.id == achievement_id).first()
    if not db_ach:
        raise HTTPException(status_code=404, detail="Achievement not found")
    db.delete(db_ach)
    db.commit()
    return None

# --- Blog Posts Admin ---
@router.get("/blog/posts", response_model=List[schemas.BlogPostOut])
def get_all_posts_admin(db: Session = Depends(get_db), _=admin_dependency):
    return db.query(models.BlogPost).order_by(models.BlogPost.published_at.desc()).all()

@router.post("/blog/posts", response_model=schemas.BlogPostOut, status_code=status.HTTP_201_CREATED)
def create_blog_post(post: schemas.BlogPostCreate, db: Session = Depends(get_db), _=admin_dependency):
    # Ensure slug unique
    existing = db.query(models.BlogPost).filter(models.BlogPost.slug == post.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    db_post = models.BlogPost(**post.model_dump())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.put("/blog/posts/{post_id}", response_model=schemas.BlogPostOut)
def update_blog_post(post_id: int, post: schemas.BlogPostUpdate, db: Session = Depends(get_db), _=admin_dependency):
    db_post = db.query(models.BlogPost).filter(models.BlogPost.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    for key, value in post.model_dump(exclude_unset=True).items():
        if key == "slug" and value != db_post.slug:
            existing = db.query(models.BlogPost).filter(models.BlogPost.slug == value).first()
            if existing:
                raise HTTPException(status_code=400, detail="Slug already exists")
        setattr(db_post, key, value)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.delete("/blog/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog_post(post_id: int, db: Session = Depends(get_db), _=admin_dependency):
    db_post = db.query(models.BlogPost).filter(models.BlogPost.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    db.delete(db_post)
    db.commit()
    return None

# --- Social Links Admin ---
@router.post("/social-links", response_model=schemas.SocialLinkOut, status_code=status.HTTP_201_CREATED)
def create_social_link(link: schemas.SocialLinkCreate, db: Session = Depends(get_db), _=admin_dependency):
    db_link = models.SocialLink(**link.model_dump())
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link

@router.delete("/social-links/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_social_link(link_id: int, db: Session = Depends(get_db), _=admin_dependency):
    db_link = db.query(models.SocialLink).filter(models.SocialLink.id == link_id).first()
    if not db_link:
        raise HTTPException(status_code=404, detail="Social link not found")
    db.delete(db_link)
    db.commit()
    return None

# --- Contact Messages Admin ---
@router.get("/contact-messages", response_model=List[schemas.ContactMessageOut])
def get_contact_messages(db: Session = Depends(get_db), _=admin_dependency):
    return db.query(models.ContactMessage).order_by(models.ContactMessage.created_at.desc()).all()

@router.put("/contact-messages/{msg_id}/read", response_model=schemas.ContactMessageOut)
def mark_message_as_read(msg_id: int, db: Session = Depends(get_db), _=admin_dependency):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    db.commit()
    db.refresh(msg)
    return msg

@router.delete("/contact-messages/{msg_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact_message(msg_id: int, db: Session = Depends(get_db), _=admin_dependency):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return None

# --- Site Settings Admin ---
@router.put("/site-settings", response_model=schemas.SiteSettingOut)
def update_site_setting(setting: schemas.SiteSettingCreate, db: Session = Depends(get_db), _=admin_dependency):
    db_setting = db.query(models.SiteSetting).filter(models.SiteSetting.key == setting.key).first()
    if db_setting:
        db_setting.value = setting.value
    else:
        db_setting = models.SiteSetting(key=setting.key, value=setting.value)
        db.add(db_setting)
    db.commit()
    db.refresh(db_setting)
    return db_setting


# --- Education Admin ---
@router.post("/education", response_model=schemas.EducationOut, status_code=status.HTTP_201_CREATED)
def create_education(edu: schemas.EducationCreate, db: Session = Depends(get_db), _=admin_dependency):
    db_edu = models.Education(**edu.model_dump())
    db.add(db_edu)
    db.commit()
    db.refresh(db_edu)
    return db_edu

@router.put("/education/{edu_id}", response_model=schemas.EducationOut)
def update_education(edu_id: int, edu: schemas.EducationUpdate, db: Session = Depends(get_db), _=admin_dependency):
    db_edu = db.query(models.Education).filter(models.Education.id == edu_id).first()
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education entry not found")
    for key, value in edu.model_dump(exclude_unset=True).items():
        setattr(db_edu, key, value)
    db.commit()
    db.refresh(db_edu)
    return db_edu

@router.delete("/education/{edu_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_education(edu_id: int, db: Session = Depends(get_db), _=admin_dependency):
    db_edu = db.query(models.Education).filter(models.Education.id == edu_id).first()
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education entry not found")
    db.delete(db_edu)
    db.commit()
    return None


# --- Certifications Admin ---
@router.post("/certifications", response_model=schemas.CertificationOut, status_code=status.HTTP_201_CREATED)
def create_certification(cert: schemas.CertificationCreate, db: Session = Depends(get_db), _=admin_dependency):
    db_cert = models.Certification(**cert.model_dump())
    db.add(db_cert)
    db.commit()
    db.refresh(db_cert)
    return db_cert

@router.put("/certifications/{cert_id}", response_model=schemas.CertificationOut)
def update_certification(cert_id: int, cert: schemas.CertificationUpdate, db: Session = Depends(get_db), _=admin_dependency):
    db_cert = db.query(models.Certification).filter(models.Certification.id == cert_id).first()
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    for key, value in cert.model_dump(exclude_unset=True).items():
        setattr(db_cert, key, value)
    db.commit()
    db.refresh(db_cert)
    return db_cert

@router.delete("/certifications/{cert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certification(cert_id: int, db: Session = Depends(get_db), _=admin_dependency):
    db_cert = db.query(models.Certification).filter(models.Certification.id == cert_id).first()
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    db.delete(db_cert)
    db.commit()
    return None


# --- Media Manager Admin ---
UPLOAD_DIR = "uploads"

@router.post("/media/upload", response_model=schemas.MediaAssetOut, status_code=status.HTTP_201_CREATED)
def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db), _=admin_dependency):
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
        
    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # File URL relative to api server
    file_url = f"/uploads/{unique_filename}"
    
    # Read size
    file_size = os.path.getsize(file_path)
    
    db_asset = models.MediaAsset(
        filename=file.filename,
        url=file_url,
        size_bytes=file_size,
        mime_type=file.content_type or "application/octet-stream"
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

@router.get("/media", response_model=List[schemas.MediaAssetOut])
def get_media_assets(db: Session = Depends(get_db), _=admin_dependency):
    return db.query(models.MediaAsset).order_by(models.MediaAsset.uploaded_at.desc()).all()

@router.delete("/media/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media_asset(asset_id: int, db: Session = Depends(get_db), _=admin_dependency):
    asset = db.query(models.MediaAsset).filter(models.MediaAsset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    # Delete file from disk
    filename = asset.url.split("/")[-1]
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception as e:
            print(f"Error deleting file: {e}")
            
    db.delete(asset)
    db.commit()
    return None


# --- Technical Events Admin ---
@router.post("/technical-events", response_model=schemas.TechnicalEventOut, status_code=status.HTTP_201_CREATED)
def create_technical_event(event: schemas.TechnicalEventCreate, db: Session = Depends(get_db), _=admin_dependency):
    db_event = models.TechnicalEvent(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.put("/technical-events/{event_id}", response_model=schemas.TechnicalEventOut)
def update_technical_event(event_id: int, event: schemas.TechnicalEventUpdate, db: Session = Depends(get_db), _=admin_dependency):
    db_event = db.query(models.TechnicalEvent).filter(models.TechnicalEvent.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    for key, value in event.model_dump(exclude_unset=True).items():
        setattr(db_event, key, value)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.delete("/technical-events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_technical_event(event_id: int, db: Session = Depends(get_db), _=admin_dependency):
    db_event = db.query(models.TechnicalEvent).filter(models.TechnicalEvent.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(db_event)
    db.commit()
    return None
