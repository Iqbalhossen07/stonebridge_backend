const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // ১. এটি ইমপোর্ট করুন
const connectDB = require('./config/db');
const occupationRoutes = require('./routes/occupationRoutes');
const teamRoutes = require('./routes/teamRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const videoRoutes = require('./routes/videoRoutes');
const blogRoutes = require('./routes/blogRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const authRoutes = require('./routes/authRoutes'); // ২. লগইন রাউট ইমপোর্ট করুন

require('dotenv').config();

// ডাটাবেস কানেক্ট করা
connectDB();

const app = express();

// ২. মিডলওয়্যার আপডেট
app.use(cookieParser()); // ৩. কুকি পড়ার জন্য এটি মাস্ট

// ৪. CORS আপডেট (কুকি আদান-প্রদানের জন্য credentials: true প্রয়োজন)
app.use(cors({
    origin: 'http://localhost:5173', // আপনার ফ্রন্টএন্ড ইউআরএল
    credentials: true, // এটি ছাড়া কুকি ব্রাউজারে সেভ হবে না
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

// ৩. রাউটস ইন্টিগ্রেশন
app.use('/api', occupationRoutes);
app.use('/api', teamRoutes);
app.use('/api', galleryRoutes);
app.use('/api', videoRoutes);
app.use('/api', blogRoutes);
app.use('/api', testimonialRoutes);
app.use('/api', serviceRoutes);
app.use('/api/admin', authRoutes); // ৫. লগইন রাউট ইন্টিগ্রেশন

app.get('/', (res, req) => {
    res.send('Stonebridge API is running with MVC Architecture...');
});

// ৪. সার্ভার পোর্ট
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));