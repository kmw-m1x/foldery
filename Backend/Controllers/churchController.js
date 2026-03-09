// D:\Foldery\Backend\controllers\churchController.js

exports.getMissions = (req, res) => {
    // อันนี้เหมือนเดิม หรือจะแก้ตามใจชอบ
    const missions = [
        { id: 1, lat: 20.0269, lng: 99.8723, title: "คริสตจักรแม่สาย", members: 450, status: "Active" },
        { id: 2, lat: 13.8415, lng: 100.5801, title: "คริสตจักรบางเขน", members: 3500, status: "Mega" },
        { id: 3, lat: 18.812, lng: 99.0154, title: "คริสตจักรเชียงใหม่", members: 1200, status: "Expanding" }
    ];
    res.status(200).json(missions);
};

// 👇👇 แก้ตรงนี้ใหม่หมด 👇👇
exports.getDashboardStats = (req, res) => {
    const stats = {
        hearers: "50,200",       // ผู้ได้ยิน
        targetAreas: "15",       // พื้นที่เป้าหมาย
        decisions: "3,450",      // ผู้ตัดสินใจเชื่อ
        baptized: "890",         // ผู้รับบัพติสมา
        disciples: "450",        // จำนวนสาวก
        houseChurches: "24"      // จำนวนคริสตจักรบ้าน
    };
    res.status(200).json(stats);
};