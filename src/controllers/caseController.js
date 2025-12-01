import * as caseServices from "../services/caseServices.js";
import {
  sendCaseCreationNotification,
  sendCaseUpdateNotification,
} from "../utils/mailer.js";

export const getCases = async (req, res) => {
  try {
    const cases = await caseServices.getCases();
    res.status(200).json(cases);
  } catch (err) {
    console.error("Error fetching cases", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const caseId = req.params.case_id;
    const caseData = await caseServices.getCaseById(caseId);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json(caseData);
  } catch (err) {
    console.error("Error fetching case by ID", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCasesByUserId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const cases = await caseServices.getCasesByUserId(userId);
    res.status(200).json(cases);
  } catch (err) {
    console.error("Error fetching cases by user ID", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const countProcessingCases = async (req, res) => {
  try {
    const count = await caseServices.countProcessingCases();
    res.status(200).json({ count: parseInt(count, 10) });
  } catch (err) {
    console.error("Error counting processing cases", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const countProcessingCasesByUserId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const cases = await caseServices.getCasesByUserId(userId);
    const processingCount = cases.filter(
      (c) => c.case_status === "Processing"
    ).length;
    res.status(200).json({ count: processingCount });
  } catch (err) {
    console.error("Error counting processing cases by user ID", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const countArchivedCases = async (req, res) => {
  try {
    const count = await caseServices.countArchivedCases();
    res.status(200).json({ count: parseInt(count, 10) });
  } catch (err) {
    console.error("Error counting archived cases", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const countArchivedCasesByUserId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const cases = await caseServices.getCasesByUserId(userId);
    const archivedCount = cases.filter(
      (c) =>
        c.case_status === "Archived (Completed)" ||
        c.case_status === "Archived (Dismissed)"
    ).length;
    res.status(200).json({ count: archivedCount });
  } catch (err) {
    console.error("Error counting archived cases by user ID", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createCase = async (req, res) => {
  try {
    const caseData = req.body;
    const newCase = await caseServices.createCase(caseData);

    // let creator;
    // if (newCase.assigned_by) {
    //   creator = await caseServices.getUserById(newCase.assigned_by);
    // } else {
    //   creator = await caseServices.getUserById(newCase.user_id);
    // }

    // const cc_name = await caseServices.getCaseCategoryNameById(newCase.cc_id);
    // const ct_name = await caseServices.getCaseTypeNameById(newCase.ct_id);
    // const client_name = await caseServices.getClientNameById(
    //   caseData.client_id
    // );
    // const client_email = await caseServices.getClientEmailById(
    //   caseData.client_id
    // );
    // const admins = await caseServices.getAdmins();

    // // notifying all super lawyers or admins
    // admins.forEach((admin) => {
    //   sendCaseCreationNotification(
    //     admin.user_email,
    //     "New Case Created",
    //     `A new ${cc_name}: ${ct_name} (Case ID: ${
    //       newCase.case_id
    //     }) was created by ${creator.user_fname} ${
    //       creator.user_mname ? creator.user_mname : ""
    //     } ${creator.user_lname}.`
    //       .replace(/\s+/g, " ")
    //       .trim()
    //   );
    // });

    // // notifying the creator (lawyer or admin/super lawyer)
    // sendCaseCreationNotification(
    //   creator.user_email,
    //   "Case Created Successfully",
    //   `You have successfully created a new ${cc_name}: ${ct_name} of ${client_name}. \nRemarks: ${newCase.case_remarks}
    //   \n\nPlease check the Legal Vault for more details.`
    // );

    // // notifying the client
    // sendCaseCreationNotification(
    //   client_email,
    //   "Case Successfully Created with BOS' Legal Vault",
    //   `Hello ${client_name},\n\nYour case: ${ct_name} (${cc_name}), has been successfully added in our system. Please contact your lawyer for more details.`
    // );

    res.status(201).json(newCase);
  } catch (err) {
    console.error("Error creating case", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCase = async (req, res) => {
  try {
    const caseId = req.params.case_id;
    const caseData = req.body;

    const updatedCase = await caseServices.updateCase(caseId, caseData);

    const user = await caseServices.getUserById(updatedCase.user_id);
    const updatedBy = await caseServices.getUserById(caseData.last_updated_by); // the one who updated the case
    const cc_name = await caseServices.getCaseCategoryNameById(
      updatedCase.cc_id
    );
    const ct_name = await caseServices.getCaseTypeNameById(updatedCase.ct_id);
    const client_name = await caseServices.getClientNameById(
      caseData.client_id
    );
    const client_email = await caseServices.getClientEmailById(
      caseData.client_id
    );
    const admins = await caseServices.getAdmins();

    let lawyer_text = "No lawyer assigned yet";
    if (user) {
      lawyer_text = `Lawyer: ${user.user_fname} ${
        user.user_mname ? user.user_mname : ""
      } ${user.user_lname}`;
    }

    // // notifying all super lawyers or admins
    // admins.forEach((admin) => {
    //   sendCaseUpdateNotification(
    //     admin.user_email,
    //     "Case Update for Super Lawyer/Admin",
    //     `An update on ${cc_name}: ${ct_name} (Case ID: ${
    //       updatedCase.case_id
    //     }) was done by ${updatedBy.user_fname} ${
    //       updatedBy.user_mname ? updatedBy.user_mname : ""
    //     } ${updatedBy.user_lname}.\n${lawyer_text}.`
    //       .replace(/\s+/g, " ")
    //       .trim()
    //   );
    // });

    // // notifying the lawyer (lawyer or admin/super lawyer) only if there is a lawyer assigned
    // if (user) {
    //   sendCaseUpdateNotification(
    //     user.user_email,
    //     "Case Update for Lawyer",
    //     `A new update on your ${cc_name}: ${ct_name} of ${client_name}. \nRemarks: ${updatedCase.case_remarks}
    //   \n\nPlease check the Legal Vault for more details.`
    //   );
    // }

    // // notifying the client
    // sendCaseUpdateNotification(
    //   client_email,
    //   "Case Successfully Updated in the BOS' Legal Vault",
    //   `Hello ${client_name},\n\nYour ${cc_name}: ${ct_name} has been successfully updated in our system.\n\nTag: ${updatedCase.case_tag}\nRemarks: ${updatedCase.case_remarks} \n\nPlease contact your lawyer for more details.`
    // );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json(updatedCase);
  } catch (err) {
    console.error("Error updating case", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCase = async (req, res) => {
  try {
    const caseId = req.params.case_id;
    const deletedCase = await caseServices.deleteCase(caseId);

    if (!deletedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json({ message: "Case deleted successfully" });
  } catch (err) {
    console.error("Error deleting case", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchCases = async (req, res) => {
  try {
    const searchTerm = req.query.q || "";
    const cases = await caseServices.searchCases(searchTerm);
    res.status(200).json(cases);
  } catch (err) {
    console.error("Error searching cases", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Additional controllers for case categories and types

export const getCaseCategories = async (req, res) => {
  try {
    const categories = await caseServices.getCaseCategories();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching case categories", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCaseCategoryTypes = async (req, res) => {
  try {
    const types = await caseServices.getCaseCategoryTypes();
    res.status(200).json(types);
  } catch (err) {
    console.error("Error fetching case category types", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createCaseCategory = async (req, res) => {
  try {
    const { cc_name } = req.body;
    if (!cc_name || !cc_name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const created = await caseServices.createCaseCategory(cc_name.trim());
    res.status(201).json(created);
  } catch (err) {
    if (err.code === "ALREADY_EXISTS") {
      return res.status(409).json({ message: "Category already exists" });
    }
    console.error("Error creating case category", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createCaseType = async (req, res) => {
  try {
    const { ct_name, ct_fee, cc_id } = req.body;

    if (!ct_name || !ct_name.trim()) {
      return res.status(400).json({ message: "Type name is required" });
    }

    // Expect ct_fee as numbers from frontend
    if (!ct_fee || typeof ct_fee !== "object" || ct_fee.min == null || ct_fee.max == null) {
      return res.status(400).json({ message: "Fee range is required" });
    }

    const minFee = Number(ct_fee.min);
    const maxFee = Number(ct_fee.max);

    if (isNaN(minFee) || isNaN(maxFee)) {
      return res.status(400).json({ message: "Fee values must be numbers" });
    }

    // Format fee string for storage
    const formattedFee = `₱${minFee.toLocaleString("en-US")} - ₱${maxFee.toLocaleString("en-US")}`;

    // Save to DB as VARCHAR
    const created = await caseServices.createCaseType(
      ct_name.trim(),
      formattedFee,
      cc_id ?? null
    );

    res.status(201).json(created);

  } catch (err) {
    if (err.code === "ALREADY_EXISTS") {
      return res.status(409).json({ message: "Type already exists" });
    }
    console.error("Error creating case type", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// case access controller

export const shareCaseAccess = async (req, res) => {
  try {
    const caseId = req.params.case_id;
    const { allowed_viewers = [], updated_by } = req.body;

    // Permission check: only Admins or the assigned lawyer can edit access
    const currentUser = req.user || {};
    const record = await caseServices.getCaseById(caseId);
    if (!record) return res.status(404).json({ message: "Case not found" });
    const role = (currentUser.user_role || "").toLowerCase();
    const isOwner = Number(record.user_id) === Number(currentUser.user_id);
    const isAdmin = role === "admin";
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await caseServices.updateCaseAllowedViewers(
      caseId,
      allowed_viewers,
      updated_by ?? currentUser.user_id ?? null
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error sharing case access", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
