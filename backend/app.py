from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from core.config.config import config, Config
from modules.users.models.user import User
from modules.orders.models.order import Order
from modules.products.models.product import Product
from modules.orders.models.cart import CartModel
from modules.blog.models.blog import Blog
from modules.auth.routes.auth import auth_bp
from modules.auth.routes.admin import admin_bp
from modules.products.routes.product import product_bp
from modules.orders.routes.cart import cart_bp
from modules.blog.routes.blog import blog_bp
import os
import logging
from datetime import datetime

def create_app(config_name=None):
    """Application factory pattern"""
    
    # Create Flask app
    app = Flask(__name__)
    
    # Load configuration
    config_name = config_name or os.getenv('FLASK_ENV', 'development')
    app.config.from_object(config[config_name])
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    
    # Initialize configuration
    config[config_name].init_app(app)
    
    # Setup logging
    if not app.debug:
        logging.basicConfig(level=logging.INFO)
        app.logger.setLevel(logging.INFO)
    
    return app

def init_database(app):
    """Initialize database connection and models"""
    try:
        # Connect to MongoDB
        client = MongoClient(Config.MONGODB_URI)
        db = client[Config.DATABASE_NAME]
        
        # Test connection
        client.admin.command('ping')
        app.logger.info(f'Successfully connected to MongoDB: {Config.DATABASE_NAME}')
        
        # Initialize models
        app.user_model = User(db)
        app.order_model = Order(db)
        app.product_model = Product(db)
        app.cart_model = CartModel(db)
        app.blog_model = Blog(db)
        app.db = db
        app.mongo_client = client
        
        return True
        
    except Exception as e:
        app.logger.error(f'Failed to connect to MongoDB: {str(e)}')
        return False

def register_blueprints(app):
    """Register all blueprints"""
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(product_bp, url_prefix='/')
    app.register_blueprint(cart_bp)
    app.register_blueprint(blog_bp, url_prefix='/')

def register_error_handlers(app):
    """Register error handlers"""
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': 'Resource not found',
            'message': 'The requested resource could not be found.'
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': 'An internal server error occurred.'
        }), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'success': False,
            'error': 'Bad request',
            'message': 'The request could not be understood or was missing required parameters.'
        }), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({
            'success': False,
            'error': 'Unauthorized',
            'message': 'Authentication is required and has failed or has not yet been provided.'
        }), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({
            'success': False,
            'error': 'Forbidden',
            'message': 'You do not have permission to access this resource.'
        }), 403

def register_routes(app):
    """Register additional routes"""
    
    @app.route('/')
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'message': 'Flower Corner API is running! 🌸',
            'status': 'OK',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0',
            'environment': os.getenv('FLASK_ENV', 'development')
        })
    
    @app.route('/api/health')
    def api_health():
        """Detailed health check for API"""
        try:
            # Test database connection
            app.mongo_client.admin.command('ping')
            db_status = 'Connected'
        except:
            db_status = 'Disconnected'
        
        return jsonify({
            'api_status': 'OK',
            'database_status': db_status,
            'timestamp': datetime.utcnow().isoformat(),
            'uptime': 'N/A'  # TODO: Implement uptime tracking
        })
    
    @app.route('/api/info')
    def api_info():
        """API information endpoint"""
        return jsonify({
            'name': 'Flower Corner API',
            'version': '1.0.0',
            'description': 'Backend API for Flower Corner e-commerce website',
            'author': 'Flower Corner Team',
            'endpoints': {
                'authentication': [
                    'POST /api/auth/register',
                    'POST /api/auth/login',
                    'GET /api/auth/verify-token',
                    'POST /api/auth/change-password',
                    'GET /api/auth/profile',
                    'PUT /api/auth/update-profile'
                ],
                'health': [
                    'GET /',
                    'GET /api/health',
                    'GET /api/info'
                ]
            }
        })

    @app.route('/api/test')
    def test_cors():
        return jsonify({'ok': True, 'message': 'CORS test success'})

# Create Flask application
app = create_app()

CORS(app, origins="*", supports_credentials=True)

# Initialize database
if not init_database(app):
    print("❌ Failed to initialize database. Please check MongoDB connection.")
    exit(1)

# Register components
register_blueprints(app)
register_error_handlers(app)
register_routes(app)

if __name__ == '__main__':
    print("🌸 Starting No.07 Floral Backend API...")
    print(f"📊 Environment: {os.getenv('FLASK_ENV', 'development')}")
    print(f"🗄️  Database: {Config.DATABASE_NAME}")
    print(f"🌐 CORS Origins: {Config.CORS_ORIGINS}")
    print("=" * 50)
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5003)),
        debug=Config.FLASK_DEBUG
    ) 