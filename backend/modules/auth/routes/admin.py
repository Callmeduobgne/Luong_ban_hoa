from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta
from modules.auth.routes.auth import token_required
from bson.objectid import ObjectId
import logging

admin_bp = Blueprint('admin', __name__)

def get_model(name): return getattr(current_app, f"{name}_model")

def admin_required(f):
    from functools import wraps
    @wraps(f)
    @token_required
    def decorated(current_user, *args, **kwargs):
        if not current_user or current_user.get('role') != 'admin':
            return jsonify({'success': False, 'message': 'Cần quyền admin để truy cập'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@admin_bp.route('/dashboard-stats', methods=['GET'])
@admin_required
def get_dashboard_stats(current_user):
    try:
        user_model, order_model = get_model('user'), get_model('order')
        total_users = user_model.collection.count_documents({})
        admin_count = user_model.collection.count_documents({'role': 'admin'})
        active_users = user_model.collection.count_documents({'is_active': True})
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_registrations = user_model.collection.count_documents({'created_at': {'$gte': today}})
        week_ago = datetime.now() - timedelta(days=7)
        recent_logins = user_model.collection.count_documents({'last_login': {'$gte': week_ago}})
        revenue = next(order_model.collection.aggregate([
            {"$match": {"status": "completed"}},
            {"$group": {"_id": None, "total": {"$sum": "$total_amount"}}}
        ]), {}).get('total', 0)
        pending_revenue = next(order_model.collection.aggregate([
            {"$match": {"status": "pending"}},
            {"$group": {"_id": None, "total": {"$sum": "$total_amount"}}}
        ]), {}).get('total', 0)
        return jsonify({'success': True, 'data': {
                'total_users': total_users,
                'admin_users': admin_count,
                'active_users': active_users,
                'today_registrations': today_registrations,
                'recent_logins': recent_logins,
                'revenue': revenue,
                'pending_revenue': pending_revenue,
            'growth': {'users_growth': 25, 'activity_growth': 12, 'registrations_growth': 100}
        }})
    except Exception as e:
        logging.error(f"Dashboard stats error: {str(e)}")
        return jsonify({'success': False, 'message': 'Lỗi khi lấy thống kê dashboard'}), 500

@admin_bp.route('/recent-activity', methods=['GET'])
@admin_required
def get_recent_activity(current_user):
    try:
        user_model = get_model('user')
        recent_users = list(user_model.collection.find({}, {
            'full_name': 1, 'email': 1, 'role': 1, 'created_at': 1, 'last_login': 1, 'login_count': 1
        }).sort('created_at', -1).limit(10))
        activities = []
        for user in recent_users:
            activities.append({'id': str(user['_id']) + '_register', 'type': 'register', 'user': user['full_name'],
                'description': 'đã đăng ký tài khoản mới', 'timestamp': user.get('created_at').isoformat() if user.get('created_at') else None,
                'icon': 'UserPlus', 'iconColor': 'text-blue-600'})
            if user.get('last_login'):
                activities.append({'id': str(user['_id']) + '_login', 'type': 'login', 'user': user['full_name'],
                    'description': 'đã đăng nhập vào hệ thống', 'timestamp': user['last_login'].isoformat(),
                    'icon': 'LogIn', 'iconColor': 'text-green-600'})
        activities.sort(key=lambda x: x['timestamp'] or '', reverse=True)
        return jsonify({'success': True, 'data': activities[:15]})
    except Exception as e:
        logging.error(f"Recent activity error: {str(e)}")
        return jsonify({'success': False, 'message': 'Lỗi khi lấy hoạt động gần đây'}), 500

# Users Management
@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users(current_user):
    """Lấy danh sách users với phân trang và filter"""
    try:
        user_model = get_model('user')
        
        # Tham số query
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        search = request.args.get('search', '')
        role_filter = request.args.get('role', '')
        status_filter = request.args.get('status', '')
        
        # Tạo filter query
        filter_query = {}
        
        if search:
            filter_query['$or'] = [
                {'full_name': {'$regex': search, '$options': 'i'}},
                {'email': {'$regex': search, '$options': 'i'}},
                {'phone': {'$regex': search, '$options': 'i'}}
            ]
        
        if role_filter:
            filter_query['role'] = role_filter
            
        if status_filter:
            filter_query['is_active'] = status_filter == 'active'
        
        # Đếm tổng số
        total = user_model.collection.count_documents(filter_query)
        
        # Lấy users với phân trang
        skip = (page - 1) * per_page
        users = list(user_model.collection.find(
            filter_query,
            {'password_hash': 0}  # Không trả về password_hash
        ).skip(skip).limit(per_page).sort('created_at', -1))
        
        # Format dữ liệu
        formatted_users = []
        for user in users:
            formatted_users.append({
                'id': str(user['_id']),
                'full_name': user.get('full_name', ''),
                'email': user.get('email', ''),
                'phone': user.get('phone', ''),
                'role': user.get('role', 'user'),
                'is_active': user.get('is_active', True),
                'created_at': user.get('created_at').isoformat() if user.get('created_at') else None,
                'last_login': user.get('last_login').isoformat() if user.get('last_login') else None,
                'login_count': user.get('login_count', 0)
            })
        
        return jsonify({
            'success': True,
            'data': {
                'users': formatted_users,
                'pagination': {
                    'current_page': page,
                    'per_page': per_page,
                    'total': total,
                    'total_pages': (total + per_page - 1) // per_page
                }
            }
        })
        
    except Exception as e:
        logging.error(f"Get users error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Lỗi khi lấy danh sách users'
        }), 500

# Toggle User Status
@admin_bp.route('/users/<user_id>/status', methods=['PUT'])
@admin_required
def toggle_user_status(current_user, user_id):
    """Bật/tắt trạng thái user"""
    try:
        user_model = get_model('user')
        
        # Không cho phép admin tự vô hiệu hóa mình
        if user_id == str(current_user['_id']):
            return jsonify({
                'success': False,
                'message': 'Không thể thay đổi trạng thái của chính mình'
            }), 400
        
        user = user_model.find_by_id(user_id)
        if not user:
            return jsonify({
                'success': False,
                'message': 'Không tìm thấy user'
            }), 404
        
        # Toggle trạng thái
        new_status = not user.get('is_active', True)
        
        result = user_model.collection.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$set': {
                    'is_active': new_status,
                    'updated_at': datetime.now()
                }
            }
        )
        
        if result.modified_count:
            return jsonify({
                'success': True,
                'message': f'Đã {"kích hoạt" if new_status else "vô hiệu hóa"} user',
                'data': {'is_active': new_status}
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Không thể cập nhật trạng thái user'
            }), 500
            
    except Exception as e:
        logging.error(f"Toggle user status error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Lỗi khi cập nhật trạng thái user'
        }), 500

# Delete User
@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@admin_required
def delete_user(current_user, user_id):
    """Xóa user"""
    try:
        user_model = get_model('user')
        
        # Không cho phép admin xóa chính mình
        if user_id == str(current_user['_id']):
            return jsonify({
                'success': False,
                'message': 'Không thể xóa chính mình'
            }), 400
        
        user = user_model.find_by_id(user_id)
        if not user:
            return jsonify({
                'success': False,
                'message': 'Không tìm thấy user'
            }), 404
        
        # Không cho phép xóa admin khác
        if user.get('role') == 'admin':
            return jsonify({
                'success': False,
                'message': 'Không thể xóa admin khác'
            }), 400
        
        result = user_model.collection.delete_one({'_id': ObjectId(user_id)})
        
        if result.deleted_count:
            return jsonify({
                'success': True,
                'message': 'Đã xóa user thành công'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Không thể xóa user'
            }), 500
            
    except Exception as e:
        logging.error(f"Delete user error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Lỗi khi xóa user'
        }), 500

# Get User Detail
@admin_bp.route('/users/<user_id>', methods=['GET'])
@admin_required
def get_user_detail(current_user, user_id):
    """Lấy chi tiết user"""
    try:
        user_model = get_model('user')
        
        user = user_model.find_by_id(user_id)
        if not user:
            return jsonify({
                'success': False,
                'message': 'Không tìm thấy user'
            }), 404
        
        # Format dữ liệu (loại bỏ password)
        user_data = {
            'id': str(user['_id']),
            'full_name': user.get('full_name', ''),
            'email': user.get('email', ''),
            'phone': user.get('phone', ''),
            'role': user.get('role', 'user'),
            'is_active': user.get('is_active', True),
            'created_at': user.get('created_at').isoformat() if user.get('created_at') else None,
            'last_login': user.get('last_login').isoformat() if user.get('last_login') else None,
            'login_count': user.get('login_count', 0)
        }
        
        return jsonify({
            'success': True,
            'data': user_data
        })
        
    except Exception as e:
        logging.error(f"Get user detail error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Lỗi khi lấy chi tiết user'
        }), 500

# Orders Management
@admin_bp.route("/orders", methods=["GET"])
@admin_required
def get_orders(current_user):
    """Lấy danh sách đơn hàng"""
    try:
        order_model = get_model('order')
        orders = order_model.get_all_orders()
        return jsonify({"success": True, "data": {"orders": orders}})
    except Exception as e:
        return jsonify({"success": False, "message": "Lỗi khi lấy đơn hàng"}), 500

@admin_bp.route("/orders", methods=["POST"])
@token_required
def create_order(current_user):
    """Tạo đơn hàng mới"""
    try:
        data = request.get_json()
        order_model = get_model('order')
        # Gán tên, sdt và customer_id từ current_user vào data
        data["customer_name"] = current_user.get("full_name", "")
        data["customer_phone"] = current_user.get("phone", "")
        data["customer_id"] = str(current_user["_id"])
        order_id = order_model.create_order(data)
        return jsonify({"success": True, "message": "Đơn hàng đã được tạo", "order_id": order_id})
    except Exception as e:
        return jsonify({"success": False, "message": "Lỗi khi tạo đơn hàng"}), 500

@admin_bp.route("/my-orders", methods=["GET"])
@token_required
def get_my_orders(current_user):
    """Lấy danh sách đơn hàng của chính user đang đăng nhập"""
    try:
        order_model = get_model('order')
        user_id = str(current_user['_id'])
        # Lấy các đơn hàng có customer_id là user hiện tại
        orders = list(order_model.collection.find({"customer_id": user_id}).sort("created_at", -1))
        for order in orders:
            order["id"] = str(order["_id"])
            del order["_id"]
            # Đảm bảo luôn trả về trường items (danh sách sản phẩm)
            order["items"] = order.get("items", [])
        return jsonify({"success": True, "data": {"orders": orders}})
    except Exception as e:
        return jsonify({"success": False, "message": "Lỗi khi lấy đơn hàng"}), 500

@admin_bp.route("/orders/<order_id>/status", methods=["PUT"])
@admin_required
def update_order_status(current_user, order_id):
    """Admin xác nhận/cập nhật trạng thái đơn hàng"""
    try:
        data = request.get_json()
        new_status = data.get("status")
        if new_status not in ["pending", "processing", "completed", "cancelled"]:
            return jsonify({"success": False, "message": "Trạng thái không hợp lệ"}), 400
        order_model = get_model('order')
        success = order_model.update_order_status(order_id, new_status)
        if success:
            return jsonify({"success": True, "message": "Cập nhật trạng thái đơn hàng thành công"})
        else:
            return jsonify({"success": False, "message": "Không tìm thấy đơn hàng hoặc không cập nhật được"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": "Lỗi khi cập nhật trạng thái đơn hàng"}), 500
