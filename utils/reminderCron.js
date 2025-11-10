







 







// const cron = require("node-cron");
// const Task = require("../models/Task");
// const axios = require("axios");


// // Run cron **only** if this instance is marked as the "primary" worker
//   // Run every day at 9:30 AM
//   cron.schedule("0 5 * * *", async () => {
//     console.log("🔔 Running Daily Task Reminder at 10:00 AM IST...");
//     try {
//       const pendingTasks = await Task.find({ status: "pending" })
//         .populate("assignedTo", "name contactNumber");
      
//       if (!pendingTasks.length) {
//         console.log("✅ No pending tasks found.");
//         return;
//       }

//       console.log(`${pendingTasks.length} pending tasks found`);

//       for (const task of pendingTasks) {
//         const user = task.assignedTo;
//         if (!user || !user.contactNumber) {
//           console.log(`Skipping task '${task.taskName}' - no valid contact number`);
//           continue;
//         }

//         const contactNumber = user.contactNumber.startsWith("91")
//           ? user.contactNumber
//           : `91${user.contactNumber}`;

//         const message = `⏰ *Daily Reminder*  
// 📝 Task: ${task.taskName}  
// 📅 Due: ${new Date(task.scheduledTime).toLocaleDateString()}  
// ⚠️ Status: Pending  
// \nPlease update your task in the portal.`;

//         // Only send actual requests if we have valid credentials
//         if ("68E0E2878A990" && "68de6bd371bd8") {
//           try {
//             await axios.post("https://waichat.com/api/send", {
//               number: contactNumber,
//               type: "text",
//               message,
//               instance_id: "68E0E2878A990",
//                access_token: "68de6bd371bd8",
//             });
//             console.log(`✅ Reminder sent to ${user.name} (${contactNumber})`);
//           } catch (sendError) {
//             console.error(`❌ Failed to send reminder to ${user.name}:`, sendError.message);
//           }
//         } else {
//           console.log(`ℹ️ Would send reminder to ${user.name} (${contactNumber}) but credentials missing`);
//           console.log("Message content:", message);
//         }
//       }
      
//       console.log("🔔 Daily Task Reminder job completed");
//     } catch (err) {
//       console.error("❌ Cron Error:", err.message);
//       console.error("Stack trace:", err.stack);
//     }
//   }, {
//     timezone: "UTC", // Schedule is set in UTC
//   });
  
//   console.log("⏱️ Daily reminder cron job scheduled for 9:18 PM IST (15:48 UTC)");






const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const axios = require("axios");

router.get("/runCron", async (req, res) => {
  try {
    console.log("🔔 Cron triggered at", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));

    const pendingTasks = await Task.find({ status: "pending" })
      .populate("assignedTo", "name contactNumber");

    if (!pendingTasks.length) {
      console.log("✅ No pending tasks found.");
      return res.status(200).send("No pending tasks found.");
    }

    for (const task of pendingTasks) {
      const user = task.assignedTo;
      if (!user?.contactNumber) continue;

      const contactNumber = user.contactNumber.startsWith("91")
        ? user.contactNumber
        : `91${user.contactNumber}`;

      const message = `⏰ *Daily Reminder*\n📝 Task: ${task.taskName}\n📅 Due: ${new Date(task.scheduledTime).toLocaleDateString()}\n⚠️ Status: Pending\n\nPlease update your task in the portal.`;

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
        console.error(`❌ Failed to send to ${user.name} (${contactNumber}):`, sendError.message);
      }
    }

    res.status(200).send("✅ Daily reminders sent successfully.");
  } catch (err) {
    console.error("❌ Cron error:", err.message);
    res.status(500).send("❌ Failed to run cron.");
  }
});

module.exports = router;



















