import sys
import os
# Add parent directory to path so app can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database.session import SessionLocal, engine, Base
from app.models import models
from app.core import security

def seed_db():
    print("Initializing database seeding with detailed portfolio dataset...")
    # Drop and recreate tables to ensure clean seeding
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    # Clear existing data to seed fresh from CV
    db.query(models.Skill).delete()
    db.query(models.Experience).delete()
    db.query(models.Project).delete()
    db.query(models.ResearchPaper).delete()
    db.query(models.Achievement).delete()
    db.query(models.SocialLink).delete()
    db.query(models.SiteSetting).delete()
    db.query(models.Education).delete()
    db.query(models.Certification).delete()
    db.query(models.TechnicalEvent).delete()
    db.commit()

    # 1. Seed Admin User
    admin_user = db.query(models.User).filter(models.User.username == "admin").first()
    if not admin_user:
        print("Seeding admin user...")
        hashed_password = security.get_password_hash("admin123")
        admin_user = models.User(
            username="admin",
            email="parmararchi19@gmail.com",
            hashed_password=hashed_password,
            is_active=True
        )
        db.add(admin_user)
        db.commit()
    else:
        print("Admin user already exists.")
        
    # 2. Seed Skills
    print("Seeding technical skills...")
    skills = [
        # Programming Languages
        models.Skill(name="Python", level=95, category="Programming"),
        models.Skill(name="Java", level=85, category="Programming"),
        models.Skill(name="C", level=85, category="Programming"),
        models.Skill(name="C++", level=80, category="Programming"),
        models.Skill(name="JavaScript", level=88, category="Programming"),
        
        # Frontend Development & Backend
        models.Skill(name="HTML", level=95, category="Frontend"),
        models.Skill(name="CSS", level=92, category="Frontend"),
        models.Skill(name="Bootstrap", level=90, category="Frontend"),
        models.Skill(name="jQuery", level=80, category="Frontend"),
        models.Skill(name="Django", level=92, category="Backend"),
        models.Skill(name="Flask", level=80, category="Backend"),
        models.Skill(name="FastAPI", level=90, category="Backend"),
        models.Skill(name="REST API Development", level=90, category="Backend"),
        models.Skill(name="API Integration", level=88, category="Backend"),
        models.Skill(name="MERN Stack Fundamentals", level=75, category="Backend"),
        
        # Artificial Intelligence
        models.Skill(name="Machine Learning Fundamentals", level=85, category="AI / ML"),
        models.Skill(name="Prompt Engineering", level=90, category="AI / ML"),
        models.Skill(name="LangChain Fundamentals", level=88, category="AI / ML"),
        models.Skill(name="LLM Applications (Gemini/OpenAI)", level=92, category="AI / ML"),
        models.Skill(name="Data Preprocessing", level=88, category="AI / ML"),
        models.Skill(name="Pandas", level=85, category="AI / ML"),
        models.Skill(name="NumPy", level=85, category="AI / ML"),
        models.Skill(name="Scikit-Learn", level=82, category="AI / ML"),
        models.Skill(name="AI-Powered Document Processing", level=88, category="AI / ML"),
        models.Skill(name="NLP Fundamentals", level=80, category="AI / ML"),
        
        # Data Analytics
        models.Skill(name="Power BI", level=80, category="Data Analytics"),
        
        # Databases
        models.Skill(name="MySQL", level=90, category="Database"),
        models.Skill(name="MongoDB", level=78, category="Database"),
        models.Skill(name="SQLite", level=90, category="Database"),
        
        # Dev Tools & Platforms
        models.Skill(name="Git", level=90, category="Tools"),
        models.Skill(name="GitHub", level=92, category="Tools"),
        models.Skill(name="Unity 3D", level=70, category="Tools"),
        models.Skill(name="Virtual Reality Development", level=72, category="Tools"),
    ]
    db.add_all(skills)
    db.commit()

    # 3. Seed Experiences
    print("Seeding experiences...")
    experiences = [
        models.Experience(
            company="DreamDrift Designs Pvt. Ltd., Bhavnagar",
            role="Python Django Developer Intern",
            duration="Jun 2025 - July 2025",
            description="Worked on the development of BhojanVilla, a restaurant and resort management platform.\nResponsibilities:\n- Developed web application modules using Python and Django.\n- Worked on frontend and backend integration.\n- Implemented user authentication and booking functionalities.\n- Assisted in database integration and system testing.",
            logo_url=None,
            display_order=1
        ),
        models.Experience(
            company="Apex Software House, Bhavnagar",
            role="Frontend Developer & Office Management Intern",
            duration="Apr 2024 - Aug 2025",
            description="Worked on website development and organizational activities.\nResponsibilities:\n- Developed frontend interfaces for web applications.\n- Improved website responsiveness and user experience.\n- Assisted in office documentation and project coordination activities.",
            logo_url=None,
            display_order=2
        )
    ]
    db.add_all(experiences)
    db.commit()

    # 4. Seed Projects
    print("Seeding projects...")
    projects = [
        models.Project(
            title="BhojanVilla – Restaurant & Resort Management System",
            description="A full-stack web application developed for managing restaurant and resort operations, including bookings, customer management, and administrative activities.",
            tech_stack=["Python", "Django", "MySQL", "HTML", "CSS", "Bootstrap", "JavaScript"],
            preview_image_url=None,
            github_url=None,
            demo_url=None,
            features=["User Registration and Login", "Room Booking System", "Table Reservation System", "Menu Management", "Gallery Management", "Admin Dashboard"],
            is_featured=True,
            display_order=1
        ),
        models.Project(
            title="DocMind AI – Intelligent Document Assistant (Ongoing)",
            description="Developing an AI-powered document assistant capable of extracting information from PDF documents and answering user queries using Retrieval-Augmented Generation (RAG) techniques. Utilizes semantic search and vector-based retrieval to provide context-aware responses from uploaded documents.",
            tech_stack=["Python", "FastAPI", "LangChain", "Gemini API", "FAISS"],
            preview_image_url=None,
            github_url=None,
            demo_url=None,
            features=["PDF Upload & Processing", "Semantic Search", "Context-Aware Question Answering", "Document Knowledge Retrieval", "AI-Powered Responses"],
            is_featured=True,
            display_order=2
        ),
        models.Project(
            title="PDF Summarizer",
            description="Built an application that extracts content from PDF documents and generates concise summaries, helping users quickly understand lengthy documents.",
            tech_stack=["Python", "AI/NLP Tools"],
            preview_image_url=None,
            github_url=None,
            demo_url=None,
            features=["PDF Extraction", "AI Summarization"],
            is_featured=False,
            display_order=3
        ),
        models.Project(
            title="Real-Time Speech-to-Text System",
            description="Developed a speech recognition application capable of converting spoken language into text in real time, focusing on transcription accuracy and usability.",
            tech_stack=["Python", "Flask", "Vosk"],
            preview_image_url=None,
            github_url=None,
            demo_url=None,
            features=["Real-time Transcription", "Accuracy Focus"],
            is_featured=False,
            display_order=4
        ),
        models.Project(
            title="NexNote",
            description="A collaborative productivity and note-management platform designed to improve organization and teamwork. Presented during CorpConnect.",
            tech_stack=["MERN Stack", "Antigravity Framework"],
            preview_image_url=None,
            github_url=None,
            demo_url=None,
            features=["Note Management", "Collaboration"],
            is_featured=False,
            display_order=5
        ),
        models.Project(
            title="Crime Vision",
            description="A research-oriented platform developed for crime analysis and monitoring. Presented during TechManjari 2026 as part of a technical project showcase.",
            tech_stack=["MERN Stack", "Antigravity Framework"],
            preview_image_url=None,
            github_url=None,
            demo_url=None,
            features=["Crime Analysis", "Monitoring"],
            is_featured=False,
            display_order=6
        ),
        models.Project(
            title="StellarSence VR – Virtual Reality Space Education Platform",
            description="An immersive virtual reality platform designed to make space learning interactive and engaging through realistic experiences.",
            tech_stack=["Unity 3D", "Virtual Reality"],
            preview_image_url=None,
            github_url=None,
            demo_url=None,
            features=["Solar System Exploration", "Moon Roller Coaster Experience", "Interactive Educational Environment"],
            is_featured=True,
            display_order=7
        )
    ]
    db.add_all(projects)
    db.commit()

    # 5. Seed Research Paper
    print("Seeding research paper...")
    paper = models.ResearchPaper(
        title="Beyond Full Automation: A Critical Survey of RPA and Human-in-the-Loop Hybrid Workflows",
        journal="International Research Journal of Modernization in Engineering Technology and Science (IRJMETS)",
        doi="",
        publication_date="July 2025",
        description="Volume: 7, Issue: 7. Research Areas: Robotic Process Automation (RPA), Human-in-the-Loop Systems, Hybrid Automation Frameworks, Future Automation Trends.",
        url="",
        badge="IRJMETS"
    )
    db.add(paper)
    db.commit()

    # 6. Seed Achievements
    print("Seeding achievements...")
    achievements = [
        models.Achievement(title="GATE Qualified", description="Successfully qualified the Graduate Aptitude Test in Engineering (GATE), demonstrating strong engineering fundamentals, analytical thinking, and problem-solving abilities.", icon_name="award", date="2024", display_order=1),
        models.Achievement(title="Runner-Up – TechManjari 2026", description="Awarded Runner-Up position for the StellarSence VR startup project among competing student innovations.", icon_name="zap", date="08-11 January 2026", display_order=2)
    ]
    db.add_all(achievements)
    db.commit()

    # 7. Seed Social Links
    print("Seeding social links...")
    links = [
        models.SocialLink(name="GitHub", url="https://github.com/archimparmar/", icon_name="github"),
        models.SocialLink(name="LinkedIn", url="https://linkedin.com/in/archiparmar", icon_name="linkedin"),
        models.SocialLink(name="Email", url="mailto:parmararchi19@gmail.com", icon_name="mail"),
    ]
    db.add_all(links)
    db.commit()

    # 8. Seed Site Settings
    print("Seeding site settings...")
    settings = [
        models.SiteSetting(key="title", value="Archi Parmar | Python Developer | AI & Backend Development"),
        models.SiteSetting(key="headline", value="Python Developer • AI & Backend Development"),
        models.SiteSetting(key="about_description", value="As a Computer Engineering student, I have explored different areas of software development through internships, research activities, Startup projects, and technical events. These experiences have helped me build strong foundation in Python, web development, and problem-solving while providing exposure to real-world development practices. Qualifying GATE, publishing research work, and presenting projects such have further strengthened my technical and analytical abilities. I am currently focused on expanding my knowledge of Python and machine learning, with goal of building software solutions that address practical challenges and deliver meaningful value."),
        models.SiteSetting(key="resume_url", value="/Archi Parmar Detailed CV.pdf"),
        models.SiteSetting(key="phone", value="+919484407185"),
        models.SiteSetting(key="email", value="parmararchi19@gmail.com")
    ]
    db.add_all(settings)
    db.commit()

    # 9. Seed Education
    print("Seeding education history...")
    edu = [
        models.Education(
            institution="Gyanmanjari Innovative University, Bhavnagar",
            degree="Bachelor of Computer Engineering",
            duration="2023-2027",
            description="7.3 / 10 CGPA (Till 5 Sem)",
            display_order=1
        ),
        models.Education(
            institution="Gyanmanjari Higher Secondary School, Bhavnagar",
            degree="Higher Secondary School",
            duration="2023",
            description="51.70 %",
            display_order=2
        )
    ]
    db.add_all(edu)
    db.commit()

    # 10. Seed Certifications
    print("Seeding certifications...")
    certs = [
        models.Certification(title="Freedom with AI Masterclass", issuer="Freedom with AI", date="January 2024", display_order=1),
        models.Certification(title="C Programming Course", issuer="UFOS Authorized Training Center", date="February-March 2024", display_order=2),
        models.Certification(title="Certified Lean Six Sigma AI Yellow Belt", issuer="CSSC Accredited", date="May 2024", display_order=3),
        models.Certification(title="Claude AI Masterclass", issuer="Skill Nation", date="May 2024", display_order=4),
        models.Certification(title="AI-Powered SEO Masterclass", issuer="Pankaj Kumar SEO", date="February 2026", display_order=5)
    ]
    db.add_all(certs)
    db.commit()

    # 11. Seed Technical Events
    print("Seeding timeline events...")
    events = [
        models.TechnicalEvent(title="TechManjari 2026", date="08–11 January 2026", organizer="Gyanmanjari Innovative University", role="Participant", outcome="Presented StellarSence VR (Runner-Up) and Crime Vision", display_order=1),
        models.TechnicalEvent(title="CorpConnect 1.0", date="06-07 March 2026", organizer="Gyanmanjari Innovative University", role="Participant", outcome="Presented NexNote project. Participated in industry interaction.", display_order=2),
        models.TechnicalEvent(title="HR Conclave 1.0 – AI and Agility", date="18 April 2026", organizer="Gyanmanjari Institute of Management Studies, GMIU", role="Participant", outcome="Attended expert sessions on modern HR practices and AI adoption.", display_order=3),
        models.TechnicalEvent(title="UdhyamSetu 1.0", date="22 November 2025", organizer="Gyanmanjari Startup & Entrepreneurship Cell, GMIU", role="Participant", outcome="Represented StellarSence VR before investors.", display_order=4),
        models.TechnicalEvent(title="Pahel 1.0", date="25 September 2025", organizer="Gyanmanjari Innovative University", role="Participant", outcome="Showcased StellarSence VR during innovation and entrepreneurship activities.", display_order=5),
        models.TechnicalEvent(title="Code2Impact", date="18 July 2025", organizer="Gyanmanjari Innovative University", role="Participant", outcome="Presented StellarSence VR as an innovative startup solution.", display_order=6),
        models.TechnicalEvent(title="GIMCA 2026 International Conference", date="2026", organizer="Gyanmanjari Innovative University", role="Research Paper Committee Member", outcome="Assisted in managing research paper activities and coordinated sessions.", display_order=7)
    ]
    db.add_all(events)
    db.commit()

    print("Seeding complete! Portfolio database initialized with extracted CV data.")
    db.close()

if __name__ == "__main__":
    seed_db()
