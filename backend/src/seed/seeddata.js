// backend/src/scripts/seeddata.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import models from backend
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Subcategory = require('../models/SubCategory');

const initialProducts = [
  {
    name: "Handwoven Market Basket",
    price: 2900,
    category: "Basketry",
    subcategory: "Storage Baskets",
    description: "A sturdy handwoven basket for market trips, home storage, or natural shelf styling.",
    stock: 8,
    img: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Earth Glaze Ceramic Vase",
    price: 3900,
    category: "Ceramics",
    subcategory: "Decor Vases",
    description: "A warm earth-tone ceramic vase made for dried flowers, console tables, and soft room corners.",
    stock: 5,
    img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Macrame Wall Hanging",
    price: 3400,
    category: "Wall Decor",
    subcategory: "Macrame Art",
    description: "A textured macrame wall piece that adds handmade detail to bedrooms, studios, and living rooms.",
    stock: 3,
    img: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Hand-painted Clay Mug",
    price: 1900,
    category: "Tableware",
    subcategory: "Mugs",
    description: "A hand-painted clay mug for slow mornings, tea breaks, and thoughtful handmade gifting.",
    stock: 0,
    img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Soft Woolen Scarf",
    price: 2400,
    category: "Textiles",
    subcategory: "Scarves",
    description: "A soft woolen scarf with a simple woven finish, made for warmth and everyday styling.",
    stock: 6,
    img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Carved Wooden Bowl",
    price: 3200,
    category: "Woodcraft",
    subcategory: "Serving Bowls",
    description: "A carved wooden bowl for fruit, snacks, or display, finished to show the natural grain.",
    stock: 2,
    img: "https://images.unsplash.com/photo-1603512500383-f1f87c13ffc4?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Bamboo Wall Art",
    price: 2800,
    category: "Wall Decor",
    subcategory: "Wall Hangings",
    description: "A beautiful bamboo wall art piece that brings natural elegance to any room.",
    stock: 4,
    img: "https://images.unsplash.com/photo-1583947215251-6e63b2f8f4b9?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Ceramic Table Lamp",
    price: 4500,
    category: "Ceramics",
    subcategory: "Table Lamps",
    description: "A handcrafted ceramic table lamp that creates warm ambient lighting.",
    stock: 3,
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85"
  }
];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    console.log('🔍 Connecting to MongoDB...');
    const safeURI = mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@');
    console.log('📝 Using URI:', safeURI);

    // Connect with timeout
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create admin user - FIX: Don't hash here, let the model handle it
    console.log('👤 Creating admin user...');
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // IMPORTANT: Pass plain password, model will hash it
    const admin = await User.create({
      first_name: process.env.ADMIN_FIRST_NAME || 'Admin',
      last_name: process.env.ADMIN_LAST_NAME || 'User',
      email: process.env.ADMIN_EMAIL || 'admin@handicraft.com',
      password: adminPassword, // Plain password - model will hash
      role: 'admin',
      isActive: true
    });
    console.log(`✅ Admin user created: ${admin.email}`);
    console.log(`   Password: ${adminPassword}`);

    // Create categories
    console.log('📁 Creating categories...');
    const categoryNames = ['Basketry', 'Ceramics', 'Textiles', 'Woodcraft', 'Wall Decor', 'Tableware'];
    const createdCategories = [];
    for (const name of categoryNames) {
      const category = await Category.create({ 
        name, 
        isActive: true,
        description: `${name} products category`
      });
      createdCategories.push(category);
    }
    console.log(`✅ ${createdCategories.length} Categories created`);
    console.log(`   ${createdCategories.map(c => c.name).join(', ')}`);

    // Create subcategories
    console.log('📂 Creating subcategories...');
    const subcategoryData = [
      { name: 'Storage Baskets', category: 'Basketry' },
      { name: 'Decor Vases', category: 'Ceramics' },
      { name: 'Macrame Art', category: 'Wall Decor' },
      { name: 'Mugs', category: 'Tableware' },
      { name: 'Scarves', category: 'Textiles' },
      { name: 'Serving Bowls', category: 'Woodcraft' },
      { name: 'Wall Hangings', category: 'Wall Decor' },
      { name: 'Table Lamps', category: 'Ceramics' }
    ];

    const createdSubcategories = [];
    for (const sub of subcategoryData) {
      const category = await Category.findOne({ name: sub.category });
      const subcategory = await Subcategory.create({
        name: sub.name,
        category: category ? category._id : null,
        isActive: true,
        description: `${sub.name} subcategory`
      });
      createdSubcategories.push(subcategory);
    }
    console.log(`✅ ${createdSubcategories.length} Subcategories created`);
    console.log(`   ${createdSubcategories.map(s => s.name).join(', ')}`);

    // Create products
    console.log('🛍️ Creating products...');
    await Product.insertMany(initialProducts);
    console.log(`✅ ${initialProducts.length} Products created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('📝 Admin Credentials:');
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@handicraft.com'}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('\n📊 Summary:');
    console.log(`   👤 1 Admin user`);
    console.log(`   📁 ${createdCategories.length} Categories`);
    console.log(`   📂 ${createdSubcategories.length} Subcategories`);
    console.log(`   🛍️ ${initialProducts.length} Products`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    if (error.message.includes('whitelist')) {
      console.error('\n🔧 To fix this issue:');
      console.error('1. Go to MongoDB Atlas: https://cloud.mongodb.com');
      console.error('2. Click on your cluster');
      console.error('3. Click "Network Access" in the left sidebar');
      console.error('4. Click "Add IP Address"');
      console.error('5. Click "Allow Access from Anywhere" (0.0.0.0/0)');
      console.error('6. Click "Confirm"\n');
    }
    console.error('🔍 Error details:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();