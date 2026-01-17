from app import create_app
from models import db, User

app = create_app()

with app.app_context():
    print("\n=== Cleaning Up Legacy Users ===\n")
    
    # Delete users with NULL password_hash
    deleted_count = User.query.filter(User.password_hash == None).delete()
    
    db.session.commit()
    print(f"✅ Deleted {deleted_count} legacy users who had no password set.")
    print("These users can now re-register with the new password flow.")
    print("\nRemaining Users:")
    users = User.query.all()
    for u in users:
        print(f"ID: {u.id} | SAP ID: {u.sap_id} | Name: {u.name}")
