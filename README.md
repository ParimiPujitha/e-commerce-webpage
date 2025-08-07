# TechMart - Full-Stack Ecommerce Website

A modern, beautiful, and fully functional ecommerce website for electronics and gadgets built with Node.js, Express, MongoDB, and vanilla JavaScript.

## 🚀 Features

### Frontend Features
- **Modern Responsive Design** - Beautiful UI with gradient backgrounds and smooth animations
- **Hero Slider** - Auto-sliding banner with manual controls and indicators
- **Advanced Search** - Real-time search suggestions with debouncing
- **Product Filtering** - Filter by category, trending, new arrivals, and sales
- **Wishlist System** - Add/remove products to wishlist with heart buttons
- **Shopping Cart** - Full cart functionality with quantity controls
- **User Authentication** - Login/Register with JWT tokens
- **Mobile Menu** - Responsive hamburger menu for mobile devices
- **Brand Showcase** - Display top electronics brands with hover effects
- **Newsletter Subscription** - Email subscription with beautiful design
- **Back to Top** - Smooth scroll to top button
- **Deal Countdown Timer** - Live countdown for special offers
- **Enhanced Notifications** - Beautiful notification system with icons

### Backend Features
- **RESTful API** - Complete API with all CRUD operations
- **User Authentication** - JWT-based authentication with bcrypt password hashing
- **Product Management** - Full product CRUD with image upload
- **Order Management** - Complete order processing system
- **Search & Filtering** - Advanced search and category filtering
- **File Upload** - Multer middleware for image uploads
- **Database Seeding** - Pre-populated with sample products
- **Admin Routes** - Protected admin routes for product management
- **Error Handling** - Comprehensive error handling and validation

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Vanilla JS with modern features
- **Font Awesome** - Icons
- **Google Fonts** - Inter font family

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **multer** - File upload middleware
- **cors** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd techmart-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/techmart
   JWT_SECRET=your-secret-key-here
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or use MongoDB Atlas.

5. **Seed the database**
   ```bash
   npm run seed
   ```
   This will create sample products and an admin user.

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String,
  email: String,
  phone: String,
  password: String,
  role: String,
  createdAt: Date
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  image: String,
  images: [String],
  rating: Number,
  reviews: Number,
  inStock: Boolean,
  featured: Boolean,
  discount: Number,
  specifications: Map,
  createdAt: Date
}
```

### Order Model
```javascript
{
  userId: ObjectId,
  products: [{
    productId: ObjectId,
    quantity: Number,
    price: Number
  }],
  total: Number,
  status: String,
  shippingAddress: Object,
  paymentMethod: String,
  createdAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search/:query` - Search products
- `GET /api/products/featured` - Get featured products

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders

### Admin Routes
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### File Upload
- `POST /api/upload` - Upload product images

### Database
- `POST /api/seed` - Seed database with sample data

## 🎨 Design Features

### Color Scheme
- **Primary**: #667eea (Blue)
- **Secondary**: #764ba2 (Purple)
- **Accent**: #ff6b6b (Coral)
- **Success**: #4CAF50 (Green)
- **Warning**: #ff9800 (Orange)
- **Error**: #f44336 (Red)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Animations
- Smooth hover effects
- Transform animations
- Fade-in/out transitions
- Loading states
- Modal slide animations

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🔐 Security Features

- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Cross-origin resource sharing configuration
- **File Upload Security** - File type and size validation

## 🚀 Performance Optimizations

- **Image Optimization** - Responsive images with proper sizing
- **Lazy Loading** - Load more products on demand
- **Debounced Search** - Optimized search with 300ms delay
- **Minified Assets** - Compressed CSS and JavaScript
- **CDN Integration** - Font Awesome and Google Fonts via CDN

## 🛍️ Ecommerce Features

### Shopping Experience
- **Product Catalog** - Browse products by category
- **Product Details** - Detailed product information with specifications
- **Search & Filter** - Advanced search with multiple filters
- **Wishlist** - Save products for later
- **Shopping Cart** - Add/remove items with quantity control
- **Checkout Process** - Complete order placement

### User Management
- **User Registration** - Create new accounts
- **User Login** - Secure authentication
- **Profile Management** - User profile and settings
- **Order History** - View past orders
- **Wishlist Management** - Manage saved items

### Admin Features
- **Product Management** - Add, edit, delete products
- **Order Management** - View and manage orders
- **User Management** - Admin user management
- **Analytics Dashboard** - Sales and user analytics

## 📁 Project Structure

```
techmart-ecommerce/
├── assets/
│   ├── brands/          # Brand logos
│   ├── deals/           # Deal images
│   ├── hero-banners/    # Hero banner images
│   └── products/        # Product images
├── uploads/             # Uploaded images
├── index.html           # Main HTML file
├── styles.css           # CSS styles
├── script.js            # Frontend JavaScript
├── server.js            # Backend server
├── package.json         # Dependencies
└── README.md           # Project documentation
```

## 🎯 Future Enhancements

- **Payment Integration** - Stripe/PayPal integration
- **Real-time Chat** - Customer support chat
- **Product Reviews** - User review system
- **Inventory Management** - Stock tracking
- **Email Notifications** - Order confirmations
- **Analytics Dashboard** - Sales analytics
- **Multi-language Support** - Internationalization
- **PWA Features** - Progressive Web App
- **Social Login** - Google/Facebook login
- **Advanced Search** - Elasticsearch integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Frontend Developer** - UI/UX Design and Implementation
- **Backend Developer** - API Development and Database Design
- **Full-Stack Developer** - Integration and Deployment

## 📞 Support

For support and questions:
- Email: support@techmart.com
- Phone: +91 98765 43210
- Website: https://techmart.com

---

**TechMart** - Your trusted source for premium electronics and gadgets! 🚀 