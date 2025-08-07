require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techmart', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Models
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    images: [String],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    specifications: { type: Map, of: String },
    createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    paymentMethod: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            username,
            email,
            phone,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const { category, search, sort, limit = 20, page = 1 } = req.query;
        let query = {};

        // Category filter
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // Sorting
        let sortOption = {};
        if (sort === 'price-low') sortOption = { price: 1 };
        else if (sort === 'price-high') sortOption = { price: -1 };
        else if (sort === 'rating') sortOption = { rating: -1 };
        else if (sort === 'newest') sortOption = { createdAt: -1 };
        else sortOption = { createdAt: -1 };

        const skip = (page - 1) * limit;
        const products = await Product.find(query)
            .sort(sortOption)
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Product.countDocuments(query);

        res.json({
            products,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
    try {
        const products = await Product.find({
            category: { $regex: req.params.category, $options: 'i' }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Search products
app.get('/api/products/search/:query', async (req, res) => {
    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: req.params.query, $options: 'i' } },
                { description: { $regex: req.params.query, $options: 'i' } },
                { category: { $regex: req.params.query, $options: 'i' } }
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get featured products
app.get('/api/products/featured', async (req, res) => {
    try {
        const products = await Product.find({ featured: true }).limit(8);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add to cart (simplified - in real app, use Redis or session)
app.post('/api/cart/add', authenticateToken, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // In a real app, you'd store cart in Redis or database
        res.json({ message: 'Product added to cart' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create order
app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const { products, total, shippingAddress, paymentMethod } = req.body;
        
        const order = new Order({
            userId: req.user.userId,
            products,
            total,
            shippingAddress,
            paymentMethod
        });

        await order.save();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user orders
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId })
            .populate('products.productId')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Upload product image
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({ 
            message: 'File uploaded successfully',
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin routes
app.post('/api/admin/products', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.put('/api/admin/products/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.delete('/api/admin/products/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Seed data
app.post('/api/seed', async (req, res) => {
    try {
        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        const adminUser = new User({
            username: 'admin',
            email: 'admin@techmart.com',
            phone: '9876543210',
            password: adminPassword,
            role: 'admin'
        });
        await adminUser.save();

        // Create sample products
        const products = [
            {
                name: "Samsung Galaxy S24 Ultra",
                description: "Latest Samsung flagship with S Pen, 200MP camera, and AI features",
                price: 129999,
                originalPrice: 149999,
                category: "Mobile",
                image: "assets/Products/samsung-s24-ultra.jpg",
                images: ["assets/Products/samsung-s24-ultra-1.jpg", "assets/Products/samsung-s24-ultra-2.jpg"],
                rating: 4.8,
                reviews: 234,
                featured: true,
                discount: 13,
                specifications: {
                    "Display": "6.8-inch Dynamic AMOLED 2X",
                    "Processor": "Snapdragon 8 Gen 3",
                    "RAM": "12GB",
                    "Storage": "256GB",
                    "Camera": "200MP + 12MP + 50MP + 10MP",
                    "Battery": "5000mAh"
                }
            },
            {
                name: "Apple iPhone 15 Pro Max",
                description: "Premium iPhone with titanium design, A17 Pro chip, and 5x optical zoom",
                price: 149999,
                originalPrice: 159999,
                category: "Mobile",
                image: "assets/Products/iphone-15-pro-max.jpg",
                images: ["assets/Products/iphone-15-pro-max-1.jpg", "assets/Products/iphone-15-pro-max-2.jpg"],
                rating: 4.9,
                reviews: 189,
                featured: true,
                discount: 6,
                specifications: {
                    "Display": "6.7-inch Super Retina XDR",
                    "Processor": "A17 Pro chip",
                    "RAM": "8GB",
                    "Storage": "256GB",
                    "Camera": "48MP + 12MP + 12MP",
                    "Battery": "4441mAh"
                }
            },
            {
                name: "MacBook Pro 16-inch M3 Max",
                description: "Powerful laptop for professionals with M3 Max chip and Liquid Retina XDR display",
                price: 349999,
                originalPrice: 399999,
                category: "Laptop",
                image: "assets/Products/macbook-pro-16.jpg",
                images: ["assets/Products/macbook-pro-16-1.jpg", "assets/Products/macbook-pro-16-2.jpg"],
                rating: 4.9,
                reviews: 156,
                featured: true,
                discount: 12,
                specifications: {
                    "Display": "16-inch Liquid Retina XDR",
                    "Processor": "M3 Max chip",
                    "RAM": "32GB",
                    "Storage": "1TB SSD",
                    "Graphics": "Integrated 40-core GPU",
                    "Battery": "Up to 22 hours"
                }
            },
            {
                name: "Dell XPS 15 9530",
                description: "Premium Windows laptop with OLED display and RTX 4070 graphics",
                price: 189999,
                originalPrice: 219999,
                category: "Laptop",
                image: "assets/Products/dell-xps-15.jpg",
                images: ["assets/Products/dell-xps-15-1.jpg", "assets/Products/dell-xps-15-2.jpg"],
                rating: 4.7,
                reviews: 98,
                featured: true,
                discount: 14,
                specifications: {
                    "Display": "15.6-inch 3.5K OLED",
                    "Processor": "Intel Core i9-13900H",
                    "RAM": "32GB DDR5",
                    "Storage": "1TB SSD",
                    "Graphics": "RTX 4070 8GB",
                    "Battery": "86Whr"
                }
            },
            {
                name: "Sony WH-1000XM5",
                description: "Industry-leading noise cancellation with exceptional sound quality",
                price: 29999,
                originalPrice: 34999,
                category: "Audio",
                image: "assets/Products/sony-wh1000xm5.jpg",
                images: ["assets/Products/sony-wh1000xm5-1.jpg", "assets/Products/sony-wh1000xm5-2.jpg"],
                rating: 4.8,
                reviews: 267,
                featured: true,
                discount: 14,
                specifications: {
                    "Type": "Over-ear wireless",
                    "Noise Cancellation": "Industry-leading",
                    "Battery Life": "30 hours",
                    "Connectivity": "Bluetooth 5.2",
                    "Weight": "250g",
                    "Features": "Touch controls, Quick Charge"
                }
            },
            {
                name: "Samsung 65-inch QLED 4K TV",
                description: "Quantum HDR with 100% color volume and Object Tracking Sound",
                price: 129999,
                originalPrice: 149999,
                category: "TV",
                image: "assets/Products/samsung-qled-65.jpg",
                images: ["assets/Products/samsung-qled-65-1.jpg", "assets/Products/samsung-qled-65-2.jpg"],
                rating: 4.6,
                reviews: 134,
                featured: true,
                discount: 13,
                specifications: {
                    "Display": "65-inch QLED 4K",
                    "Resolution": "3840 x 2160",
                    "HDR": "Quantum HDR",
                    "Smart TV": "Tizen OS",
                    "Connectivity": "4 HDMI, 2 USB",
                    "Audio": "Object Tracking Sound"
                }
            },
            {
                name: "Canon EOS R6 Mark II",
                description: "Full-frame mirrorless camera with 24.2MP and 4K video",
                price: 189999,
                originalPrice: 209999,
                category: "Camera",
                image: "assets/Products/canon-eos-r6-mark2.jpg",
                images: ["assets/Products/canon-eos-r6-mark2-1.jpg", "assets/Products/canon-eos-r6-mark2-2.jpg"],
                rating: 4.7,
                reviews: 89,
                featured: true,
                discount: 10,
                specifications: {
                    "Sensor": "24.2MP Full-frame CMOS",
                    "Video": "4K 60p",
                    "AF Points": "1053 AF areas",
                    "ISO": "100-102400",
                    "Burst": "40 fps",
                    "Stabilization": "5-axis IBIS"
                }
            },
            {
                name: "Apple iPad Pro 12.9-inch",
                description: "M2 chip with Liquid Retina XDR display and Apple Pencil support",
                price: 109999,
                originalPrice: 129999,
                category: "Tablet",
                image: "assets/Products/ipad-pro-12-9.jpg",
                images: ["assets/Products/ipad-pro-12-9-1.jpg", "assets/Products/ipad-pro-12-9-2.jpg"],
                rating: 4.8,
                reviews: 145,
                featured: true,
                discount: 15,
                specifications: {
                    "Display": "12.9-inch Liquid Retina XDR",
                    "Processor": "M2 chip",
                    "Storage": "256GB",
                    "Camera": "12MP + 10MP",
                    "Battery": "Up to 10 hours",
                    "Features": "Apple Pencil 2 support"
                }
            }
        ];

        await Product.insertMany(products);
        res.json({ message: 'Database seeded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Seed data: POST http://localhost:${PORT}/api/seed`);
}); 