import * as taskService from '../services/taskService.js';
import path from 'path';
import fs from 'fs';


export const getTask = async (req, res) => {
    try {
        const tasks = await taskService.getTask();
        res.status(200).json(tasks);
    } catch (err) {
        console.error("Error fetching tasks", err);
        res.status(500).json({message: "Internal server error"});
    }
}

export const createTask = async (req, res) => {
    try {
        const taskData = {
            ...req.body,
            td_doc_path: req.file ? `/uploads/${req.file.filename}`: null,
        }
        const newTask = await taskService.createTask(taskData);
        res.status(201).json(newTask);
    } catch (err) {
        console.error("Error creating task", err);
        res.status(500).json({message: "Failed to create task"});
    }
};
