import sys
import os
import json
# Add parent directory to path so app can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models import models

def import_cv_data():
    json_path = os.path.join(os.path.dirname(__file__), "cv_data.json")
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        return
        
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    db = SessionLocal()
    
    print("Clearing relevant tables for fresh import...")
    db.query(models.Skill).delete()
    db.query(models.Experience).delete()
    db.query(models.Project).delete()
    db.query(models.Education).delete()
    db.query(models.Achievement).delete()
    db.commit()
    
    print("Importing skills...")
    for s in data.get("skills", []):
        db.add(models.Skill(
            name=s.get("name"),
            level=s.get("level"),
            category=s.get("category"),
            is_active=True
        ))
        
    print("Importing experiences...")
    for e in data.get("experiences", []):
        db.add(models.Experience(
            company=e.get("company"),
            role=e.get("role"),
            duration=e.get("duration"),
            description=e.get("description"),
            display_order=e.get("display_order", 0)
        ))
        
    print("Importing projects...")
    for p in data.get("projects", []):
        db.add(models.Project(
            title=p.get("title"),
            description=p.get("description"),
            tech_stack=p.get("technologies", "").split(", ") if isinstance(p.get("technologies"), str) else p.get("technologies"),
            github_url=p.get("github_url"),
            demo_url=p.get("live_url"),
            preview_image_url=p.get("image_url", ""),
            is_featured=True,
            display_order=p.get("display_order", 0)
        ))
        
    print("Importing education...")
    for ed in data.get("education", []):
        db.add(models.Education(
            institution=ed.get("institution"),
            degree=ed.get("degree"),
            duration=ed.get("duration"),
            description=ed.get("description"),
            display_order=ed.get("display_order", 0)
        ))
        
    print("Importing achievements...")
    for ach in data.get("achievements", []):
        db.add(models.Achievement(
            title=ach.get("title"),
            description=ach.get("description"),
            icon_name=ach.get("icon_name"),
            date=ach.get("date"),
            display_order=ach.get("display_order", 0)
        ))
        
    # Inject github link if not exist
    existing_gh = db.query(models.SocialLink).filter(models.SocialLink.name == "GitHub").first()
    if existing_gh:
        existing_gh.url = "https://github.com/archimparmar"
    else:
        db.add(models.SocialLink(
            name="GitHub",
            url="https://github.com/archimparmar",
            icon_name="github"
        ))
        
    db.commit()
    print("Import completed successfully!")

if __name__ == "__main__":
    import_cv_data()
