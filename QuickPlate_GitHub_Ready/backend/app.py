from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Disable strict slashes to avoid 308 redirects
    app.url_map.strict_slashes = False
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.meals import meals_bp
    from routes.orders import orders_bp
    from routes.loyalty import loyalty_bp
    from routes.ai import ai_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(meals_bp, url_prefix='/api/meals')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(loyalty_bp, url_prefix='/api/loyalty')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    
    # Health check endpoint
    @app.route('/health')
    def health():
        return jsonify({'status': 'healthy', 'message': 'QuickPlate API is running'}), 200
    
    # Create database tables
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully")
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 QuickPlate Backend running on http://localhost:{port}")
    print(f"📚 API Documentation: http://localhost:{port}/health")
    app.run(host='0.0.0.0', port=port, debug=True)
