from flask import Blueprint, request, jsonify
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login with SAP ID and Password"""
    try:
        data = request.get_json()
        sap_id = data.get('sapId')
        password = data.get('password')
        
        if not sap_id or not password:
            return jsonify({'error': 'SAP ID and Password are required'}), 400
        
        user = User.query.filter_by(sap_id=sap_id).first()
        if not user:
            # Security best practice: vague error message
            return jsonify({'error': 'Incorrect SAP ID or Password'}), 401
        
        # Verify password
        if user.password_hash and check_password_hash(user.password_hash, password):
            return jsonify({'success': True, 'user': user.to_dict()}), 200
        else:
            return jsonify({'error': 'Incorrect SAP ID or Password'}), 401
            
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Create new user account with Password"""
    try:
        data = request.get_json()
        print(f"DEBUG: Received Signup Data: {data}") # LOG ALL INCOMING DATA

        sap_id = data.get('sapId')
        name = data.get('name')
        password = data.get('password')
        
        if not all([sap_id, name, password]):
            print(f"DEBUG: Missing fields. sapId={sap_id}, name={name}, password={'*' if password else 'None'}")
            return jsonify({'error': 'All fields are required'}), 400
        
        # Check for existing user BY SAP ID ONLY
        existing_user = User.query.filter_by(sap_id=sap_id).first()
        
        if existing_user:
            print(f"DEBUG: COLLISION DETECTED! Incoming SAP ID: '{sap_id}' matches User ID: {existing_user.id}, SAP ID: '{existing_user.sap_id}', Name: '{existing_user.name}'")
            return jsonify({'error': f'User with SAP ID {sap_id} already exists'}), 409
        
        print(f"DEBUG: No collision for SAP ID '{sap_id}'. Creating user...")

        new_user = User(
            sap_id=sap_id,
            name=name,
            email=data.get('email', ''),
            phone=data.get('phone', ''),
            password_hash=generate_password_hash(password),
            photo_url='https://ui-avatars.com/api/?name=' + name.replace(' ', '+'),
            loyalty_points=0
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        print(f"DEBUG: User created successfully. ID: {new_user.id}")
        return jsonify({'success': True, 'user': new_user.to_dict(), 'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        print(f"DEBUG: Database/Server Error: {str(e)}")
        return jsonify({'error': f'Database error: {str(e)}'}), 500

@auth_bp.route('/change-password', methods=['POST'])
def change_password():
    """Change user password"""
    data = request.get_json()
    user_id = data.get('userId')
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')
    
    if not all([user_id, old_password, new_password]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if not check_password_hash(user.password_hash, old_password):
        return jsonify({'error': 'Incorrect current password'}), 401
    
    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Password updated successfully'}), 200

@auth_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get user profile"""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200

@auth_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user profile"""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'phone' in data:
        user.phone = data['phone']
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'user': user.to_dict()
    }), 200
