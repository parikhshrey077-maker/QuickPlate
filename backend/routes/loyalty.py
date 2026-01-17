from flask import Blueprint, request, jsonify
from models import db, User, Offer

loyalty_bp = Blueprint('loyalty', __name__)

@loyalty_bp.route('/<int:user_id>', methods=['GET'])
def get_loyalty_balance(user_id):
    """Get user's loyalty points balance"""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'success': True,
        'loyaltyPoints': user.loyalty_points
    }), 200

@loyalty_bp.route('/offers', methods=['GET'])
def get_offers():
    """Get all active loyalty offers"""
    offers = Offer.query.filter_by(active=True).all()
    
    return jsonify({
        'success': True,
        'offers': [offer.to_dict() for offer in offers]
    }), 200

@loyalty_bp.route('/redeem', methods=['POST'])
def redeem_points():
    """Redeem loyalty points for an offer"""
    data = request.get_json()
    
    user_id = data.get('userId')
    offer_id = data.get('offerId')
    
    if not all([user_id, offer_id]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    user = User.query.get(user_id)
    offer = Offer.query.get(offer_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if not offer or not offer.active:
        return jsonify({'error': 'Offer not found or inactive'}), 404
    
    if user.loyalty_points < offer.points_required:
        return jsonify({'error': 'Insufficient loyalty points'}), 400
    
    # Deduct points
    user.loyalty_points -= offer.points_required
    db.session.commit()
    
    return jsonify({
        'success': True,
        'remainingPoints': user.loyalty_points,
        'discountAmount': offer.discount_amount
    }), 200
