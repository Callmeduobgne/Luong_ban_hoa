import re
from datetime import datetime, timezone
from bson import ObjectId
import json

def is_valid_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email.strip()) is not None

def is_valid_phone(phone):
    """Validate Vietnamese phone number"""
    # Vietnamese phone number patterns: 0xxxxxxxxx (10-11 digits)
    pattern = r'^0[0-9]{9,10}$'
    return re.match(pattern, phone.strip()) is not None

def serialize_datetime(obj):
    """Convert datetime objects to ISO format strings for JSON serialization"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    return obj

def serialize_objectid(obj):
    """Convert ObjectId to string for JSON serialization"""
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj

def clean_dict_for_json(data):
    """Clean dictionary for JSON serialization"""
    if isinstance(data, dict):
        cleaned = {}
        for key, value in data.items():
            if isinstance(value, ObjectId):
                cleaned[key] = str(value)
            elif isinstance(value, datetime):
                cleaned[key] = value.isoformat()
            elif isinstance(value, dict):
                cleaned[key] = clean_dict_for_json(value)
            elif isinstance(value, list):
                cleaned[key] = [clean_dict_for_json(item) if isinstance(item, dict) else serialize_objectid(serialize_datetime(item)) for item in value]
            else:
                cleaned[key] = value
        return cleaned
    elif isinstance(data, list):
        return [clean_dict_for_json(item) if isinstance(item, dict) else serialize_objectid(serialize_datetime(item)) for item in data]
    else:
        return serialize_objectid(serialize_datetime(data))

def validate_password_strength(password):
    """Validate password strength"""
    if len(password) < 6:
        return False, "Mật khẩu phải có ít nhất 6 ký tự"
    
    # Optional: Add more password requirements
    # if not re.search(r'[A-Za-z]', password):
    #     return False, "Mật khẩu phải chứa ít nhất 1 chữ cái"
    # if not re.search(r'[0-9]', password):
    #     return False, "Mật khẩu phải chứa ít nhất 1 số"
    
    return True, "Mật khẩu hợp lệ"

def sanitize_string(text, max_length=None):
    """Sanitize and clean string input"""
    if not text:
        return ""
    
    # Strip whitespace
    text = text.strip()
    
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    
    # Truncate if max_length specified
    if max_length and len(text) > max_length:
        text = text[:max_length]
    
    return text

def format_phone_number(phone):
    """Format Vietnamese phone number"""
    if not phone:
        return ""
    
    # Remove all non-digit characters
    phone = re.sub(r'\D', '', phone)
    
    # Add leading 0 if missing (for Vietnamese numbers)
    if len(phone) == 9 and not phone.startswith('0'):
        phone = '0' + phone
    
    return phone

def generate_username_from_email(email):
    """Generate username from email"""
    if not email:
        return ""
    
    username = email.split('@')[0]
    # Remove special characters except underscore and dot
    username = re.sub(r'[^a-zA-Z0-9._]', '', username)
    
    return username.lower()

def paginate_query(collection, query, page=1, per_page=20, sort_field='created_at', sort_direction=-1):
    """Paginate MongoDB query"""
    try:
        # Calculate skip value
        skip = (page - 1) * per_page
        
        # Get total count
        total = collection.count_documents(query)
        
        # Get paginated results
        results = list(
            collection.find(query)
            .sort(sort_field, sort_direction)
            .skip(skip)
            .limit(per_page)
        )
        
        # Calculate pagination info
        total_pages = (total + per_page - 1) // per_page
        has_prev = page > 1
        has_next = page < total_pages
        
        return {
            'data': results,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'total_pages': total_pages,
                'has_prev': has_prev,
                'has_next': has_next,
                'prev_page': page - 1 if has_prev else None,
                'next_page': page + 1 if has_next else None
            }
        }
    except Exception as e:
        return {
            'data': [],
            'pagination': {
                'page': 1,
                'per_page': per_page,
                'total': 0,
                'total_pages': 0,
                'has_prev': False,
                'has_next': False,
                'prev_page': None,
                'next_page': None
            },
            'error': str(e)
        }

def create_search_query(search_term, fields):
    """Create MongoDB search query for multiple fields"""
    if not search_term or not fields:
        return {}
    
    search_conditions = []
    for field in fields:
        search_conditions.append({
            field: {
                '$regex': search_term,
                '$options': 'i'  # Case insensitive
            }
        })
    
    return {'$or': search_conditions}

def get_client_ip(request):
    """Get client IP address from request"""
    # Check for forwarded IP (when behind proxy)
    forwarded_ip = request.headers.get('X-Forwarded-For')
    if forwarded_ip:
        return forwarded_ip.split(',')[0].strip()
    
    # Check for real IP
    real_ip = request.headers.get('X-Real-IP')
    if real_ip:
        return real_ip
    
    # Fallback to remote address
    return request.remote_addr

def log_user_activity(user_id, action, details=None, ip_address=None):
    """Log user activity (placeholder for future implementation)"""
    activity_log = {
        'user_id': user_id,
        'action': action,
        'details': details,
        'ip_address': ip_address,
        'timestamp': datetime.utcnow()
    }
    
    # TODO: Implement activity logging to database
    print(f"User Activity: {activity_log}")
    
    return activity_log 