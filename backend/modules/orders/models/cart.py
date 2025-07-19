class CartModel:
    def __init__(self, db):
        self.collection = db.carts
    def get_cart(self, user_id):
        cart = self.collection.find_one({'user_id': user_id})
        return cart or {'items': []}
    def update_cart(self, user_id, items):
        self.collection.update_one(
            {'user_id': user_id},
            {'$set': {'items': items if isinstance(items, list) else []}},
            upsert=True
        ) 