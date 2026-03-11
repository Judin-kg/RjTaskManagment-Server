const Task = require("../models/Task");

const axios = require("axios"); 
// const Task = require("../models/Task");
const Staff = require("../models/User");

// const nodemailer = require("nodemailer");



exports.createTask = async (req, res) => {
  try {
    const {
      taskName,
      description,
      scheduledTime,
      role,
      assignedTo,
      assignedBy,
      status,
      repeat,
      company,
    } = req.body;

    if (!assignedBy) {
      return res.status(400).json({ error: "assignedBy is required" });
    }
    if (!company || !company.id || !company.name) {
      return res.status(400).json({ error: "company id and name are required" });
    }

    // ✅ Check for duplicate task
    const existingTask = await Task.findOne({
      taskName,
      assignedTo,
      scheduledTime,
      role,
    });

    if (existingTask) {
      return res.status(409).json({
        error: "Task already exists with the same name, assigned user, and schedule.",
        existingTask,
      });
    }

    console.log(req.body, "📥 Incoming Task Payload");

    // ✅ Create Task
    const task = new Task({
      taskName,
      description,
      scheduledTime,
      role,
      assignedTo,
      assignedBy,
      company: { id: company.id, name: company.name },
      status: status || "pending",
      repeat: repeat || "once",
    });
    await task.save();
    console.log(task, "✅ Task Createddddddddd");
     // ✅ Populate references
    const populatedTask = await task.populate([
      { path: "assignedTo", select: "name email contactNumber" },
      { path: "assignedBy", select: "name email" },
    ]);

    console.log(populatedTask, "✅ Task Created & Populateddddddddd");

    // ✅ Fetch assigned user
    const user = await Staff.findById(assignedTo).select("name email contactNumber");

    console.log(user, "👤 Assigned User Details");

    
    

    if (!user) {
      console.warn("⚠️ Assigned user not found, skipping notifications.");
    } else {
     

     // ✅ WhatsApp Notification via Waichat
try {
  const waichatUrl = "https://waichat.com/api/send";

  // Add country code for India
  let contactNumber = user.contactNumber;
  if (!contactNumber.startsWith("91")) {
    contactNumber = `91${contactNumber}`;
  }

  const waichatPayload = {
    number: contactNumber, // ✅ With country code
    type: "text",
    message: `📌 New Task Assigned!\n\n📝 Task: ${taskName}\n📄 Description: ${
      description || "No description"
    }\n📅 Scheduled: ${new Date(scheduledTime).toLocaleString()}\n⚡ Status: ${
      status || "pending"
    }\n🏢 Company: ${company.name}\n\n🔗 View Task: https://rjatlasai-taskanagement.vercel.app\n\nPlease check your dashboard.`,
    instance_id: "68E0E2878A990", // ✅ Your Instance ID
    access_token: "68de6bd371bd8", // ✅ Your Access Token
  };

  const response = await axios.post(waichatUrl, waichatPayload, {
    headers: { "Content-Type": "application/json" },
  });

  console.log("✅ WhatsApp message sent:", response.data);
} catch (waErr) {
  console.error("❌ Failed to send WhatsApp message:", waErr.response?.data || waErr.message);
}

    }

    res.status(201).json(populatedTask);
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
};



// exports.createTask = async (req, res) => {
//   try {
//     const { taskName, description, scheduledTime, role, assignedTo, assignedBy, status,repeat, company } = req.body;

//     if (!assignedBy) {
//       return res.status(400).json({ error: "assignedBy is required" });
//     }
//    if (!company || !company.id || !company.name) {
//       return res.status(400).json({ error: "company id and name are required" });
//     }

//  // ✅ 1. Check if a similar task already exists
//     const existingTask = await Task.findOne({
//       taskName,
//       assignedTo,
//       scheduledTime,
//       role,
      
//     });

//     if (existingTask) {
//       return res.status(409).json({
//         error: "Task already exists with the same name, assigned user, and schedule.",
//         existingTask,
//       });
//     }
//     console.log(req.body, "📥 Incoming Task Payloaddddddddddddddd");

//     // ✅ 1. Create Task
//     const task = new Task({
//       taskName,
//       description,
//       scheduledTime,
//       role,
//       assignedTo,
//       assignedBy,
//        company: { id: company.id, name: company.name }, // ✅ Save both id + name
      
//       status: status || "pending",
//       repeat: repeat || "once",

//     });

//     await task.save();

//     // ✅ 2. Populate assignedTo & assignedBy
//     const populatedTask = await task.populate([
//       { path: "assignedTo", select: "name email contactNumber" },
//       { path: "assignedBy", select: "name email" },
     
//     ]);

//     console.log(populatedTask, "✅ Task Created & Populated");
//      console.log(populatedTask, "✅ Task Created & Populated");

//     // ✅ Convert populatedTask to a plain object
//     const taskResponse = populatedTask.toObject();

//     // ✅ Replace `company` object with just company name
//     // taskResponse.company = populatedTask.company?.name || null;

//     // ✅ Send email notification if user exists

//     // ✅ 3. Fetch assigned user email
//     const user = await Staff.findById(assignedTo).select("name email");
//     console.log(user, "👤 Assigned User Detailsssss");
    
//     if (!user) {
//       console.warn("⚠️ Assigned user not found, skipping email.");
//     } else {
//       // ✅ 4. Send email notification
//       try {
//         const transporter = nodemailer.createTransport({
//           service: "gmail",
//           auth: {
//             user: process.env.SMTP_EMAIL,
//             pass: process.env.SMTP_PASSWORD,
//           },
//         });

//         const mailOptions = {
//           from: process.env.SMTP_EMAIL,
//           to: user.email,
//           subject: `New Task Assigned: ${taskName}`,
//           html: `
//             <h2>Hello ${user.name},</h2>
//             <p>You have been assigned a new task.</p>
//             <p><strong>Task:</strong> ${taskName}</p>
//             <p><strong>Description:</strong> ${description || "No description"}</p>
//             <p><strong>Scheduled:</strong> ${new Date(scheduledTime).toLocaleString()}</p>
//             <p><strong>Status:</strong> ${status || "pending"}</p>
//             <br>
//             <p>Login to your dashboard to view details.</p>
//           `,
//         };

//         await transporter.sendMail(mailOptions);
//         console.log(`📧 Email sent to ${user.email}`);
//       } catch (emailErr) {
//         console.error("❌ Failed to send email:", emailErr);
//       }
//     }

//     res.status(201).json(populatedTask);
//   } catch (err) {
//     console.error("❌ Error creating task:", err);
//     res.status(500).json({ error: "Failed to create task" });
//   }
// };

// 📊 Task Reports





exports.getTaskReports = async (req, res) => {
  try {
    // Get task counts grouped by status
    const statusCounts = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Get task counts grouped by repeat type
    const repeatCounts = await Task.aggregate([
      { $group: { _id: "$repeat", count: { $sum: 1 } } }
    ]);

    // Get task counts grouped by company
   

    // Get total tasks
    const totalTasks = await Task.countDocuments();

    res.status(200).json({
      success: true,
      totalTasks,
      statusCounts,
      repeatCounts,
      
    });
  } catch (err) {
    console.error("❌ Error fetching task reports:", err);
    res.status(500).json({ error: "Failed to fetch task reports" });
  }
};




// Get all tasks with assignedTo, assignedBy, and company name
// exports.getTasks = async (req, res) => {
//   try {
//     // Fetch all tasks and populate references
//     const tasks = await Task.find()
//       .populate({ path: "assignedTo", select: "name email" })
//       .populate({ path: "assignedBy", select: "name email" })
//       .populate({ path: "company", select: "name" })
//       .sort({ createdAt: -1 }); // optional: latest first

//       console.log(tasks,"tasksssssssssssssssssssssssssssgetalll");
//     // Transform tasks: replace company object with company name
//     const transformedTasks = tasks.map(task => {
//       const t = task.toObject();
//       t.company = task.company?.name || null;
//       return t;
//     });

//     console.log (transformedTasks, "✅ Transformed Tasks with Company Names");

//     res.status(200).json({
//       success: true,
//       totalTasks: transformedTasks.length,
//       tasks: transformedTasks,
//     });
//   } catch (err) {
//     console.error("❌ Error fetching tasks:", err);
//     res.status(500).json({ error: "Failed to fetch tasks" });
//   }
// };


// ✅ Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    // console.log(tasks,"tasksssssssssssssssssssssssssssgetalll");
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get single task
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "name email");
   
    
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update task
// exports.updateTask = async (req, res) => {
//   try {
//     const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!task) return res.status(404).json({ error: "Task not found" });
//     res.json(task);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// ✅ Update task (with status change notification)







// exports.updateTask = async (req, res) => {
//   try {
//     const { status } = req.body;
//      console.log(req.body,"updatetaskttttttttttttttttttttttttttttttt");
     
//     // Find task first
//     const task = await Task.findById(req.params.id).populate(
//       "assignedTo",
//       "name email contactNumber"
//     );
//    console.log(task,"taskkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
   

//     if (!task) return res.status(404).json({ error: "Task not found" });

//     const oldStatus = task.status;

//     // Update task fields
//     task.set(req.body);
//     await task.save();

//     // ✅ If status is updated, send WhatsApp notification
//     if (status && status !== oldStatus && task.assignedTo?.contactNumber) {
//       try {
//         const waichatUrl = "https://waichat.com/api/send";

//         // Add country code (India: 91)
//         let contactNumber = task.assignedTo.contactNumber;
//         if (!contactNumber.startsWith("91")) {
//           contactNumber = `91${contactNumber}`;
//         }

//         const waichatPayload = {
//           number: contactNumber,
//           type: "text",
//           message: `⚡ Task Status Updated!\n\n📝 Task: ${
//             task.taskName
//           }\n📅 Updated At: ${new Date().toLocaleString()}\n✅ New Status: ${status}\n\nPlease check your dashboard for details.`,
//           instance_id: "68E0E2878A990", // ✅ Your Instance ID
//           access_token: "68de6bd371bd8", // ✅ Your Access Token
//         };

//         const response = await axios.post(waichatUrl, waichatPayload, {
//           headers: { "Content-Type": "application/json" },
//         });

//         console.log("✅ WhatsApp status update sent:", response.data);
//       } catch (waErr) {
//         console.error(
//           "❌ Failed to send WhatsApp status update:",
//           waErr.response?.data || waErr.message
//         );
//       }
//     }

//     res.json(task);
//   } catch (err) {
//     console.error("Error updating task:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

exports.updateTask = async (req, res) => {
  try {
    const {
      taskName,
      description,
      scheduledTime,
      role,
      assignedTo,
      assignedBy,
      status,
      repeat,
      company,
    } = req.body;

    console.log(req.body, "📥 Incoming Task Update Payloaddddd");

    // ✅ Find existing task
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email contactNumber"
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
console.log(task,"taskttttttttttttttttttttttttttttttttttttttttttttttt");

    const oldStatus = task.status;
    const oldTaskName = task.taskName;
    const oldDescription = task.description;
    const oldRole = task.role;
    const oldAssignedTo = task.assignedTo;
    const oldRepeat = task.repeat;
   console.log(oldStatus,"oldstatussssssssssssssssssssssssssssssssssssssssss");
   
    // ✅ Update task fields
    task.taskName = taskName || task.taskName;
    task.description = description || task.description;
    task.scheduledTime = scheduledTime || task.scheduledTime;
    task.role = role || task.role;
    task.assignedTo = assignedTo || task.assignedTo;
    task.assignedBy = assignedBy || task.assignedBy;
    task.status = status || task.status;
    task.repeat = repeat || task.repeat;
    if (company && company.id && company.name) {
      task.company = { id: company.id, name: company.name };
    }

    await task.save();

    // ✅ Populate references again
    const updatedTask = await task.populate([
      { path: "assignedTo", select: "name email contactNumber" },
      { path: "assignedBy", select: "name email" },
    ]);


    console.log(updatedTask,"✅ Task updated successfullyyyyyyyyyyyyy:");

    // ✅ If assignedTo is changed or new, fetch user details
    const user = await Staff.findById(task.assignedTo).select("name email contactNumber");
   console.log(user,"userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");

   console.log(status,"statussssssssssssssssssssssssssssssssssssss");
   
    
    
    if (!user) {
      console.warn("⚠️ Assigned user not found — skipping WhatsApp notification.");
    } else {
      // ✅ Send WhatsApp notification if status changed
      if ( status !== oldStatus ||
  taskName !== oldTaskName ||
  description !== oldDescription ||
  role !== oldRole ||
  String(assignedTo) !== String(oldAssignedTo?._id) ||
  repeat !== oldRepeat) {
        try {
          const waichatUrl = "https://waichat.com/api/send";

          let contactNumber = user.contactNumber;
          if (!contactNumber.startsWith("91")) {
            contactNumber = `91${contactNumber}`;
          }

          const waichatPayload = {
            number: contactNumber,
            type: "text",
            message: `⚡ Task Updated!\n\n📝 Task: ${taskName}\n📄 Description: ${
              description || "No description"
            }\n📅 Scheduled: ${new Date(scheduledTime).toLocaleString()}\n✅ Status: ${
              status || "pending"
            }\n📄 repeat: ${
              repeat || "once"
            }   \n🏢 Company: ${
              company?.name || task.company?.name
            }\n\n🔗 View Task: https://rjatlasai-taskanagement.vercel.app\n\nPlease check your dashboard for details.`,
            instance_id: "68E0E2878A990", // ✅ Your Instance ID
            access_token: "68de6bd371bd8", // ✅ Your Access Token
          };

          const response = await axios.post(waichatUrl, waichatPayload, {
            headers: { "Content-Type": "application/json" },
          });

          console.log("✅ WhatsApp message sent for updated task:", response.data);
        } catch (waErr) {
          console.error(
            "❌ Failed to send WhatsApp update:",
            waErr.response?.data || waErr.message
          );
        }
      }
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("❌ Error updating task:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
};

// ✅ Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getTasksByUser = async (req, res) => {
  const {userId} = req.params;

  console.log("Fetching tasks for userIdddddddddd:",);
  

  try {
    const tasks = await Task.find({ assignedTo:userId})
      .populate("assignedTo", "name email")
       
      .sort({ createdAt: -1 });

    if (!tasks.length) {
      return res.status(200).json({ message: "No tasks assigned", tasks: [] });
    }
console.log(tasks,"taskssssssssssssssssssssssssssuserrrr");

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching user tasks:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 📊 Task Reports Controller
exports.getTaskReports = async (req, res) => {
  try {
    console.log("📊 Fetching task reports...");

    // 1️⃣ Aggregate tasks grouped by status
    const statusAggregation = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // 2️⃣ Aggregate tasks grouped by repeat type
    const repeatAggregation = await Task.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$repeat", "once"] }, // replace null with "once"
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }
    ]);

    // 3️⃣ Aggregate tasks grouped by user (assignedTo)
    // const userAggregation = await Task.aggregate([
    //   {
    //     $group: {
    //       _id: "$assignedTo",
    //       count: { $sum: 1 },
    //     },
    //   },
    //   { $sort: { count: -1 } },
    //   { $limit: 5 } // get top 5 users with most tasks
    // ]);
     const userAggregation = await Task.aggregate([
      {
        $group: {
          _id: "$assignedTo", // group by user ID
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "staffs", // 👈 must match the collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          name: { $ifNull: ["$userDetails.name", "Unknown"] },
        },
      },
    ]);


    // 4️⃣ Get total tasks
    const totalTasks = await Task.countDocuments();

    // ✅ Convert arrays into key-value objects
    const formatResult = (arr) =>
      arr.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

    res.status(200).json({
      success: true,
      totalTasks,
      statusCounts: formatResult(statusAggregation),
      repeatCounts: formatResult(repeatAggregation),
      topUsers: userAggregation, // frontend can use this for a leaderboard
    });

    console.log("✅ Task reports fetched successfully!");
  } catch (err) {
    console.error("❌ Error fetching task reports:", err);
    res.status(500).json({ error: "Failed to fetch task reports" });
  }
};
// PUT /api/tasks/:id
// exports.updateTask = async (req, res) => {
//   try {
//     const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!updated) return res.status(404).json({ message: "Task not found" });
//     res.status(200).json(updated);
//   } catch (err) {
//     console.error("Error updating task:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// 📊 Staff Performance Report
// exports.getStaffPerformance = async (req, res) => {

//   console.log(req.res,"reqqqqqqqqqqqqqqqqqqq");
  
//   try {
//     const workingDays = 30;

//     const performance = await Task.aggregate([
//       {
//         $group: {
//           _id: "$assignedTo",
//           totalTasks: { $sum: 1 },
//           completedTasks: {
//             $sum: {
//               $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
//             },
//           },
//         },
//       },
//       {
//         $lookup: {
//           from: "staffs", // collection name
//           localField: "_id",
//           foreignField: "_id",
//           as: "staff",
//         },
//       },
//       {
//         $unwind: {
//           path: "$staff",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $project: {
//           staffId: "$_id",
//           name: "$staff.name",
//           email: "$staff.email",
//           totalTasks: 1,
//           completedTasks: 1,
//           performance: {
//             $multiply: [
//               { $divide: ["$totalTasks", workingDays] },
//               100,
//             ],
//           },
//         },
//       },
//       {
//         $sort: { performance: -1 },
//       },
//     ]);


// console.log(performance,"perfomanceeeeeeeeeeeeeeeeeee");


//     res.json({
//       success: true,
//       workingDays,
//       data: performance,
//     });
//   } catch (err) {
//     console.error("❌ Staff performance error:", err);
//     res.status(500).json({ error: "Failed to fetch staff performance" });
//   }
// };



















exports.getStaffPerformance = async (req, res) => {

  try {

    // ✅ Get current month total days
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const totalWorkingDays = new Date(year, month + 1, 0).getDate();

    const performance = await Task.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "staffs",
          localField: "_id",
          foreignField: "_id",
          as: "staff",
        },
      },
      {
        $unwind: {
          path: "$staff",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          staffId: "$_id",
          name: { $ifNull: ["$staff.name", "Unknown Staff"] },
          email: { $ifNull: ["$staff.email", "No Email"] },
          totalTasks: 1,
          completedTasks: 1,

          // ✅ performance based on real days
          performance: {
            $multiply: [
              { $divide: ["$totalTasks", totalWorkingDays] },
              100,
            ],
          },
        },
      },
      {
        $sort: { performance: -1 },
      },
    ]);

    console.log(performance, "performance");

    res.json({
      success: true,
      workingDays: totalWorkingDays,
      data: performance,
    });

  } catch (err) {
    console.error("❌ Staff performance error:", err);
    res.status(500).json({ error: "Failed to fetch staff performance" });
  }
};






// 📊 Monthly Staff Performance
exports.getMonthlyStaffPerformance = async (req, res) => {
  try {
    const workingDays = 30;

    const performance = await Task.aggregate([
      {
        $addFields: {
          month: { $month: "$scheduledTime" },
          year: { $year: "$scheduledTime" },
        },
      },
      {
        $group: {
          _id: {
            staff: "$assignedTo",
            month: "$month",
            year: "$year",
          },
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "staffs",
          localField: "_id.staff",
          foreignField: "_id",
          as: "staffDetails",
        },
      },
      {
        $unwind: {
          path: "$staffDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          staffId: "$_id.staff",
          name: "$staffDetails.name",
          month: "$_id.month",
          year: "$_id.year",
          totalTasks: 1,
          completedTasks: 1,
          performance: {
            $multiply: [{ $divide: ["$totalTasks", workingDays] }, 100],
          },
        },
      },
      {
        $sort: { year: -1, month: -1 },
      },
    ]);

    res.json({
      success: true,
      data: performance,
    });
  } catch (err) {
    console.error("Monthly performance error:", err);
    res.status(500).json({ error: "Failed to fetch monthly performance" });
  }
};