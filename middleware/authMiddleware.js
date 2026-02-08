const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    // ব্রাউজারের কুকি থেকে টোকেনটি সংগ্রহ করা
    const token = req.cookies.adminToken;

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Access Denied! No token provided." 
        });
    }

    try {
        // টোকেনটি সঠিক কি না তা যাচাই করা
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'YOUR_SECRET_KEY');
        req.user = verified;
        next(); // সব ঠিক থাকলে পরের ধাপে (Controller-এ) যাওয়ার অনুমতি দেবে
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: "Invalid Token!" 
        });
    }
};