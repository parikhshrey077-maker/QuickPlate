from app import create_app
from models import db, User, Meal, Order
import json

app = create_app()

with app.app_context():
    print("\n=== Database Content Report ===\n")
    
    # MST Check (optional, just printing server time)
    # print(f"Server Time: {datetime.now()}")

    # Users
    users = User.query.all()
    print(f"--- Users ({len(users)}) ---")
    for u in users:
        print(f"ID: {u.id} | SAP ID: {u.sap_id} | Name: {u.name} | Points: {u.loyalty_points}")
    print("")

    # Meals
    meals = Meal.query.all()
    print(f"--- Meals ({len(meals)}) ---")
    for m in meals:
        print(f"ID: {m.id} | Name: {m.name} | Price: {m.price} | Category: {m.category}")
    print("")

    # Orders
    orders = Order.query.all()
    print(f"--- Orders ({len(orders)}) ---")
    for o in orders:
        items = json.loads(o.items) if isinstance(o.items, str) else o.items
        item_names = ", ".join([i.get('name') for i in items])
        print(f"ID: {o.id} | User: {o.user_id} | Total: {o.total} | Status: {o.status} | Pickup: {o.pickup_time} | Items: {item_names}")
    print("\n===============================\n")
