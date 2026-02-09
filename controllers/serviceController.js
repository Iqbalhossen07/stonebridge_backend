const Service = require('../models/Service');
const SubService = require('../models/SubService');

// --- Main Service Logic ---

// ১. মেইন সার্ভিস অ্যাড
exports.addMainService = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newService = new Service({
            title,
            description,
            image: req.file.path
        });
        await newService.save();
        res.status(201).json({ success: true, message: "Main Service Created!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ২. সব সার্ভিস এবং সাথে সাব-সার্ভিসগুলো নিয়ে আসা (Services.jsx পেইজের জন্য)
exports.getAllWithSub = async (req, res) => {
    try {
        const services = await Service.aggregate([
            {
                $lookup: {
                    from: 'subservices', // মঙ্গোডিবি কালেকশন নেম (সাধারণত মডেলের প্লুরাল)
                    localField: '_id',
                    foreignField: 'main_serviceId',
                    as: 'sub_services'
                }
            }
        ]).sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ৩. মেইন সার্ভিস আপডেট
exports.updateMainService = async (req, res) => {
    try {
        const { title, description } = req.body;
        let updateData = { title, description };
        if (req.file) updateData.image = req.file.path;

        await Service.findByIdAndUpdate(req.params.id, updateData);
        res.status(200).json({ success: true, message: "Service Updated!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ৪. মেইন সার্ভিস ডিলিট (সাথে সাব-সার্ভিসও ডিলিট হবে)
exports.deleteMainService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        await SubService.deleteMany({ main_serviceId: req.params.id });
        res.status(200).json({ success: true, message: "Service and its Sub-services Deleted!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Sub Service Logic ---

// ৫. সাব-সার্ভিস অ্যাড
exports.addSubService = async (req, res) => {
    try {
        const { main_serviceId, title, description } = req.body;
        const newSub = new SubService({
            main_serviceId,
            title,
            description,
            image: req.file.path
        });
        await newSub.save();
        res.status(201).json({ success: true, message: "Sub-service Added!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ৬. সাব-সার্ভিস ডিলিট
// সাব-সার্ভিস ডিলিট করার লজিক
exports.deleteSubService = async (req, res) => {
    try {
        const subId = req.params.id;
        const deletedSub = await SubService.findByIdAndDelete(subId);

        if (!deletedSub) {
            return res.status(404).json({ success: false, message: "Sub-service not found" });
        }

        res.status(200).json({ success: true, message: "Sub-service deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// সাব-সার্ভিস সিঙ্গেল ভিউ
exports.getSingleSubService = async (req, res) => {
    try {
        const sub = await SubService.findById(req.params.id);
        res.status(200).json(sub);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// সাব-সার্ভিস আপডেট
exports.updateSubService = async (req, res) => {
    try {
        const { title, description } = req.body;
        let updateData = { title, description };
        if (req.file) updateData.image = req.file.path;

        await SubService.findByIdAndUpdate(req.params.id, updateData);
        res.status(200).json({ success: true, message: "Sub-service Updated!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};




exports.getOnlySubServices = async (req, res) => {
    try {
        // আপনার মডেলে ফিল্ডের নাম 'title', তাই এখানে 'title' সিলেক্ট করতে হবে
        const subServices = await SubService.find().select('title');
        
        // ফ্রন্টএন্ডে যেন ঝামেলা না হয়, তাই আমরা ম্যাপ করে পাঠাতে পারি
        const formattedData = subServices.map(item => ({
            _id: item._id,
            sub_service_title: item.title // ফ্রন্টএন্ড এই নামটা খুঁজছে
        }));

        res.status(200).json({ success: true, data: formattedData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};