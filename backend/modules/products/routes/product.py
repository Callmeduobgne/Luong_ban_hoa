from flask import Blueprint, request, jsonify, current_app
from modules.auth.routes.admin import admin_required

product_bp = Blueprint('product', __name__)

def get_model(name): return getattr(current_app, f"{name}_model")

@product_bp.route('/api/products', methods=['GET'])
def get_products():
    args = request.args
    page, per_page = int(args.get('page', 1)), int(args.get('per_page', 100))
    search, category = args.get('search', ''), args.get('category', '')
    skip = (page - 1) * per_page
    return jsonify(get_model('product').get_all_products(skip, per_page, search, category))

@product_bp.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    return jsonify(get_model('product').get_product_by_id(product_id))

@product_bp.route('/api/admin/products', methods=['POST'])
@admin_required
def create_product(current_user):
    return jsonify(get_model('product').create_product(request.json))

@product_bp.route('/api/admin/products/<product_id>', methods=['PUT'])
@admin_required
def update_product(current_user, product_id):
    return jsonify(get_model('product').update_product(product_id, request.json))

@product_bp.route('/api/admin/products/<product_id>', methods=['DELETE'])
@admin_required
def delete_product(current_user, product_id):
    return jsonify(get_model('product').delete_product(product_id)) 