const mongoose = require('mongoose');

const subServiceSchema = new mongoose.Schema({
    main_serviceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Service', 
        required: true 
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }
}, { timestamps: true });

// module.exports = mongoose.model('SubService', subServiceSchema);
// আপনার বর্তমান কোড হয়তো এমন:
// module.exports = mongoose.model('SubService', subServiceSchema);

// এটি পরিবর্তন করে নিচের মতো লিখুন:
module.exports = mongoose.models.SubService || mongoose.model('SubService', subServiceSchema);