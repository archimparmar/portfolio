from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

# --- General ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# --- User ---
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    is_active: bool

    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    username: str
    password: str

# --- Project ---
class ProjectBase(BaseModel):
    title: str
    description: str
    tech_stack: List[str]
    preview_image_url: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    features: Optional[List[str]] = None
    is_featured: Optional[bool] = False
    display_order: Optional[int] = 0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    preview_image_url: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    features: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None

class ProjectOut(ProjectBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

# --- Skill ---
class SkillBase(BaseModel):
    name: str
    level: int = Field(..., ge=0, le=100)
    category: str  # Programming, Web, AI / ML, Database, Tools
    is_active: Optional[bool] = True

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    name: Optional[str] = None
    level: Optional[int] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None

class SkillOut(SkillBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

# --- Experience ---
class ExperienceBase(BaseModel):
    company: str
    role: str
    duration: str
    description: str
    logo_url: Optional[str] = None
    display_order: Optional[int] = 0

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    display_order: Optional[int] = None

class ExperienceOut(ExperienceBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

# --- Research Paper ---
class ResearchPaperBase(BaseModel):
    title: str
    journal: str
    doi: Optional[str] = None
    publication_date: str
    description: Optional[str] = None
    url: Optional[str] = None
    badge: Optional[str] = None

class ResearchPaperCreate(ResearchPaperBase):
    pass

class ResearchPaperUpdate(BaseModel):
    title: Optional[str] = None
    journal: Optional[str] = None
    doi: Optional[str] = None
    publication_date: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    badge: Optional[str] = None

class ResearchPaperOut(ResearchPaperBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

# --- Achievement ---
class AchievementBase(BaseModel):
    title: str
    description: str
    icon_name: Optional[str] = None
    date: Optional[str] = None
    display_order: Optional[int] = 0

class AchievementCreate(AchievementBase):
    pass

class AchievementUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon_name: Optional[str] = None
    date: Optional[str] = None
    display_order: Optional[int] = None

class AchievementOut(AchievementBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

# --- Contact Message ---
class ContactMessageBase(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactMessageCreate(ContactMessageBase):
    pass

class ContactMessageOut(ContactMessageBase):
    id: int
    created_at: datetime
    is_read: bool
    
    model_config = ConfigDict(from_attributes=True)

# --- Blog Post ---
class BlogPostBase(BaseModel):
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    tags: Optional[List[str]] = None
    is_draft: Optional[bool] = False

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    tags: Optional[List[str]] = None
    is_draft: Optional[bool] = None

class BlogPostOut(BlogPostBase):
    id: int
    published_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- Social Link ---
class SocialLinkBase(BaseModel):
    name: str
    url: str
    icon_name: Optional[str] = None

class SocialLinkCreate(SocialLinkBase):
    pass

class SocialLinkOut(SocialLinkBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

# --- Site Settings ---
class SiteSettingBase(BaseModel):
    key: str
    value: str

class SiteSettingCreate(SiteSettingBase):
    pass

class SiteSettingOut(SiteSettingBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)


# --- Education ---
class EducationBase(BaseModel):
    institution: str
    degree: str
    duration: str
    description: Optional[str] = None
    display_order: Optional[int] = 0

class EducationCreate(EducationBase):
    pass

class EducationUpdate(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None

class EducationOut(EducationBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

# --- Certification ---
class CertificationBase(BaseModel):
    title: str
    issuer: str
    credential_url: Optional[str] = None
    image_url: Optional[str] = None
    date: Optional[str] = None
    display_order: Optional[int] = 0

class CertificationCreate(CertificationBase):
    pass

class CertificationUpdate(BaseModel):
    title: Optional[str] = None
    issuer: Optional[str] = None
    credential_url: Optional[str] = None
    image_url: Optional[str] = None
    date: Optional[str] = None
    display_order: Optional[int] = None

class CertificationOut(CertificationBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

# --- Media Asset ---
class MediaAssetOut(BaseModel):
    id: int
    filename: str
    url: str
    size_bytes: int
    mime_type: str
    uploaded_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# --- Technical Event ---
class TechnicalEventBase(BaseModel):
    title: str
    date: str
    organizer: Optional[str] = None
    role: Optional[str] = None
    outcome: Optional[str] = None
    display_order: Optional[int] = 0

class TechnicalEventCreate(TechnicalEventBase):
    pass

class TechnicalEventUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[str] = None
    organizer: Optional[str] = None
    role: Optional[str] = None
    outcome: Optional[str] = None
    display_order: Optional[int] = None

class TechnicalEventOut(TechnicalEventBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
