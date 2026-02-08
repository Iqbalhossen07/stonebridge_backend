const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin'); // আপনার অ্যাডমিন মডেলের পাথ
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // আগে থেকে কেউ আছে কি না চেক করা
        const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });
        if (existingAdmin) {
            console.log("Admin already exists!");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const newAdmin = new Admin({
            name: 'Super Admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            image: 'admin.png'
        });

        await newAdmin.save();
        console.log("✅ Admin Created Successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();