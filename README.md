# 🌸 No.07 floral - Luong Ban Hoa

Trang web thương mại điện tử chuyên cung cấp hoa tươi và quà tặng tại Thái Nguyên.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Inter + Playfair Display
- **Package Manager**: npm/yarn/pnpm

## 📦 Cài đặt

1. **Clone repository**
```bash
git clone <your-repo-url>
cd flowercorner-frontend
```

2. **Cài đặt dependencies**
```bash
# Sử dụng npm
npm install

# Hoặc yarn
yarn install

# Hoặc pnpm
pnpm install
```

3. **Chạy development server**
```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

4. **Mở trình duyệt**
Truy cập [http://localhost:3003]

## 🏗️ Cấu trúc dự án

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/         # React components
│   ├── ui/            # Base UI components
│   └── layout/        # Layout components
│       └── header/    # Header components
├── lib/               # Utilities
├── types/             # TypeScript types
└── hooks/             # Custom React hooks
```

## 🎨 Header Components

### Các component đã tạo:

1. **Header** (`src/components/layout/header/header.tsx`)
   - Component chính chứa toàn bộ header
   - Responsive design (desktop + mobile)
   - Sticky header với shadow

2. **Navigation** (`src/components/layout/header/navigation.tsx`)
   - Menu navigation với dropdown
   - Danh mục sản phẩm: Hoa tươi, Hoa chúc mừng, Hoa tang lễ, Quà tặng
   - Hover effects và transitions

3. **SearchBar** (`src/components/layout/header/search-bar.tsx`)
   - Input tìm kiếm với placeholder tiếng Việt
   - Submit form để redirect đến trang search

4. **CartButton** (`src/components/layout/header/cart-button.tsx`)
   - Icon giỏ hàng với badge số lượng
   - Link đến trang cart

5. **UserMenu** (`src/components/layout/header/user-menu.tsx`)
   - Menu user với dropdown
   - Trạng thái đăng nhập/chưa đăng nhập
   - Links: Đăng nhập, Đăng ký, Tài khoản, Đăng xuất

6. **LanguageSwitcher** (`src/components/layout/header/language-switcher.tsx`)
   - Chuyển đổi ngôn ngữ: Tiếng Việt ⇄ English
   - Dropdown với flag icons

7. **MobileNav** (`src/components/layout/header/mobile-nav.tsx`)
   - Navigation cho mobile
   - Slide-out menu từ bên phải
   - Expandable submenu

## 🎯 Tính năng Header

### ✅ Đã hoàn thành:
- [x] Responsive header layout
- [x] Logo và branding
- [x] Main navigation với dropdown
- [x] Search bar với form submit
- [x] Shopping cart icon với badge
- [x] User menu với authentication states
- [x] Language switcher (VI/EN)
- [x] Mobile navigation menu
- [x] Top bar với hotline và delivery info
- [x] Sticky header với shadow effect
- [x] Hover animations và transitions

### 🎨 Design Features:
- **Brand Colors**: Primary orange (#ec6b1f), Secondary green, Rose accents
- **Typography**: Inter (body), Playfair Display (headings)
- **Responsive**: Mobile-first design
- **Accessibility**: Keyboard navigation, focus indicators
- **Performance**: Optimized components, lazy loading

## 🚀 Chạy dự án

1. **Development**:
```bash
npm run dev
```

2. **Build**:
```bash
npm run build
```

3. **Production**:
```bash
npm start
```

4. **Type Check**:
```bash
npm run type-check
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎨 Color Palette

```css
Primary Orange: #ec6b1f
Secondary Green: #22c55e
Rose Accent: #f43f5e
Gray Scale: #f9fafb → #111827
```

## 📝 Ghi chú

- Các linter errors hiện tại do chưa cài đặt dependencies
- Chạy `npm install` để cài đặt tất cả packages cần thiết
- Header component đã được thiết kế responsive và ready for production
- Mobile navigation sử dụng slide-out menu với overlay

## 🔜 Tiếp theo

Sau khi hoàn thành Header, có thể tiếp tục phát triển:
- Footer component
- Hero section
- Product components
- Shopping cart functionality
- Authentication system

---

**N07.floral** - *Gửi yêu thương qua những đóa hoa tươi thắm* 🌸 