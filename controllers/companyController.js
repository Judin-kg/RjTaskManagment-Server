const Company = require("../models/Company");

// Create a new company
exports.createCompany = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const company = new Company({ name });
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    console.error("Error creating company:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update company
// exports.updateCompany = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const company = await Company.findByIdAndUpdate(
//       req.params.id,
//       { name },
//       { new: true }
//     );
//     if (!company) return res.status(404).json({ message: "Company not found" });
//     res.json(company);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// PUT /api/companies/:id
exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(updatedCompany);
  } catch (err) {
    console.error("Error updating company:", err);
    res.status(500).json({ message: "Error updating company", error: err.message });
  }
};


// Delete company
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
