# 🌸 No.O7 floral

**Shop Hoa Tươi Thái Nguyên** - Hệ thống quản lý shop hoa tươi với giao diện hiện đại và API backend mạnh mẽ.

## 🚀 Tính năng chính

### Frontend (Next.js 14)
- ✅ **Giao diện responsive** với Tailwind CSS
- ✅ **Hệ thống authentication** (Đăng ký/Đăng nhập)
- ✅ **Quản lý sản phẩm** theo danh mục
- ✅ **Giỏ hàng** với Zustand state management
- ✅ **Admin dashboard** cho quản lý
- ✅ **Blog section** với nội dung động
- ✅ **Tối ưu SEO** và performance

### Backend (Flask API)
- ✅ **RESTful API** với Flask Blueprints
- ✅ **JWT Authentication** với access/refresh tokens
- ✅ **MongoDB** database với PyMongo
- ✅ **User Management** (CRUD operations)
- ✅ **Product Management** với categories
- ✅ **Order Management** với status tracking
- ✅ **Cart Management** với real-time updates
- ✅ **Blog Management** cho admin

## 🛠️ Công nghệ sử dụng

### Frontend
- **Next.js 14** với App Router
- **TypeScript** cho type safety
- **Tailwind CSS** cho styling
- **Zustand** cho state management
- **React Hook Form** cho form handling
- **Lucide React** cho icons
- **React Hot Toast** cho notifications

### Backend
- **Flask** web framework
- **PyMongo** cho MongoDB
- **PyJWT** cho authentication
- **bcrypt** cho password hashing
- **Flask-CORS** cho cross-origin requests
- **python-dotenv** cho environment variables

### Database
- **MongoDB** NoSQL database

## 📁 Cấu trúc dự án

```
luongbanhoa/
├── src/                          # Frontend source code
│   ├── app/                      # Next.js App Router
│   ├── features/                 # Feature-based modules
│   │   ├── auth/                 # Authentication
│   │   ├── products/             # Product management
│   │   ├── cart/                 # Shopping cart
│   │   └── admin/                # Admin dashboard
│   ├── shared/                   # Shared components & services
│   │   ├── components/           # UI components
│   │   ├── services/             # API services
│   │   └── types/                # TypeScript types
│   └── assets/                   # Static assets
├── backend/                      # Flask backend
│   ├── modules/                  # Feature modules
│   │   ├── auth/                 # Authentication routes
│   │   ├── users/                # User management
│   │   ├── products/             # Product management
│   │   ├── orders/               # Order management
│   │   └── blog/                 # Blog management
│   ├── core/                     # Core configuration
│   │   ├── config/               # App configuration
│   │   ├── database/             # Database setup
│   │   └── middleware/           # Custom middleware
│   └── shared/                   # Shared utilities
├── public/                       # Static files
└── docs/                         # Documentation
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+ 
- Python 3.8+
- MongoDB 4.4+

### 1. Clone repository
```bash
git clone https://github.com/your-username/luongbanhoa.git
cd luongbanhoa
```

### 2. Cài đặt Frontend
```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3003

### 3. Cài đặt Backend
```bash
cd backend

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Tạo file .env (copy từ .env.example)
cp .env.example .env

# Chạy Flask app
python app.py
```

Backend sẽ chạy tại: http://localhost:5003

### 4. Cấu hình Database
```bash
# Đảm bảo MongoDB đang chạy
mongod

# Import sample data (tùy chọn)
python scripts/import_sample_data.py
```

## 🔧 Cấu hình Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5003
NEXT_PUBLIC_APP_NAME=NO7.floral
```

### Backend (.env)
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/
DATABASE_NAME=flower_shop

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key
JWT_REFRESH_SECRET_KEY=your-refresh-secret-key
JWT_EXPIRATION_HOURS=24

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5003

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3003
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/verify-token` - Xác thực token
- `POST /api/auth/refresh-token` - Làm mới token

### Product Endpoints
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/admin/products` - Tạo sản phẩm mới (Admin)
- `PUT /api/admin/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/admin/products/:id` - Xóa sản phẩm (Admin)

### Order Endpoints
- `GET /api/orders` - Lấy danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng

### Cart Endpoints
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart` - Thêm sản phẩm vào giỏ hàng
- `PUT /api/cart/:productId` - Cập nhật số lượng
- `DELETE /api/cart/:productId` - Xóa sản phẩm khỏi giỏ hàng

## 🎨 Tính năng UI/UX

- **Responsive Design** - Tương thích mọi thiết bị
- **Dark/Light Mode** - Chế độ tối/sáng
- **Smooth Animations** - Hiệu ứng mượt mà
- **Loading States** - Trạng thái tải
- **Error Handling** - Xử lý lỗi thân thiện
- **Toast Notifications** - Thông báo real-time

## 🔒 Bảo mật

- **JWT Authentication** với refresh tokens
- **Password Hashing** với bcrypt
- **CORS Protection** cho API
- **Input Validation** và sanitization
- **Rate Limiting** (có thể thêm)
- **HTTPS** cho production

## 📱 Responsive Design

- **Mobile First** approach
- **Tablet** optimized
- **Desktop** enhanced
- **Touch-friendly** interactions

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Heroku/Railway)
```bash
# Tạo Procfile
echo "web: python app.py" > Procfile

# Deploy
git push heroku main
```

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

- **Website**: https://n07floral.vn
- **Email**: info@n07floral.vn
- **Phone**: 0987.654.321
- **Address**: Thành phố Thái Nguyên, Tỉnh Thái Nguyên, Việt Nam

---

**Made with ❤️ in Thái Nguyên** 