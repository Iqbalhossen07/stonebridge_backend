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

module.exports = mongoose.model('SubService', subServiceSchema);