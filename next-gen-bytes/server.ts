import express from "express";
import path from "path";
import crypto from "node:crypto";
import { dbService } from "./server/db.js";
import { sendInquiryEmails } from "./server/mailer.js";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable JSON parser and URL encoder
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Cryptographic Signer & Verifier using Native Node Crypto
const JWT_SECRET = process.env.JWT_SECRET || "nextgen-bytes-internal-secret-token-key-2026-secure";

function signToken(email: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      email,
      role: "admin",
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24-hours expiration
    })
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${signature}`;
}

function verifyToken(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest("base64url");
    if (signature !== expectedSignature) return null;

    const decodedPayload = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (decodedPayload.exp < Date.now()) {
      console.log("Token expired validation");
      return null;
    }
    return decodedPayload;
  } catch (err) {
    return null;
  }
}

// Security Middleware to verify JWT administrator session
function requireAdmin(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"] || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access Denied: Missing session bearer token" });
  }
  const token = authHeader.substring(7); // Remove 'Bearer '
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(403).json({ error: "Access Denied: Authentication session expired or invalid" });
  }
  req.admin = payload;
  next();
}

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Submit Inquiry endpoint (CCTV installation, Active directory support, custom structured cabling, etc.)
app.post("/api/inquiries", async (req, res) => {
  try {
    const { fullName, companyName, phone, email, service, message } = req.body;

    // Direct input validation
    if (!fullName || !email) {
      return res.status(400).json({ error: "Validation Error: Customer Name and Email are strictly required fields." });
    }

    // Save inquiry to active Database Engine (MongoDB or Fallback Local Database)
    const savedInquiry = await dbService.saveInquiry({
      fullName,
      companyName,
      phone,
      email,
      service,
      message,
    });

    // Send customer auto-reply & administrator notifications via Nodemailer
    try {
      await sendInquiryEmails({
        fullName: savedInquiry.fullName,
        companyName: savedInquiry.companyName,
        phone: savedInquiry.phone,
        email: savedInquiry.email,
        service: savedInquiry.service,
        message: savedInquiry.message,
        createdAt: savedInquiry.createdAt,
      });
    } catch (mailError) {
      console.error("Delayed Notification Dispatch Error:", mailError);
    }

    return res.status(201).json({
      success: true,
      message: "Lead inquiry dispatched and registered into the system successfully.",
      inquiry: savedInquiry,
    });
  } catch (error: any) {
    console.error("Critical submission server error:", error);
    return res.status(500).json({ error: "Internal Server Error: Failed to archive submitted customer inquiry." });
  }
});

// 2. Admin Authentication (Login endpoint)
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email Address and Password are required fields." });
  }

  // Load configured admin credentials from environment or fall back to standard defaults
  const allowedEmail = process.env.ADMIN_EMAIL || "admin@nextgenbytes.com";
  const allowedPassword = process.env.ADMIN_PASSWORD || "admin-password-123";

  if (
    email.toLowerCase() === allowedEmail.toLowerCase() &&
    password === allowedPassword
  ) {
    // Generate valid secure JWT session
    const token = signToken(email);
    console.log(`🔑 Success: Authenticated administrative access for profile ${email}`);
    return res.json({
      success: true,
      token,
      admin: {
        email,
        role: "admin",
      },
    });
  } else {
    return res.status(401).json({ error: "Access Denied: Invalid email address or secure entry password." });
  }
});

// 3. Admin: Retrieve all Inquiries (Auth Protected)
app.get("/api/admin/inquiries", requireAdmin, async (req, res) => {
  try {
    const list = await dbService.listInquiries();
    return res.json({ success: true, inquiries: list });
  } catch (error) {
    console.error("Error retrieving inquiries:", error);
    return res.status(500).json({ error: "Internal Server Error: Failed to list database inquiries." });
  }
});

// 4. Admin: Update Inquiry Status (Auth Protected)
app.patch("/api/admin/inquiries/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["New", "Pending", "Completed"].includes(status)) {
      return res.status(400).json({ error: "Validation Error: status field must be New, Pending, or Completed." });
    }

    const updated = await dbService.updateStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: "Error: Inquiry ID record not found to change status update." });
    }

    console.log(`🔄 Updated Status of inquiry ${id} to [${status}]`);
    return res.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return res.status(500).json({ error: "Internal Server Error: Failed to update inquiry state." });
  }
});

// 5. Admin: Delete Inquiry Record (Auth Protected)
app.delete("/api/admin/inquiries/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dbService.deleteInquiry(id);
    if (!deleted) {
      return res.status(404).json({ error: "Error: Inquiry ID record not found to execute deletion." });
    }

    console.log(`🗑️ Deleted Inquiry Record: ${id}`);
    return res.json({ success: true, message: "Inquiry record deleted from active archive." });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return res.status(500).json({ error: "Internal Server Error: Failed to remove inquiry." });
  }
});

// ==========================================
// STATIC FRONTEND ROUTING & VITE MIDDLEWARE
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Environment: Create Vite Server to support real-time frontend bundling
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("🛠️ Vite Server mounted over active development server.");
  } else {
    // Production Environment: Serve static built files from dist compilation output
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`📦 Serving production build from asset directory: ${distPath}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("====================================================");
    console.log(`🌐 System Booted Address: http://localhost:${PORT}`);
    console.log(`📡 Ingress Port bound exclusively to default port ${PORT}`);
    console.log("====================================================");
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
