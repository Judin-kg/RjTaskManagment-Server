// /api/dailyReminder.js
import axios from "axios";
import Task from "../models/Task"; // adjust path as needed
import connectDB from "../config/db"; // your MongoDB connection file

export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();

    const pendingTasks = await Task.find({ status: "pending" })
      .populate("assignedTo", "name contactNumber");

    if (!pendingTasks.length) {
      console.log("✅ No pending tasks found.");
      return Response.json({ message: "No pending tasks" });
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
       instance_id: "68E0E2878A990", // ✅ Your Instance ID
       access_token: "68de6bd371bd8", // ✅ Your Access Token
      });

      console.log(`✅ Reminder sent to ${user.name}`);
    }

    return Response.json({ message: "Reminders sent" });
  } catch (err) {
    console.error("❌ Cron Error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
