from app import create_app
from models import db, User

app = create_app()

with app.app_context():
    print("\n=== User Account Status Report ===\n")
    users = User.query.all()
    print(f"Total Users: {len(users)}")
    print("-" * 60)
    print(f"{'ID':<5} | {'SAP ID':<15} | {'Name':<20} | {'Has Password?'}")
    print("-" * 60)
    for u in users:
        has_pass = "YES" if u.password_hash else "NO"
        print(f"{u.id:<5} | {u.sap_id:<15} | {u.name:<20} | {has_pass}")
    print("-" * 60)
    print("\n")
