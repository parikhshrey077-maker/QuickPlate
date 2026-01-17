"""
Database seeder script to populate initial data
Run this after setting up the database: python seed_db.py
"""

from app import create_app
from models import db, Meal, Offer

def seed_database():
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        print("🗑️  Clearing existing data...")
        Meal.query.delete()
        
        # Seed Meals
        print("🍽️  Seeding meals...")
        meals = [
            # Breakfast
            Meal(name='Masala Dosa', category='Breakfast', price=60, description='Crispy rice crepe served with coconut chutney and potato masala.', available=True, prep_time=15),
            Meal(name='Idli Sambar', category='Breakfast', price=40, description='Steamed rice cakes served with sambar and chutney.', available=True, prep_time=10),
            Meal(name='Poha', category='Breakfast', price=30, description='Flattened rice cooked with onions, peas, and spices.', available=True, prep_time=10),
            Meal(name='Upma', category='Breakfast', price=35, description='Savory semolina porridge with vegetables.', available=True, prep_time=12),
            
            # Lunch
            Meal(name='Veg Thali', category='Lunch', price=80, description='Complete meal with rice, roti, dal, sabzi, and curd.', available=True, prep_time=20),
            Meal(name='Chole Bhature', category='Lunch', price=70, description='Spicy chickpea curry with fried bread.', available=True, prep_time=18),
            Meal(name='Rajma Chawal', category='Lunch', price=65, description='Kidney bean curry with steamed rice.', available=True, prep_time=15),
            Meal(name='Paneer Tikka', category='Lunch', price=90, description='Grilled cottage cheese marinated in spices.', available=True, prep_time=20),
            
            # Dinner
            Meal(name='Dal Tadka', category='Dinner', price=55, description='Yellow lentils tempered with cumin and garlic.', available=True, prep_time=15),
            Meal(name='Palak Paneer', category='Dinner', price=85, description='Cottage cheese in creamy spinach gravy.', available=True, prep_time=18),
            Meal(name='Aloo Paratha', category='Dinner', price=50, description='Stuffed flatbread with spiced potato filling.', available=True, prep_time=15),
            
            # Snacks
            Meal(name='Samosa', category='Snacks', price=20, description='Fried pastry with savory filling of spiced potatoes and peas.', available=True, prep_time=5),
            Meal(name='Vada Pav', category='Snacks', price=25, description='Spiced potato fritter in a bun.', available=True, prep_time=8),
            Meal(name='Pav Bhaji', category='Snacks', price=60, description='Spiced vegetable mash served with buttered bread.', available=True, prep_time=15),
            Meal(name='Coffee', category='Snacks', price=15, description='Hot filter coffee.', available=True, prep_time=5),
            Meal(name='Tea', category='Snacks', price=10, description='Hot masala chai.', available=True, prep_time=5),
        ]
        
        db.session.bulk_save_objects(meals)
        
        db.session.commit()
        print("✅ Database seeded successfully!")
        print(f"   - {len(meals)} meals added")

if __name__ == '__main__':
    seed_database()
if __name__ == '__main__':
    seed_database()
