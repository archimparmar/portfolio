import datetime
from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, JSON
from app.database.session import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(JSON, nullable=False) # List of strings e.g. ["FastAPI", "React", "FAISS"]
    preview_image_url = Column(String(255), nullable=True)
    github_url = Column(String(255), nullable=True)
    demo_url = Column(String(255), nullable=True)
    features = Column(JSON, nullable=True) # List of strings e.g. ["PDF upload", "Semantic search"]
    is_featured = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)


class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    level = Column(Integer, nullable=False) # e.g. 90 for 90%
    category = Column(String(50), nullable=False) # Programming, Web, AI / ML, Database, Tools
    is_active = Column(Boolean, default=True)


class Experience(Base):
    __tablename__ = "experiences"
    
    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    duration = Column(String(50), nullable=False) # e.g., "June 2024 - July 2024"
    description = Column(Text, nullable=False)
    logo_url = Column(String(255), nullable=True)
    display_order = Column(Integer, default=0)


class ResearchPaper(Base):
    __tablename__ = "research_papers"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    journal = Column(String(150), nullable=False)
    doi = Column(String(100), nullable=True)
    publication_date = Column(String(50), nullable=False) # e.g., "June 2024"
    description = Column(Text, nullable=True)
    url = Column(String(255), nullable=True)
    badge = Column(String(50), nullable=True) # e.g., "NeurIPS 2024"


class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    icon_name = Column(String(50), nullable=True) # Lucide icon identifier
    date = Column(String(50), nullable=True)
    display_order = Column(Integer, default=0)


class ContactMessage(Base):
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_read = Column(Boolean, default=False)


class BlogPost(Base):
    __tablename__ = "blog_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    slug = Column(String(150), unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=True)
    cover_image = Column(String(255), nullable=True)
    tags = Column(JSON, nullable=True) # List of strings e.g. ["Generative AI", "Python"]
    published_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_draft = Column(Boolean, default=False)


class SocialLink(Base):
    __tablename__ = "social_links"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    url = Column(String(255), nullable=False)
    icon_name = Column(String(50), nullable=True) # Lucide icon name


class SiteSetting(Base):
    __tablename__ = "site_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(50), unique=True, index=True, nullable=False)
    value = Column(Text, nullable=False)


class Education(Base):
    __tablename__ = "education"
    
    id = Column(Integer, primary_key=True, index=True)
    institution = Column(String(100), nullable=False)
    degree = Column(String(100), nullable=False)
    duration = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0)


class Certification(Base):
    __tablename__ = "certifications"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    issuer = Column(String(100), nullable=False)
    credential_url = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=True)
    date = Column(String(50), nullable=True)
    display_order = Column(Integer, default=0)


class MediaAsset(Base):
    __tablename__ = "media_assets"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(150), nullable=False)
    url = Column(String(255), nullable=False)
    size_bytes = Column(Integer, nullable=False)
    mime_type = Column(String(50), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)


class TechnicalEvent(Base):
    __tablename__ = "technical_events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    date = Column(String(50), nullable=False)
    organizer = Column(String(100), nullable=True)
    role = Column(String(100), nullable=True)
    outcome = Column(Text, nullable=True)
    display_order = Column(Integer, default=0)
