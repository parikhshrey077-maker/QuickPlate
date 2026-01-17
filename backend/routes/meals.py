from flask import Blueprint, request, jsonify
from models import db, Meal

meals_bp = Blueprint('meals', __name__)

@meals_bp.route('/', methods=['GET'])
def get_meals():
    """Get all meals with optional category filter"""
    category = request.args.get('category')
    
    query = Meal.query.filter_by(available=True)
    
    if category and category != 'All':
        query = query.filter_by(category=category)
    
    meals = query.all()
    
    return jsonify({
        'success': True,
        'meals': [meal.to_dict() for meal in meals]
    }), 200

@meals_bp.route('/<int:meal_id>', methods=['GET'])
def get_meal(meal_id):
    """Get single meal by ID"""
    meal = Meal.query.get(meal_id)
    
    if not meal:
        return jsonify({'error': 'Meal not found'}), 404
    
    return jsonify(meal.to_dict()), 200
