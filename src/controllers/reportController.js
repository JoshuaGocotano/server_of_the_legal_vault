import * as reportService from "../services/reportServices.js";

export const getLastWeekCounts = async (req, res) => {
  try {
    const data = await reportService.getLastWeekCounts();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching last week counts:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMonthlyCounts = async (req, res) => {
  try {
    const data = await reportService.getMonthlyCounts();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching monthly counts:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCaseCounts = async (req, res) => {
  try {
    const counts = await reportService.getCaseCounts();
    res.status(200).json(counts);
  } catch (err) {
    console.error("Error fetching case counts:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
