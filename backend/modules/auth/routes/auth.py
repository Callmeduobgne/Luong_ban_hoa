from flask import Blueprint, request, jsonify, current_app
import jwt
from datetime import datetime, timedelta
from core.config.config import Config
from functools import wraps

auth_bp = Blueprint('auth', __name__)

def get_model(name): return getattr(current_app, f"{name}_model")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token không hợp lệ'}), 401
        if not token:
            return jsonify({'message': 'Token không được cung cấp'}), 401
        try:
            data = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
            current_user = get_model('user').find_by_id(data['user_id'])
            if not current_user or not current_user.get('is_active'):
                return jsonify({'message': 'Tài khoản không tồn tại hoặc đã bị khóa'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token đã hết hạn'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token không hợp lệ'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def create_tokens(user_id, email, role):
    access_token = jwt.encode({
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.utcnow() + timedelta(hours=1),
        'iat': datetime.utcnow()
    }, Config.JWT_SECRET_KEY, algorithm='HS256')
    refresh_token = jwt.encode({
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }, Config.JWT_REFRESH_SECRET_KEY, algorithm='HS256')
    return access_token, refresh_token

@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Không có dữ liệu được gửi'}), 400
    required = ['full_name', 'email', 'phone', 'password']
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({'message': f'Thiếu thông tin: {", ".join(missing)}'}), 400
    if len(data['full_name'].strip()) < 2:
        return jsonify({'message': 'Họ và tên phải có ít nhất 2 ký tự'}), 400
    if len(data['password']) < 6:
        return jsonify({'message': 'Mật khẩu phải có ít nhất 6 ký tự'}), 400
    try:
        user_id = get_model('user').create_user(data)
        return jsonify({'message': f'Tài khoản {data["full_name"]} đã được tạo thành công!', 'user_id': user_id, 'success': True}), 201
    except ValueError as e:
        return jsonify({'message': str(e), 'success': False}), 400
    except Exception as e:
        current_app.logger.error(f'Register error: {str(e)}')
        return jsonify({'message': 'Có lỗi xảy ra khi tạo tài khoản.', 'success': False}), 500

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    email, password = data.get('email'), data.get('password')
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    user = get_model('user').find_by_email(email)
    if not user or not user.get('is_active', True):
        return jsonify({'message': 'Invalid email or password'}), 401
    if not get_model('user').verify_password(password, user['password_hash']):
        return jsonify({'message': 'Invalid email or password'}), 401
    get_model('user').update_last_login(str(user['_id']))
    access_token, refresh_token = create_tokens(str(user['_id']), user['email'], user['role'])
    user_data = {k: user[k] for k in ['full_name', 'email', 'phone', 'role', 'is_active']}
    user_data['id'] = str(user['_id'])
    user_data['created_at'] = user.get('created_at').isoformat() if user.get('created_at') else None
    user_data['last_login'] = user.get('last_login').isoformat() if user.get('last_login') else None
    user_data['login_count'] = user.get('login_count', 0)
    return jsonify({'message': f'Welcome {user["full_name"]}!', 'access_token': access_token, 'refresh_token': refresh_token, 'user': user_data, 'success': True})

@auth_bp.route('/api/auth/verify-token', methods=['GET'])
@token_required
def verify_token(current_user):
    user_data = {k: current_user[k] for k in ['full_name', 'email', 'phone', 'role', 'is_active']}
    user_data['id'] = str(current_user['_id'])
    return jsonify({'message': 'Token hợp lệ', 'user': user_data})

@auth_bp.route('/api/auth/change-password', methods=['POST'])
@token_required
def change_password(current_user):
    """Change user password"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Không có dữ liệu được gửi'}), 400
        
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        if not current_password or not new_password:
            return jsonify({'message': 'Mật khẩu hiện tại và mật khẩu mới là bắt buộc'}), 400
        
        if len(new_password) < 6:
            return jsonify({'message': 'Mật khẩu mới phải có ít nhất 6 ký tự'}), 400
        
        # Get user model
        user_model = get_model('user')
        
        # Verify current password
        if not user_model.verify_password(current_password, current_user['password_hash']):
            return jsonify({'message': 'Mật khẩu hiện tại không đúng'}), 400
        
        # Change password
        if user_model.change_password(str(current_user['_id']), new_password):
            return jsonify({
                'message': 'Đổi mật khẩu thành công',
                'success': True
            }), 200
        else:
            return jsonify({'message': 'Có lỗi xảy ra khi đổi mật khẩu', 'success': False}), 500
            
    except Exception as e:
        current_app.logger.error(f'Change password error: {str(e)}')
        return jsonify({'message': 'Có lỗi xảy ra khi đổi mật khẩu', 'success': False}), 500

@auth_bp.route('/api/auth/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    """Get user profile information"""
    try:
        user_data = {
            'id': str(current_user['_id']),
            'full_name': current_user['full_name'],
            'email': current_user['email'],
            'phone': current_user['phone'],
            'role': current_user['role'],
            'is_active': current_user['is_active'],
            'email_verified': current_user.get('email_verified', False),
            'phone_verified': current_user.get('phone_verified', False),
            'created_at': current_user['created_at'].isoformat() if current_user.get('created_at') else None,
            'updated_at': current_user['updated_at'].isoformat() if current_user.get('updated_at') else None,
            'last_login': current_user.get('last_login').isoformat() if current_user.get('last_login') else None,
            'login_count': current_user.get('login_count', 0)
        }
        
        return jsonify({
            'message': 'Lấy thông tin profile thành công',
            'user': user_data,
            'success': True
        }), 200
        
    except Exception as e:
        current_app.logger.error(f'Get profile error: {str(e)}')
        return jsonify({'message': 'Có lỗi xảy ra khi lấy thông tin profile', 'success': False}), 500

@auth_bp.route('/api/auth/update-profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    """Update user profile information"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Không có dữ liệu được gửi'}), 400
        
        # Allowed fields to update
        allowed_fields = ['full_name', 'phone']
        update_data = {}
        
        for field in allowed_fields:
            if field in data:
                if field == 'full_name' and len(data[field].strip()) < 2:
                    return jsonify({'message': 'Họ và tên phải có ít nhất 2 ký tự'}), 400
                update_data[field] = data[field].strip()
        
        if not update_data:
            return jsonify({'message': 'Không có dữ liệu để cập nhật'}), 400
        
        # Get user model
        user_model = get_model('user')
        
        # Update user
        if user_model.update_user(str(current_user['_id']), update_data):
            return jsonify({
                'message': 'Cập nhật thông tin thành công',
                'success': True
            }), 200
        else:
            return jsonify({'message': 'Có lỗi xảy ra khi cập nhật thông tin', 'success': False}), 500
            
    except Exception as e:
        current_app.logger.error(f'Update profile error: {str(e)}')
        return jsonify({'message': 'Có lỗi xảy ra khi cập nhật thông tin', 'success': False}), 500

@auth_bp.route('/api/auth/refresh-token', methods=['POST'])
def refresh_token():
    """Refresh access token using refresh token"""
    try:
        data = request.get_json()
        refresh_token = data.get('refresh_token')
        
        if not refresh_token:
            return jsonify({'message': 'Refresh token is required'}), 400
            
        try:
            # Verify refresh token
            payload = jwt.decode(
                refresh_token,
                Config.JWT_REFRESH_SECRET_KEY,
                algorithms=['HS256']
            )
            
            # Get user from database
            user_model = get_model('user')
            user = user_model.find_by_id(payload['user_id'])
            
            if not user or not user.get('is_active'):
                return jsonify({'message': 'User not found or inactive'}), 401
                
            # Create new access token
            access_token, new_refresh_token = create_tokens(
                str(user['_id']),
                user['email'],
                user['role']
            )
            
            return jsonify({
                'access_token': access_token,
                'refresh_token': new_refresh_token,
                'success': True
            })
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Refresh token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid refresh token'}), 401
            
    except Exception as e:
        current_app.logger.error(f'Refresh token error: {str(e)}')
        return jsonify({'message': 'Error refreshing token'}), 500 