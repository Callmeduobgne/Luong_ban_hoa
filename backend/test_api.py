#!/usr/bin/env python3
"""
Test script for Flower Corner API endpoints
"""

import requests
import json

def test_api_endpoints():
    """Test các API endpoints"""
    
    print('🧪 Testing Flower Corner API Endpoints...')
    print('=' * 45)
    
    base_url = 'http://localhost:5000'
    
    # Test cases
    tests = [
        {
            'name': 'Health Check',
            'url': f'{base_url}/',
            'method': 'GET'
        },
        {
            'name': 'API Health',
            'url': f'{base_url}/api/health',
            'method': 'GET'
        },
        {
            'name': 'API Info',
            'url': f'{base_url}/api/info', 
            'method': 'GET'
        }
    ]
    
    results = []
    
    for test in tests:
        try:
            if test['method'] == 'GET':
                response = requests.get(test['url'], timeout=5)
            
            if response.status_code == 200:
                print(f"✅ {test['name']}: OK ({response.status_code})")
                results.append(True)
            else:
                print(f"❌ {test['name']}: Failed ({response.status_code})")
                results.append(False)
                
        except requests.exceptions.ConnectionError:
            print(f"⚠️  {test['name']}: Connection failed - API not running")
            results.append(False)
        except Exception as e:
            print(f"❌ {test['name']}: Error - {str(e)}")
            results.append(False)
    
    print('=' * 45)
    
    # Summary
    passed = sum(results)
    total = len(results)
    
    if passed == total:
        print(f"🎉 All tests passed! ({passed}/{total})")
        return True
    else:
        print(f"⚠️  {passed}/{total} tests passed")
        if passed == 0:
            print("💡 Please start Flask app first: python app.py")
        return False

def test_authentication():
    """Test authentication endpoints"""
    
    print('\n🔐 Testing Authentication Endpoints...')
    print('=' * 40)
    
    base_url = 'http://localhost:5000'
    
    # Test data
    test_user = {
        'full_name': 'Test User API',
        'email': 'test.api@example.com',
        'phone': '0999888777',
        'password': 'test123456'
    }
    
    try:
        # Test register
        print("📝 Testing user registration...")
        response = requests.post(
            f'{base_url}/api/auth/register',
            json=test_user,
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        
        if response.status_code == 201:
            print("✅ Registration: OK")
            
            # Test login
            print("🔑 Testing user login...")
            login_data = {
                'email': test_user['email'],
                'password': test_user['password']
            }
            
            response = requests.post(
                f'{base_url}/api/auth/login',
                json=login_data,
                headers={'Content-Type': 'application/json'},
                timeout=5
            )
            
            if response.status_code == 200:
                print("✅ Login: OK")
                data = response.json()
                if 'access_token' in data:
                    print("✅ JWT Token: Received")
                    return data['access_token']
                else:
                    print("❌ JWT Token: Missing")
            else:
                print(f"❌ Login: Failed ({response.status_code})")
                
        elif response.status_code == 400:
            # User might already exist, try login
            print("⚠️  User might already exist, trying login...")
            login_data = {
                'email': test_user['email'],
                'password': test_user['password']
            }
            
            response = requests.post(
                f'{base_url}/api/auth/login',
                json=login_data,
                headers={'Content-Type': 'application/json'},
                timeout=5
            )
            
            if response.status_code == 200:
                print("✅ Login: OK")
                data = response.json()
                return data.get('access_token')
            else:
                print(f"❌ Login: Failed ({response.status_code})")
        else:
            print(f"❌ Registration: Failed ({response.status_code})")
            
    except requests.exceptions.ConnectionError:
        print("⚠️  Connection failed - API not running")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    return None

if __name__ == '__main__':
    # Test basic endpoints
    api_working = test_api_endpoints()
    
    # Test authentication if API is working
    if api_working:
        token = test_authentication()
        if token:
            print(f"\n🎉 Full API test completed successfully!")
            print(f"🔑 JWT Token sample: {token[:50]}...")
        else:
            print(f"\n⚠️  API working but authentication has issues")
    else:
        print(f"\n❌ API not accessible - please start Flask app first") 