import { query } from "../db.js";

export const getLastWeekCounts = async () => {
  const sql = `
    SELECT 
      TO_CHAR(case_last_updated, 'Day') AS day_name,
      case_status,
      COUNT(*) AS count
    FROM case_tbl
    WHERE case_status IN ('Completed', 'Dismissed', 'Archived (Completed)', 'Archived (Dismissed)')
      AND case_last_updated >= NOW() - INTERVAL '7 days'
    GROUP BY 1, 2
    ORDER BY MIN(case_last_updated);
  `;

  const { rows } = await query(sql);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const formatKey = (day) => day.trim().toLowerCase();

  const completed = Object.fromEntries(days.map((d) => [formatKey(d), 0]));
  const dismissed = Object.fromEntries(days.map((d) => [formatKey(d), 0]));

  for (const row of rows) {
    const key = formatKey(row.day_name);
    if (row.case_status === "Completed") completed[key] = Number(row.count);
    else if (row.case_status === "Dismissed")
      dismissed[key] = Number(row.count);
    else if (row.case_status === "Archived (Completed)")
      completed[key] += Number(row.count);
    else if (row.case_status === "Archived (Dismissed)")
      dismissed[key] += Number(row.count);
  }

  return { completed, dismissed };
};

export const getMonthlyCounts = async () => {
  const sql = `
    SELECT 
      TO_CHAR(case_last_updated, 'FMMonth') AS month_name,
      EXTRACT(MONTH FROM case_last_updated) AS month_number,
      case_status,
      COUNT(*) AS count
    FROM case_tbl
    WHERE case_status IN ('Completed', 'Dismissed', 'Archived (Completed)', 'Archived (Dismissed)')
      AND EXTRACT(YEAR FROM case_last_updated) = EXTRACT(YEAR FROM CURRENT_DATE)
    GROUP BY 1, 2, 3
    ORDER BY month_number ASC;
  `;

  const { rows } = await query(sql);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formatKey = (m) => m.trim().toLowerCase();

  const completed = Object.fromEntries(months.map((m) => [formatKey(m), 0]));
  const dismissed = Object.fromEntries(months.map((m) => [formatKey(m), 0]));

  for (const row of rows) {
    const key = formatKey(row.month_name);
    const count = Number(row.count);

    if (["Completed", "Archived (Completed)"].includes(row.case_status))
      completed[key] += count;
    else if (["Dismissed", "Archived (Dismissed)"].includes(row.case_status))
      dismissed[key] += count;
  }

  return { completed, dismissed };
};

// counts for completed, dismissed, archived completed, archived dismissed
export const getCaseCounts = async () => {
  const sql = `
    SELECT 
      CASE 
        WHEN case_status ILIKE 'Archived (Completed)' THEN 'archived_completed'
        WHEN case_status ILIKE 'Archived (Dismissed)' THEN 'archived_dismissed'
        WHEN case_status ILIKE 'Completed' THEN 'completed'
        WHEN case_status ILIKE 'Dismissed' THEN 'dismissed'
        ELSE 'other'
      END AS category,
      COUNT(*) AS count
    FROM case_tbl
    WHERE case_status IN (
      'Completed', 
      'Dismissed', 
      'Archived (Completed)', 
      'Archived (Dismissed)'
    )
    GROUP BY category;
  `;

  const { rows } = await query(sql);

  // Default structure
  const counts = {
    completed: 0,
    dismissed: 0,
    archivedCompleted: 0,
    archivedDismissed: 0,
  };

  for (const row of rows) {
    if (row.category === "completed") counts.completed = Number(row.count);
    else if (row.category === "dismissed") counts.dismissed = Number(row.count);
    else if (row.category === "archived_completed") counts.archivedCompleted = Number(row.count);
    else if (row.category === "archived_dismissed") counts.archivedDismissed = Number(row.count);
  }

  return counts;
};