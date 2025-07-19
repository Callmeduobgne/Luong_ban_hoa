from datetime import datetime
from bson import ObjectId

class Order:
    def __init__(self, db):
        self.collection = db.orders
        self.users = db.users
    def create_order(self, data):
        order_number = f"DH{self.collection.count_documents({}) + 1:06d}"
        order_doc = {
            "order_number": order_number,
            "customer_name": data.get("customer_name"),
            "customer_phone": data.get("customer_phone"),
            "customer_id": data.get("customer_id"),
            "total_amount": data.get("total_amount", 0),
            "status": "pending",
            "payment_method": data.get("payment_method", "cod"),
            "created_at": datetime.utcnow()
        }
        return str(self.collection.insert_one(order_doc).inserted_id)
    def get_all_orders(self):
        orders = list(self.collection.find().sort("created_at", -1))
        for order in orders:
            order["id"] = str(order.pop("_id"))
            user = None
            if order.get("customer_id"):
                try:
                    user = self.users.find_one({"_id": ObjectId(order["customer_id"])})
                except Exception:
                    user = None
            if user:
                order["user_full_name"] = user.get("full_name", "")
                order["user_phone"] = user.get("phone", "")
                order["user_email"] = user.get("email", "")
            else:
                order["user_full_name"] = order.get("customer_name", "")
                order["user_phone"] = order.get("customer_phone", "")
                order["user_email"] = order.get("customer_email", "")
        return orders
    def update_order_status(self, order_id, new_status):
        return self.collection.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
        ).modified_count > 0
