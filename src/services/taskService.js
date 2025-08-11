import { query } from "../db.js";

// Fetch all Tasks
export const getTask = async () => {
    const { rows } = await query("SELECT * FROM task_document_tbl ORDER BY td_id");
    return rows;
};

export const createTask = async (taskData) => {
    const {
        td_case_id,
        td_name, 
        td_description, 
        td_due_date, 
        td_priority,
        td_doc_path,
        td_to,
        td_by,
        td_status,
        td_date_completed,
    } = taskData;

    const { rows } = await query(
        'INSERT INTO task_document_tbl (td_case_id, td_name, td_description, td_due_date, td_priority, td_doc_path, td_to, td_by, td_status, td_date_completed,) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [        
            td_case_id,
            td_name, 
            td_description, 
            td_due_date, 
            td_priority,
            td_doc_path,
            td_to,
            td_by,
            td_status,
            td_date_completed,
        ]
    );

    return rows[0];
};

