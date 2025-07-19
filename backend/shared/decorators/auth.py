from functools import wraps
from flask import jsonify, request, current_app
import jwt
from config import Config

def admin_required(f):
    """Decorator to require admin role for protected routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'message': 'Token không hợp lệ'}), 401
        
        if not token:
            return jsonify({'message': 'Token không được cung cấp'}), 401
        
        try:
            # Decode token
            data = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
            
            # Check if user is admin
            if data.get('role') != 'admin':
                return jsonify({'message': 'Không có quyền truy cập'}), 403
                
            # Get user from database
            user_model = current_app.user_model
            current_user = user_model.find_by_id(data['user_id'])
            
            if not current_user or not current_user.get('is_active'):
                return jsonify({'message': 'Tài khoản không tồn tại hoặc đã bị khóa'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token đã hết hạn'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token không hợp lệ'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated 