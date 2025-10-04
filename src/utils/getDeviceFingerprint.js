import crypto from "crypto";

// helper to generate a consistent device token
export function getDeviceFingerprint(req) {
  const userAgent = req.headers["user-agent"] || "unknown";
  const ip = req.ip || "unknown";
  return crypto.createHash("sha256").update(userAgent + ip).digest("hex");
}

