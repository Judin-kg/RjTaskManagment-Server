const Staff = require("./models/User");

async function seedAdmin() {
  try {
    const exists = await Staff.findOne({ email: process.env.ADMIN_EMAIL || "rj@example.com" });
    console.log(exists,"existssssss");
    if (exists) {
      console.log("⚠️ Admin already exists, skipping seeding");
      return;
    }

     const admin = new Staff({
      username: "superadmin",  // 👈 required field
      email: process.env.ADMIN_EMAIL || "rj@example.com",
      password: process.env.ADMIN_PASS || "securepassword123",
     });

    console.log(admin,"adminnnnnnnn");

    await admin.save();
    console.log("✅ Admin user created successfully!");
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
  }
}

module.exports = seedAdmin;
