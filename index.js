const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");
const seedAdmin = require('./seedAdmin'); 


// 👈 import
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// app.use(cors());

// ✅ Secure CORS Configuration
const allowedOrigins = [
  "https://rjaltas-task-managment.vercel.app", // your frontend hosted on Vercel
  "http://localhost:3000",                     // for local testing
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`❌ Blocked CORS request from: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json()); // To parse JSON bodies
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 // serve images
// DB Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb+srv://rjatlasdigitalai:1qaz2wsx@cluster0.sxanvzr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('✅ MongoDB connected');

    // 👇 Seed admin once DB is ready
    await seedAdmin();
    // await seedManager(); // 👈 Seed manager once DB is ready
  })
  
  // .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const managerRoutes = require("./routes/managerRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const assistantManagerRoutes = require("./routes/assistantManagerRoutes");
const companyRoutes = require("./routes/companyRoutes");


const taskRoutes = require("./routes/taskRoutes");
// const staffRoutes = require("./routes/staffRoutes");

// ✅ Add Cron Import Here
//  require("./utils/reminderCron");  // <<<<<<<<<<<<<<<<<<< ADDED

// app.use("/api/staff", staffRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/tasks", taskRoutes);

app.use("/api/assistant-managers", assistantManagerRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/managers", managerRoutes);
// const adminRoutes = require('./routes/adminRoutes');
// const productRoutes = require("./routes/productRoutes");
// const categoryRoutes = require("./routes/categoryRoutes");
// const smithRoutes = require("./routes/smithRoutes");
// const subCategoryRoutes = require("./routes/subcategoryRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");
// const cartRoutes = require("./routes/cartRoutes");

// app.use("/api/cart", cartRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/smiths", smithRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
// app.use('/api/admin', adminRoutes);
// app.use("/api/subcategories", subCategoryRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Error Handling (Optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

