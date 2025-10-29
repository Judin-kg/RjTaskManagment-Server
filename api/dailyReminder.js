// /api/dailyReminder.js
// import axios from "axios";
// import Task from "@/models/Task"; // adjust path as needed
// import connectDB from "@/lib/connectDB"; // your MongoDB connection file

// export const revalidate = 0;

// export async function GET() {
//   try {
//     await connectDB();

//     const pendingTasks = await Task.find({ status: "pending" })
//       .populate("assignedTo", "name contactNumber");

//     if (!pendingTasks.length) {
//       console.log("✅ No pending tasks found.");
//       return Response.json({ message: "No pending tasks" });
//     }

//     for (const task of pendingTasks) {
//       const user = task.assignedTo;
//       if (!user || !user.contactNumber) continue;

//       const contactNumber = user.contactNumber.startsWith("91")
//         ? user.contactNumber
//         : `91${user.contactNumber}`;

//       const message = `⏰ *Daily Reminder*  
// 📝 Task: ${task.taskName}  
// 📅 Due: ${new Date(task.scheduledTime).toLocaleDateString()}  
// ⚠️ Status: Pending  
// \nPlease update your task in the portal.`;

//       await axios.post("https://waichat.com/api/send", {
//         number: contactNumber,
//         type: "text",
//         message,
//          instance_id: "68E0E2878A990", // ✅ Your Instance ID
//          access_token: "68de6bd371bd8", // ✅ Your Access Token
//       });

//       console.log(`✅ Reminder sent to ${user.name}`);
//     }

//     return Response.json({ message: "Reminders sent" });
//   } catch (err) {
//     console.error("❌ Cron Error:", err.message);
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }



const mongoose = require("mongoose");
const Task = require("../models/Task");

const axios = require("axios");
require("dotenv").config();

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    console.log("🔔 Running Daily Task Reminder (Triggered by Vercel Cron)");

    // MongoDB connection using .env MONGO_URI
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ Connected to MongoDB");
    }

    const pendingTasks = await Task.find({ status: "pending" })
      .populate("assignedTo", "name contactNumber");
console.log(pendingTasks,"pendinggg");

    if (!pendingTasks.length) {
      console.log("✅ No pending tasks found.");
      return res.status(200).json({ message: "No pending tasks." });
    }

    for (const task of pendingTasks) {
      const user = task.assignedTo;
      if (!user || !user.contactNumber) continue;

      const contactNumber = user.contactNumber.startsWith("91")
        ? user.contactNumber
        : `91${user.contactNumber}`;

      const message = `⏰ *Daily Reminder*  
📝 Task: ${task.taskName}  
📅 Due: ${new Date(task.scheduledTime).toLocaleDateString()}  
⚠️ Status: Pending  
\nPlease update your task in the portal.`;

      await axios.post("https://waichat.com/api/send", {
        number: contactNumber,
        type: "text",
        message,
        instance_id: "68E0E2878A990",
        access_token: "68de6bd371bd8",
      });

      console.log(`✅ Reminder sent to ${user.name}`);
    }

    res.status(200).json({ message: "Reminders sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending reminders:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    // Close connection after execution (important for serverless)
    if (mongoose.connection.readyState) {
      await mongoose.connection.close();
      console.log("🔒 MongoDB connection closed");
    }
  }
};
