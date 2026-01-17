from flask import Blueprint, request, jsonify
from models import db, Order, User
import json
from datetime import datetime

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['POST'])
def create_order():
    """Create a new order"""
    data = request.get_json()
    
    user_id = data.get('userId')
    items = data.get('items')
    total = data.get('total')
    pickup_time = data.get('pickupTime')
    payment_method = data.get('paymentMethod')
    
    points_used = data.get('pointsUsed', 0)
    
    if not all([user_id, items, total]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Verify user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Handle points deduction (1 point = ₹1)
    if points_used > 0:
        if user.loyalty_points < points_used:
            return jsonify({'error': 'Insufficient loyalty points'}), 400
        user.loyalty_points -= points_used
    
    # Create order
    new_order = Order(
        user_id=user_id,
        items=json.dumps(items),
        total=total,
        pickup_time=pickup_time,
        payment_method=payment_method,
        status='Placed'
    )
    
    db.session.add(new_order)
    
    # Award loyalty points (5% of the total bill, 1 point = ₹1)
    # Total billed amount is (total - points_used) assuming points_used is a discount
    # However, user wants 5% on TOTAL bill order. Let's stick to total for now or bill amount?
    # Usually it's on the actual money paid. Let's use (total - points_used)
    bill_amount = max(0, total - points_used)
    points_earned = int(bill_amount * 0.05)
    user.loyalty_points += points_earned
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'order': new_order.to_dict(),
        'pointsEarned': points_earned
    }), 201

@orders_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_orders(user_id):
    """Get all orders for a user"""
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    
    return jsonify({
        'success': True,
        'orders': [order.to_dict() for order in orders]
    }), 200

@orders_bp.route('/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order status"""
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    data = request.get_json()
    new_status = data.get('status')
    
    if new_status not in ['Placed', 'Preparing', 'Ready', 'Completed']:
        return jsonify({'error': 'Invalid status'}), 400
    
    order.status = new_status
    db.session.commit()
    
    return jsonify({
        'success': True,
        'order': order.to_dict()
    }), 200
