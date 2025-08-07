require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techmart', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB for seeding...');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
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

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

// Sample data
const sampleUsers = [
    {
        username: 'admin',
        email: 'admin@techmart.com',
        phone: '9876543210',
        password: 'admin123',
        role: 'admin'
    },
    {
        username: 'john_doe',
        email: 'john@example.com',
        phone: '9876543211',
        password: 'password123',
        role: 'user'
    },
    {
        username: 'jane_smith',
        email: 'jane@example.com',
        phone: '9876543212',
        password: 'password123',
        role: 'user'
    }
];

const sampleProducts = [
    {
        name: "Samsung Galaxy S24 Ultra",
        description: "Latest Samsung flagship with S Pen, 200MP camera, and AI features. Experience the future of mobile technology with the most advanced smartphone ever created.",
        price: 129999,
        originalPrice: 149999,
        category: "Mobile",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop"
        ],
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
            "Battery": "5000mAh",
            "OS": "Android 14 with One UI 6.1"
        }
    },
    {
        name: "Apple iPhone 15 Pro Max",
        description: "Premium iPhone with titanium design, A17 Pro chip, and 5x optical zoom. The most powerful iPhone ever with groundbreaking camera capabilities.",
        price: 149999,
        originalPrice: 159999,
        category: "Mobile",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop"
        ],
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
            "Battery": "4441mAh",
            "OS": "iOS 17"
        }
    },
    {
        name: "MacBook Pro 16-inch M3 Max",
        description: "Powerful laptop for professionals with M3 Max chip and Liquid Retina XDR display. The ultimate machine for creators and developers.",
        price: 349999,
        originalPrice: 399999,
        category: "Laptop",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop"
        ],
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
            "Battery": "Up to 22 hours",
            "OS": "macOS Sonoma"
        }
    },
    {
        name: "Dell XPS 15 9530",
        description: "Premium Windows laptop with OLED display and RTX 4070 graphics. Perfect for content creators and power users.",
        price: 189999,
        originalPrice: 219999,
        category: "Laptop",
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop"
        ],
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
            "Battery": "86Whr",
            "OS": "Windows 11 Pro"
        }
    },
    {
        name: "Sony WH-1000XM5",
        description: "Industry-leading noise cancellation with exceptional sound quality. The best wireless headphones for music lovers.",
        price: 29999,
        originalPrice: 34999,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
        ],
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
        description: "Quantum HDR with 100% color volume and Object Tracking Sound. Immerse yourself in stunning picture quality.",
        price: 129999,
        originalPrice: 149999,
        category: "TV",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop"
        ],
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
        description: "Full-frame mirrorless camera with 24.2MP and 4K video. Perfect for professional photography and videography.",
        price: 189999,
        originalPrice: 209999,
        category: "Camera",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop"
        ],
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
        description: "M2 chip with Liquid Retina XDR display and Apple Pencil support. The most powerful iPad ever created.",
        price: 109999,
        originalPrice: 129999,
        category: "Tablet",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop"
        ],
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
    },
    {
        name: "AirPods Pro 2nd Generation",
        description: "Active noise cancellation with spatial audio and sweat resistance. The perfect wireless earbuds for Apple users.",
        price: 24999,
        originalPrice: 29999,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
        ],
        rating: 4.7,
        reviews: 203,
        featured: false,
        discount: 17,
        specifications: {
            "Type": "In-ear wireless",
            "Noise Cancellation": "Active",
            "Battery Life": "6 hours",
            "Connectivity": "Bluetooth 5.0",
            "Features": "Spatial Audio, Sweat resistant"
        }
    },
    {
        name: "Samsung Galaxy Tab S9 Ultra",
        description: "14.6-inch AMOLED display with S Pen and powerful performance. The ultimate Android tablet experience.",
        price: 89999,
        originalPrice: 99999,
        category: "Tablet",
        image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop"
        ],
        rating: 4.6,
        reviews: 78,
        featured: false,
        discount: 10,
        specifications: {
            "Display": "14.6-inch AMOLED",
            "Processor": "Snapdragon 8 Gen 2",
            "RAM": "12GB",
            "Storage": "256GB",
            "Camera": "13MP + 8MP",
            "Battery": "11200mAh"
        }
    },
    {
        name: "Nikon Z9",
        description: "Flagship mirrorless camera with 45.7MP and 8K video recording. The ultimate camera for professionals.",
        price: 449999,
        originalPrice: 499999,
        category: "Camera",
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop"
        ],
        rating: 4.9,
        reviews: 45,
        featured: false,
        discount: 10,
        specifications: {
            "Sensor": "45.7MP Full-frame",
            "Video": "8K 30p",
            "AF Points": "493 AF areas",
            "ISO": "64-25600",
            "Burst": "20 fps",
            "Stabilization": "5-axis IBIS"
        }
    },
    {
        name: "LG C3 77-inch OLED TV",
        description: "Perfect black levels with AI-powered processing and Dolby Vision. The ultimate home theater experience.",
        price: 299999,
        originalPrice: 349999,
        category: "TV",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop"
        ],
        rating: 4.8,
        reviews: 67,
        featured: false,
        discount: 14,
        specifications: {
            "Display": "77-inch OLED 4K",
            "Resolution": "3840 x 2160",
            "HDR": "Dolby Vision, HDR10",
            "Smart TV": "webOS",
            "Connectivity": "4 HDMI 2.1",
            "Audio": "Dolby Atmos"
        }
    }
];

// Seed function
async function seedDatabase() {
    try {
        console.log('Starting database seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

        // Hash passwords and create users
        const hashedUsers = await Promise.all(
            sampleUsers.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return { ...user, password: hashedPassword };
            })
        );

        // Insert users
        const createdUsers = await User.insertMany(hashedUsers);
        console.log(`Created ${createdUsers.length} users`);

        // Insert products
        const createdProducts = await Product.insertMany(sampleProducts);
        console.log(`Created ${createdProducts.length} products`);

        console.log('Database seeding completed successfully!');
        console.log('\nSample login credentials:');
        console.log('Admin - Email: admin@techmart.com, Password: admin123');
        console.log('User - Email: john@example.com, Password: password123');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
        process.exit(1);
    }
}

// Run the seed function
seedDatabase(); 