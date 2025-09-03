import * as userService from "../services/userServices.js";
import path from "path";
import fs from "fs";

// Fetching All Users
export const getUsers = async (req, res) => {
  try {
    const user = await userService.getUsers();
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching users", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Adding a user
export const createUser = async (req, res) => {
  try {
    const userData = {
      ...req.body,
      user_profile: req.file ? `/uploads/${req.file.filename}` : null,
    };

    const newUser = await userService.createUser(userData);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error adding user", err);
    res.status(500).json({ message: "Failed to create user" });
  }
};

// Updating a user
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.user_id;

    const userData = { ...req.body };
    if (req.file) {
      userData.user_profile = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await userService.updateUser(userId, userData);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user", err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Deleting a user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.user_id;

    // Optional: Delete the profile image from disk
    const user = await userService.getUserById(userId);
    if (user?.user_profile) {
      const filePath = path.join("D:/Capstone_ni_Angelie", user.user_profile);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.warn("⚠️ Could not delete image file:", err.message);
        }
      });
    }

    const deletedUser = await userService.deleteUser(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).send("User deleted successfully");
  } catch (err) {
    console.error("Error deleting user", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// Search for users
export const searchUsers = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const users = await userService.searchUsers(searchTerm);
    res.status(200).json(users);
  } catch (err) {
    console.error("Error searching users", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// -------------------- CONTROLLER FOR USER LOGS

// Fetching User Logs for Admin
export const getUserLogs = async (req, res) => {
  try {
    const logs = await userService.getUserLogs();
    res.status(200).json(logs);
  } catch (err) {
    console.error("Error fetching user logs", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetching User Logs for a Specific User
export const getUserLogsById = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const logs = await userService.getUserLogsById(userId);
    res.status(200).json(logs);
  } catch (err) {
    console.error("Error fetching user logs by ID", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// -------------------- CONTROLLER FOR LAWYERS' CASE SPECIALTIES 

export const getLawyersByCaseCategoryTypes = async (req, res) => {
  try {
    const lawyers = await userService.getLawyersByCaseCategoryTypes();
    res.status(200).json(lawyers);
  } catch (err) {
    console.error("Error fetching lawyers by case category types", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


