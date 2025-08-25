import * as paymentServices from "../services/paymentServices.js";

// Fetching All Payments
export const getPayments = async (req, res) => {
  try {
    const payments = await paymentServices.getPayments();
    res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching payments", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetching Payments of a specific Lawyer by lawyer_id
export const getPaymentsByLawyerId = async (req, res) => {
  const { lawyer_id } = req.params;
  try {
    const payments = await paymentServices.getPaymentsByLawyerId(lawyer_id);
    res.status(200).json(payments);
  } catch (err) {
    console.error(`Error fetching payments for lawyer_id ${lawyer_id}`, err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
