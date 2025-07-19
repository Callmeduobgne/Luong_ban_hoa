from pymongo import MongoClient
from datetime import datetime
import bcrypt
from bson.objectid import ObjectId
import re

class User:
    def __init__(self, db):
        self.collection = db.users
        self.collection.create_index("email", unique=True)
        self.collection.create_index("phone")
        
    def create_user(self, user_data):
        if not self._is_valid_email(user_data['email']):
            raise ValueError("Email không hợp lệ")
        if not self._is_valid_phone(user_data['phone']):
            raise ValueError("Số điện thoại không hợp lệ")
        if self.find_by_email(user_data['email']):
            raise ValueError("Email đã được sử dụng")
        password = user_data['password'].encode('utf-8')
        hashed = bcrypt.hashpw(password, bcrypt.gensalt())
        user_doc = {
            'full_name': user_data['full_name'].strip(),
            'email': user_data['email'].lower().strip(),
            'phone': user_data['phone'].strip(),
            'password_hash': hashed,
            'role': user_data.get('role', 'user'),
            'is_active': True,
            'email_verified': False,
            'phone_verified': False,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'last_login': None,
            'login_count': 0
        }
        return str(self.collection.insert_one(user_doc).inserted_id)
    
    def find_by_email(self, email):
        return self.collection.find_one({'email': email.lower().strip()})
    
    def find_by_id(self, user_id):
        return self.collection.find_one({'_id': ObjectId(user_id)})
    
    def find_by_phone(self, phone):
        return self.collection.find_one({'phone': phone.strip()})
    
    def verify_password(self, password, hashed):
        return bcrypt.checkpw(password.encode('utf-8'), hashed)
    
    def update_last_login(self, user_id):
        return self.collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'last_login': datetime.utcnow(), 'login_count': 1}})
    
    def update_user(self, user_id, update_data):
        update_data['updated_at'] = datetime.utcnow()
        return self.collection.update_one({'_id': ObjectId(user_id)}, {'$set': update_data})
    
    def change_password(self, user_id, new_password):
        hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        return self.collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'password_hash': hashed, 'updated_at': datetime.utcnow()}})
    
    def deactivate_user(self, user_id):
        return self.collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'is_active': False, 'updated_at': datetime.utcnow()}})
    
    def get_all_users(self, skip=0, limit=50, search=None):
        query = {}
        if search:
            regex = re.compile(re.escape(search), re.IGNORECASE)
            query['$or'] = [
                {'full_name': regex},
                {'email': regex},
                {'phone': regex}
            ]
        return list(self.collection.find(query).skip(skip).limit(limit))
    
    def get_user_stats(self):
        total = self.collection.count_documents({})
        active = self.collection.count_documents({'is_active': True})
        return {'total': total, 'active': active}
    
    def _is_valid_email(self, email):
        return re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", email)
    
    def _is_valid_phone(self, phone):
        return re.match(r"^0\d{9,10}$", phone) 