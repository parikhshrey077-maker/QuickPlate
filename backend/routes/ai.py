from flask import Blueprint, request, jsonify
from services.ai_service import ai_service
from models import Order, User

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/chat', methods=['POST'])
def chat():
    """AI chatbot endpoint for help & support"""
    data = request.get_json()
    
    user_message = data.get('message')
    conversation_history = data.get('history', [])
    
    if not user_message:
        return jsonify({'error': 'Message is required'}), 400
    
    # Get AI response
    result = ai_service.chat(user_message, conversation_history)
    
    if result['success']:
        return jsonify({
            'success': True,
            'message': result['message']
        }), 200
    else:
        return jsonify({
            'success': False,
            'message': result['message']
        }), 500

@ai_bp.route('/recommendations/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    """Get personalized meal recommendations"""
    # Verify user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get user's order history
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).limit(10).all()
    
    # Get AI recommendations
    result = ai_service.get_recommendations(orders)
    
    return jsonify({
        'success': True,
        'recommendations': result['recommendations']
    }), 200
