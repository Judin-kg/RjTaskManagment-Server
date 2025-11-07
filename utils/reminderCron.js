







 
// reminderCron.js

// const cron = require("node-cron");
// const Task = require("../models/Task");
// const axios = require("axios");

// // Run cron **only** if this instance is marked as the "primary" worker
// if (process.env.ENABLE_CRON === "true") {
//   cron.schedule("0 5 * * *", async () => {
//     console.log("🔔 Running Daily Task Reminder at 10:30 AM IST (0 5 UTC)...");
//     try {
//       const pendingTasks = await Task.find({ status: "pending" })
//         .populate("assignedTo", "name contactNumber");
//       if (!pendingTasks.length) {
//         console.log("✅ No pending tasks found.");
//         return;
//       }

//       for (const task of pendingTasks) {
//         const user = task.assignedTo;
//         if (!user || !user.contactNumber) continue;

//         const contactNumber = user.contactNumber.startsWith("91")
//           ? user.contactNumber
//           : `91${user.contactNumber}`;

//         const message = `⏰ *Daily Reminder*  
// 📝 Task: ${task.taskName}  
// 📅 Due: ${new Date(task.scheduledTime).toLocaleDateString()}  
// ⚠️ Status: Pending  
// \nPlease update your task in the portal.`;

//         await axios.post("https://waichat.com/api/send", {
//           number: contactNumber,
//           type: "text",
//           message,
//           instance_id: "68E0E2878A990",
//           access_token: "68de6bd371bd8",
//         });
//         console.log(`✅ Reminder sent to ${user.name}`);
//       }
//     } catch (err) {
//       console.error("❌ Cron Error:", err.message);
//     }
//   }, {
//     timezone: "UTC", // Ensure UTC timezone
//   });
// } 
// else {
//   console.log("⏭️ Skipping cron — ENABLE_CRON is not true");
// }









const cron = require("node-cron");
const Task = require("../models/Task");
const axios = require("axios");


// Run cron **only** if this instance is marked as the "primary" worker
  // Run every day at 9:30 AM
  cron.schedule("45 5 * * *", async () => {
    console.log("🔔 Running Daily Task Reminder at 11:15 PM IST...");
    try {
      const pendingTasks = await Task.find({ status: "pending" })
        .populate("assignedTo", "name contactNumber");
      
      if (!pendingTasks.length) {
        console.log("✅ No pending tasks found.");
        return;
      }

      console.log(`${pendingTasks.length} pending tasks found`);

      for (const task of pendingTasks) {
        const user = task.assignedTo;
        if (!user || !user.contactNumber) {
          console.log(`Skipping task '${task.taskName}' - no valid contact number`);
          continue;
        }

        const contactNumber = user.contactNumber.startsWith("91")
          ? user.contactNumber
          : `91${user.contactNumber}`;

        const message = `⏰ *Daily Reminder*  
📝 Task: ${task.taskName}  
📅 Due: ${new Date(task.scheduledTime).toLocaleDateString()}  
⚠️ Status: Pending  
\nPlease update your task in the portal.`;

        // Only send actual requests if we have valid credentials
        if ("68E0E2878A990" && "68de6bd371bd8") {
          try {
            await axios.post("https://waichat.com/api/send", {
              number: contactNumber,
              type: "text",
              message,
              instance_id: "68E0E2878A990",
               access_token: "68de6bd371bd8",
            });
            console.log(`✅ Reminder sent to ${user.name} (${contactNumber})`);
          } catch (sendError) {
            console.error(`❌ Failed to send reminder to ${user.name}:`, sendError.message);
          }
        } else {
          console.log(`ℹ️ Would send reminder to ${user.name} (${contactNumber}) but credentials missing`);
          console.log("Message content:", message);
        }
      }
      
      console.log("🔔 Daily Task Reminder job completed");
    } catch (err) {
      console.error("❌ Cron Error:", err.message);
      console.error("Stack trace:", err.stack);
    }
  }, {
    timezone: "UTC", // Schedule is set in UTC
  });
  
  console.log("⏱️ Daily reminder cron job scheduled for 9:18 PM IST (15:48 UTC)");













// const cron = require("node-cron");
// const Task = require("../models/Task");
// const axios = require("axios");

// // ⏰ Run Every Day at 7 AM
// cron.schedule(
//   "0 7 * * *",
//   async () => {
//     console.log("🔔 Running Daily Task Reminder...");

//     try {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0); // remove time

//       // Get Pending Tasks
//       const pendingTasks = await Task.find({ status: "pending" })
//         .populate("assignedTo", "name contactNumber");

//       if (!pendingTasks.length) {
//         console.log("✅ No pending tasks found.");
//         return;
//       }

//       // Send reminders
//       for (const task of pendingTasks) {
//         const taskDate = new Date(task.scheduledTime);
//         taskDate.setHours(0, 0, 0, 0);

//         // ✅ Send only if today is equal or after scheduled date
//         if (today < taskDate) {
//           console.log(`⏳ Reminder not started yet for ${task.taskName}`);
//           continue;
//         }

//         const user = task.assignedTo;
//         if (!user || !user.contactNumber) continue;

//         let contactNumber = user.contactNumber.startsWith("91")
//           ? user.contactNumber
//           : `91${user.contactNumber}`;

//         const message = `⏰ *Daily Task Reminder*  
// 📝 Task: ${task.taskName}  
// 📅 Due: ${new Date(task.scheduledTime).toLocaleDateString()}  
// ⚠️ Status: Pending  
  
// Please update your task in the portal.`;

//         try {
//           await axios.post("https://waichat.com/api/send", {
//             number: contactNumber,
//             type: "text",
//             message: message,
//             instance_id: "68E0E2878A990",
//             access_token: "68de6bd371bd8",
//           });
//           console.log(`✅ Reminder sent to ${user.name}`);
//         } catch (err) {
//           console.error("❌ WhatsApp reminder failed:", err.message);
//         }
//       }
//     } catch (err) {
//       console.error("❌ Cron Error:", err.message);
//     }
//   },
//   {
//     timezone: "Asia/Kolkata", // ✅ Proper timezone
//   }
// );








// const mongoose = require("mongoose");
// const Task = require("../models/Task");
// const axios = require("axios");
// require("dotenv").config();

// module.exports = async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   try {
//     console.log("🔔 Running Daily Task Reminder (Triggered by Vercel Cron)");

//     // MongoDB connection using .env MONGO_URI
//     if (!mongoose.connection.readyState) {
//       await mongoose.connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       });
//       console.log("✅ Connected to MongoDB");
//     }

//     const pendingTasks = await Task.find({ status: "pending" })
//       .populate("assignedTo", "name contactNumber");

//     if (!pendingTasks.length) {
//       console.log("✅ No pending tasks found.");
//       return res.status(200).json({ message: "No pending tasks." });
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
//         instance_id: "68E0E2878A990",
//         access_token: "68de6bd371bd8",
//       });

//       console.log(`✅ Reminder sent to ${user.name}`);
//     }

//     res.status(200).json({ message: "Reminders sent successfully!" });
//   } catch (err) {
//     console.error("❌ Error sending reminders:", err.message);
//     res.status(500).json({ error: err.message });
//   } finally {
//     // Close connection after execution (important for serverless)
//     if (mongoose.connection.readyState) {
//       await mongoose.connection.close();
//       console.log("🔒 MongoDB connection closed");
//     }
//   }
// };











