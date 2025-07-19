from datetime import datetime
from bson import ObjectId

class Blog:
    def __init__(self, db):
        self.collection = db.blogs
    def create_blog(self, data):
        blog = {
            "title": data.get("title"),
            "content": data.get("content", ""),
            "excerpt": data.get("excerpt", ""),
            "image": data.get("image", ""),
            "author": data.get("author", "N07.floral"),
            "status": data.get("status", "published"),
            "tags": data.get("tags", []),
            "is_featured": data.get("is_featured", False),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        return str(self.collection.insert_one(blog).inserted_id)
    def get_all_blogs(self, skip=0, limit=100, search="", status=""):
        query = {}
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"content": {"$regex": search, "$options": "i"}},
                {"excerpt": {"$regex": search, "$options": "i"}}
            ]
        if status:
            query["status"] = status
        total = self.collection.count_documents(query)
        blogs = [{**b, "id": str(b.pop("_id"))} for b in self.collection.find(query).skip(skip).limit(limit).sort("created_at", -1)]
        return {
            "success": True,
            "data": {
                "blogs": blogs,
                "pagination": {
                    "current_page": skip // limit + 1,
                    "per_page": limit,
                    "total": total,
                    "total_pages": (total + limit - 1) // limit
                }
            }
        }
    def get_blog_by_id(self, blog_id):
        blog = self.collection.find_one({"_id": ObjectId(blog_id)})
        if blog:
            blog["id"] = str(blog.pop("_id"))
            return {"success": True, "data": blog}
        return {"success": False, "error": "Blog not found"}
    def update_blog(self, blog_id, data):
        update_data = {
            "title": data.get("title"),
            "content": data.get("content", ""),
            "excerpt": data.get("excerpt", ""),
            "image": data.get("image", ""),
            "author": data.get("author", "N07.floral"),
            "status": data.get("status", "published"),
            "tags": data.get("tags", []),
            "is_featured": data.get("is_featured", False),
            "updated_at": datetime.utcnow()
        }
        result = self.collection.update_one({"_id": ObjectId(blog_id)}, {"$set": update_data})
        if result.modified_count:
            return {"success": True, "data": "Blog updated successfully"}
        return {"success": False, "error": "Blog not found"}
    def delete_blog(self, blog_id):
        result = self.collection.delete_one({"_id": ObjectId(blog_id)})
        if result.deleted_count:
            return {"success": True, "data": "Blog deleted successfully"}
        return {"success": False, "error": "Blog not found"}
    def get_featured_blogs(self, limit=3):
        blogs = [{**b, "id": str(b.pop("_id"))} for b in self.collection.find({"status": "published", "is_featured": True}).limit(limit).sort("created_at", -1)]
        return blogs
    def get_published_blogs(self, limit=10):
        blogs = [{**b, "id": str(b.pop("_id"))} for b in self.collection.find({"status": "published"}).limit(limit).sort("created_at", -1)]
        return blogs 