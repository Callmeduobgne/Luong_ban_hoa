from datetime import datetime
from bson import ObjectId

class Product:
    def __init__(self, db):
        self.collection = db.products
    def create_product(self, data):
        product = {
            "name": data.get("name"),
            "description": data.get("description", ""),
            "price": float(data.get("price", 0)),
            "category": data.get("category", ""),
            "images": data.get("images", []),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        return str(self.collection.insert_one(product).inserted_id)
    def get_all_products(self, skip=0, limit=100, search="", category=""):
        query = {}
        if search:
            query["name"] = {"$regex": search, "$options": "i"}
        if category:
            query["category"] = category
        total = self.collection.count_documents(query)
        products = [{**p, "id": str(p.pop("_id"))} for p in self.collection.find(query).skip(skip).limit(limit)]
        return {
            "success": True,
            "data": {
                "products": products,
                "pagination": {
                    "current_page": skip // limit + 1,
                    "per_page": limit,
                    "total": total,
                    "total_pages": (total + limit - 1) // limit
                }
            }
        }
    def get_product_by_id(self, product_id):
        product = self.collection.find_one({"_id": ObjectId(product_id)})
        if product:
            product["id"] = str(product.pop("_id"))
            return {"success": True, "data": product}
        return {"success": False, "error": "Product not found"}
    def update_product(self, product_id, data):
        update_data = {
            "name": data.get("name"),
            "description": data.get("description", ""),
            "price": float(data.get("price", 0)),
            "category": data.get("category", ""),
            "images": data.get("images", []),
            "updated_at": datetime.utcnow()
        }
        result = self.collection.update_one({"_id": ObjectId(product_id)}, {"$set": update_data})
        if result.modified_count:
            return {"success": True, "data": "Product updated successfully"}
        return {"success": False, "error": "Product not found"}
    def delete_product(self, product_id):
        result = self.collection.delete_one({"_id": ObjectId(product_id)})
        if result.deleted_count:
            return {"success": True, "data": "Product deleted successfully"}
        return {"success": False, "error": "Product not found"} 