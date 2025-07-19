from flask import Blueprint, request, jsonify, current_app
from modules.auth.routes.auth import token_required

cart_bp = Blueprint('cart', __name__)

def get_model(name): return getattr(current_app, f"{name}_model")

@cart_bp.route('/api/cart', methods=['GET'])
@token_required
def get_cart(current_user):
    return jsonify(get_model('cart').get_cart(current_user['_id']))

@cart_bp.route('/api/cart', methods=['POST'])
@token_required
def add_to_cart(current_user):
    return jsonify(get_model('cart').add_to_cart(current_user['_id'], request.json))

@cart_bp.route('/api/cart/<product_id>', methods=['PUT'])
@token_required
def update_cart_item(current_user, product_id):
    return jsonify(get_model('cart').update_cart_item(current_user['_id'], product_id, request.json))

@cart_bp.route('/api/cart/<product_id>', methods=['DELETE'])
@token_required
def remove_cart_item(current_user, product_id):
    return jsonify(get_model('cart').remove_cart_item(current_user['_id'], product_id)) 