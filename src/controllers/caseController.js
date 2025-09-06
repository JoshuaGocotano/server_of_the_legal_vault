import { useState } from "react";
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

export const createCase = async (req, res) => {
  try {
    const caseData = req.body;
    const newCase = await caseServices.createCase(caseData);

    const [creator, setCreator] = useState();
    if (newCase.assigned_by) {
      const creator = await caseServices.getUserById(newCase.assigned_by);
      setCreator(creator);
    } else {
      const creator = await caseServices.getUserById(newCase.user_id);
      setCreator(creator);
    }

    const cc_name = await caseServices.getCaseCategoryNameById(newCase.cc_id);
    const ct_name = await caseServices.getCaseTypeNameById(newCase.ct_id);
    const client_name = await caseServices.getClientNameById(
      caseData.client_id
    );
    const client_email = await caseServices.getClientEmailById(
      caseData.client_id
    );
    const admins = await caseServices.getAdmins();

    // notifying all super lawyers or admins
    admins.forEach((admin) => {
      sendCaseCreationNotification(
        admin.user_email,
        "New Case Created",
        `A new ${cc_name}: ${ct_name} (Case ID: ${
          newCase.case_id
        }) was created by ${creator.user_fname} ${
          creator.user_mname ? creator.user_mname : ""
        } ${creator.user_lname}.`
          .replace(/\s+/g, " ")
          .trim()
      );
    });

    // notifying the creator (lawyer or admin/super lawyer)
    sendCaseCreationNotification(
      creator.user_email,
      "Case Created Successfully",
      `You have successfully created a new ${cc_name}: ${ct_name} of ${client_name}. \nRemarks: ${newCase.case_remarks}
      \n\nPlease check the Legal Vault for more details.`
    );

    // notifying the client
    sendCaseCreationNotification(
      client_email,
      "Case Successfully Created with BOS' Legal Vault",
      `Hello ${client_name},\n\nYour case: ${ct_name} (${cc_name}), has been successfully added in our system. Please contact your lawyer for more details.`
    );

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

    // notifying all super lawyers or admins
    admins.forEach((admin) => {
      sendCaseUpdateNotification(
        admin.user_email,
        "Case Update",
        `An update on ${cc_name}: ${ct_name} (Case ID: ${
          updatedCase.case_id
        }) \nLawyer: ${user.user_fname} ${
          user.user_mname ? user.user_mname : ""
        } ${user.user_lname}.`
          .replace(/\s+/g, " ")
          .trim()
      );
    });

    // notifying the one who updated (lawyer or admin/super lawyer)
    sendCaseUpdateNotification(
      user.user_email,
      "Case Update",
      `A new update on your ${cc_name}: ${ct_name} of ${client_name}. \nRemarks: ${updatedCase.case_remarks}
      \n\nPlease check the Legal Vault for more details.`
    );

    // notifying the client
    sendCaseUpdateNotification(
      client_email,
      "Case Successfully Updated in the BOS' Legal Vault",
      `Hello ${client_name},\nYour ${ct_name}: ${cc_name} (Case ID: ${updatedCase.case_id}) has been successfully updated in our system. Please contact your lawyer for more details.`
    );

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
