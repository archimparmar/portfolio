from app.database.session import SessionLocal
from app.models.models import User
from app.core.security import get_password_hash

db = SessionLocal()

user = db.query(User).filter(User.username == "admin").first()

if user:
    print("Admin already exists.")
else:
    admin = User(
        username="admin",
        email="parmararchi19@gmail.com",
        hashed_password=get_password_hash("admin123"),
        is_active=True
    )

    db.add(admin)
    db.commit()

    print("Admin created successfully!")

db.close()