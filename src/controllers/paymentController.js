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

// Fetching Payments of a specific Case by case_id
export const getPaymentsByCaseId = async (req, res) => {
  const { case_id } = req.params;
  try {
    const payments = await paymentServices.getPaymentsByCaseId(case_id);
    res.status(200).json(payments);
  } catch (err) {
    console.error(`Error fetching payments for case_id ${case_id}`, err);
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

// Adding a New Payment
export const addPayment = async (req, res) => {
  const paymentData = req.body;
  try {
    const newPayment = await paymentServices.addPayment(paymentData);
    res.status(201).json(newPayment);
  } catch (err) {
    console.error("Error adding payment", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Deleting a Payment by payment_id
export const deletePayment = async (req, res) => {
  const { payment_id } = req.params;
  try {
    const deletedPayment = await paymentServices.deletePayment(payment_id);
    if (deletedPayment) {
      res.status(200).json(deletedPayment);
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (err) {
    console.error(`Error deleting payment with id ${payment_id}`, err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
