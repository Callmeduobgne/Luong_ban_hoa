import requests

# Thông tin tài khoản test (thay bằng tài khoản hợp lệ của bạn)
EMAIL = 'your_email@example.com'
PASSWORD = 'your_password'

BASE_URL = 'http://localhost:5003'

# 1. Đăng nhập để lấy access token
login_resp = requests.post(f'{BASE_URL}/api/auth/login', json={
    'email': EMAIL,
    'password': PASSWORD
})
if login_resp.status_code != 200:
    print('Login failed:', login_resp.status_code, login_resp.text)
    exit(1)
token = login_resp.json().get('access_token')
print('Token:', token)

# 2. Gọi API cần JWT (/api/cart)
headers = {'Authorization': f'Bearer {token}'}
cart_resp = requests.get(f'{BASE_URL}/api/cart', headers=headers)
print('Cart API response:', cart_resp.status_code, cart_resp.text) 