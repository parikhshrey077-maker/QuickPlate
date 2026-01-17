from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    sap_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    photo_url = db.Column(db.String(500))
    password_hash = db.Column(db.String(255))
    loyalty_points = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    orders = db.relationship('Order', backref='user', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'sapId': self.sap_id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'photoUrl': self.photo_url,
            'loyaltyPoints': self.loyalty_points,
            'createdAt': self.created_at.isoformat()
        }

class Meal(db.Model):
    __tablename__ = 'meals'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # Breakfast, Lunch, Dinner, Snacks
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    available = db.Column(db.Boolean, default=True)
    prep_time = db.Column(db.Integer)  # in minutes
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'category': self.category,
            'price': self.price,
            'description': self.description,
            'available': self.available,
            'prepTime': self.prep_time
        }

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    items = db.Column(db.Text, nullable=False)  # JSON string
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='Placed')  # Placed, Preparing, Ready, Completed
    pickup_time = db.Column(db.String(50))
    payment_method = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': f'ORD-{self.id}',
            'userId': self.user_id,
            'items': json.loads(self.items),
            'total': self.total,
            'status': self.status,
            'pickupTime': self.pickup_time,
            'paymentMethod': self.payment_method,
            'date': self.created_at.isoformat()
        }

class Offer(db.Model):
    __tablename__ = 'offers'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    points_required = db.Column(db.Integer, nullable=False)
    discount_amount = db.Column(db.Float, nullable=False)
    active = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'title': self.title,
            'description': self.description,
            'pointsRequired': self.points_required,
            'discountAmount': self.discount_amount,
            'active': self.active
        }
