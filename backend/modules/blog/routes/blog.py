from flask import Blueprint, request, jsonify, current_app
from modules.auth.routes.admin import admin_required

blog_bp = Blueprint('blog', __name__)

def get_model(name): return getattr(current_app, f"{name}_model")

@blog_bp.route('/api/blogs', methods=['GET'])
def get_blogs():
    return jsonify(get_model('blog').get_all_blogs())

@blog_bp.route('/api/blogs/<blog_id>', methods=['GET'])
def get_blog(blog_id):
    return jsonify(get_model('blog').get_blog_by_id(blog_id))

@blog_bp.route('/api/blogs/featured', methods=['GET'])
def get_featured_blogs():
    """Lấy blog nổi bật cho trang chủ"""
    limit = int(request.args.get('limit', 3))
    blogs = get_model('blog').get_featured_blogs(limit)
    return jsonify({
        "success": True,
        "data": blogs
    })

# Admin endpoints
@blog_bp.route('/api/admin/blogs', methods=['GET'])
@admin_required
def get_admin_blogs(current_user):
    """Lấy tất cả blog cho admin (bao gồm draft)"""
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    search = request.args.get('search', '')
    status = request.args.get('status', '')
    skip = (page - 1) * per_page
    result = get_model('blog').get_all_blogs(skip, per_page, search, status)
    return jsonify(result)

@blog_bp.route('/api/admin/blogs', methods=['POST'])
@admin_required
def create_blog(current_user):
    return jsonify(get_model('blog').create_blog(request.json))

@blog_bp.route('/api/admin/blogs/<blog_id>', methods=['PUT'])
@admin_required
def update_blog(current_user, blog_id):
    return jsonify(get_model('blog').update_blog(blog_id, request.json))

@blog_bp.route('/api/admin/blogs/<blog_id>', methods=['DELETE'])
@admin_required
def delete_blog(current_user, blog_id):
    return jsonify(get_model('blog').delete_blog(blog_id)) 