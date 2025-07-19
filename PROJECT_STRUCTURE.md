# 🏗️ Cấu trúc Project - N07.floral

## 📁 **Tổ chức theo Feature-based Architecture**

### **🎯 Nguyên tắc tổ chức:**
- ✅ **Feature-based**: Mỗi feature có components, hooks, services riêng
- ✅ **Shared components**: Tách riêng UI components có thể tái sử dụng
- ✅ **Clear separation**: Frontend/Backend tách biệt rõ ràng
- ✅ **Easy navigation**: Tìm kiếm nhanh theo feature

---

## 🖥️ **Frontend Structure (src/)**

```
src/
├── features/                    # 🎯 Feature-based modules
│   ├── auth/                   # Authentication & Authorization
│   │   ├── components/         # Auth-specific components
│   │   │   ├── auth-popup.tsx
│   │   │   ├── account-info-popup.tsx
│   │   │   └── my-orders-popup.tsx
│   │   ├── hooks/             # Auth hooks & context
│   │   │   └── auth-context.tsx
│   │   ├── services/          # Auth API calls
│   │   ├── types/             # Auth-related types
│   │   └── index.ts           # Feature exports
│   │
│   ├── products/              # Product management
│   │   ├── components/        # Product components
│   │   │   ├── banner.tsx
│   │   │   ├── featured-products/
│   │   │   ├── categories-section.tsx
│   │   │   └── blog-section.tsx
│   │   ├── hooks/             # Product hooks
│   │   ├── services/          # Product API
│   │   └── types/             # Product types
│   │
│   ├── cart/                  # Shopping cart
│   │   ├── components/        # Cart components
│   │   ├── hooks/             # Cart store & hooks
│   │   │   └── cart-store.ts
│   │   └── services/          # Cart API
│   │
│   ├── admin/                 # Admin dashboard
│   │   ├── components/        # Admin components
│   │   │   ├── admin-layout.tsx
│   │   │   ├── dashboard-stats.tsx
│   │   │   ├── orders-list.tsx
│   │   │   └── users-list.tsx
│   │   ├── hooks/             # Admin hooks
│   │   └── services/          # Admin API
│   │
│   └── blog/                  # Blog functionality
│       ├── components/        # Blog components
│       ├── hooks/             # Blog hooks
│       └── services/          # Blog API
│
├── shared/                     # 🔄 Shared across features
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Basic UI elements
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/           # Layout components
│   │   │   ├── header/
│   │   │   └── footer/
│   │   └── forms/            # Form components
│   ├── hooks/                # Global hooks
│   ├── services/             # API client, utilities
│   │   ├── api-client.ts
│   │   └── utils.ts
│   ├── constants/            # App constants
│   │   ├── products.ts
│   │   └── testimonials.ts
│   └── types/                # Global types
│       ├── index.ts
│       └── product.ts
│
├── app/                       # 📄 Next.js App Router
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   ├── globals.css           # Global styles
│   ├── admin/                # Admin routes
│   ├── products/             # Product routes
│   └── cart/                 # Cart routes
│
└── assets/                    # 🎨 Static assets
    ├── images/               # Images
    ├── icons/                # Icons
    └── styles/               # Additional styles
        └── product-card-effect.css
```

---

## 🔧 **Backend Structure (backend/)**

```
backend/
├── core/                      # 🏗️ Core functionality
│   ├── config/               # Configuration
│   │   └── config.py         # App configuration
│   ├── database/             # DB connection & setup
│   ├── middleware/           # Custom middleware
│   └── exceptions/           # Custom exceptions
│
├── modules/                   # 📦 Business modules
│   ├── auth/                 # Authentication module
│   │   ├── models/           # Auth models
│   │   ├── routes/           # Auth routes
│   │   │   ├── auth.py       # Login/Register
│   │   │   └── admin.py      # Admin routes
│   │   ├── services/         # Auth business logic
│   │   └── validators/       # Input validation
│   │
│   ├── users/                # User management
│   │   ├── models/           # User models
│   │   │   └── user.py
│   │   ├── routes/           # User routes
│   │   ├── services/         # User services
│   │   └── validators/       # User validation
│   │
│   ├── products/             # Product management
│   │   ├── models/           # Product models
│   │   │   └── product.py
│   │   ├── routes/           # Product routes
│   │   │   └── product.py
│   │   ├── services/         # Product services
│   │   └── validators/       # Product validation
│   │
│   ├── orders/               # Order & Cart management
│   │   ├── models/           # Order models
│   │   │   ├── order.py
│   │   │   └── cart.py
│   │   ├── routes/           # Order routes
│   │   │   └── cart.py
│   │   ├── services/         # Order services
│   │   └── validators/       # Order validation
│   │
│   └── blog/                 # Blog management
│       ├── models/           # Blog models
│       │   └── blog.py
│       ├── routes/           # Blog routes
│       │   └── blog.py
│       ├── services/         # Blog services
│       └── validators/       # Blog validation
│
├── shared/                    # 🔄 Shared utilities
│   ├── utils/                # Helper functions
│   │   └── helpers.py
│   ├── decorators/           # Custom decorators
│   │   └── auth.py
│   └── constants/            # Constants
│
├── scripts/                   # 🔧 Utility scripts
├── tests/                     # 🧪 Test files
├── app.py                     # Main Flask application
└── requirements.txt           # Dependencies
```

---

## 🔍 **Tìm kiếm nhanh theo chức năng:**

### **🔐 Authentication:**
- **Frontend**: `src/features/auth/`
- **Backend**: `backend/modules/auth/`

### **🛒 Products & Shopping:**
- **Frontend**: `src/features/products/` + `src/features/cart/`
- **Backend**: `backend/modules/products/` + `backend/modules/orders/`

### **👑 Admin Dashboard:**
- **Frontend**: `src/features/admin/`
- **Backend**: `backend/modules/auth/routes/admin.py`

### **📝 Blog:**
- **Frontend**: `src/features/blog/`
- **Backend**: `backend/modules/blog/`

### **🎨 UI Components:**
- **Shared**: `src/shared/components/ui/`
- **Layout**: `src/shared/components/layout/`

---

## 📝 **Import Paths (TypeScript):**

```typescript
// Feature imports
import { AuthPopup } from '@/features/auth'
import { ProductCard } from '@/features/products'
import { AdminLayout } from '@/features/admin'

// Shared imports
import { Button } from '@/shared/components/ui'
import { Header } from '@/shared/components/layout'
import { apiClient } from '@/shared/services'
import { Product } from '@/shared/types'

// Direct imports
import { useAuth } from '@/features/auth/hooks/auth-context'
import { useCartStore } from '@/features/cart/hooks/cart-store'
```

---

## 🚀 **Lợi ích của cấu trúc mới:**

### ✅ **Tìm kiếm nhanh:**
- Biết ngay feature nào ở đâu
- Tất cả file liên quan trong 1 thư mục

### ✅ **Sửa chữa dễ dàng:**
- Thay đổi 1 feature không ảnh hưởng feature khác
- Code organization rõ ràng

### ✅ **Scalable:**
- Dễ thêm feature mới
- Team có thể work parallel trên các feature

### ✅ **Reusable:**
- Shared components được tách riêng
- Tái sử dụng code hiệu quả

### ✅ **Maintainable:**
- Clean architecture
- Separation of concerns
- Easy to test

---

## 📋 **Next Steps:**

1. **Cập nhật import paths** trong các file còn lại
2. **Test functionality** sau khi reorganize
3. **Tạo documentation** cho từng feature
4. **Setup linting rules** cho cấu trúc mới
5. **Optimize build process** cho cấu trúc mới

---

**🌸 N07.floral - Organized for Growth & Maintainability** 