import mongoose, { Schema, Document } from "mongoose";
import fs from "node:fs";
import path from "node:path";

// Define TypeScript structure for Inquiry
export interface IInquiry {
  id: string; // Unified string ID
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  createdAt: string;
  status: "New" | "Pending" | "Completed";
}

// 1. MONGOOSE SCHEMA DEFINITION
const InquiryMongooseSchema = new Schema({
  fullName: { type: String, required: true },
  companyName: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, required: true },
  service: { type: String, default: "General Inquiry" },
  message: { type: String, default: "" },
  createdAt: { type: String, required: true },
  status: { type: String, enum: ["New", "Pending", "Completed"], default: "New" },
});

// Avoid re-compiling the model if it already exists
let InquiryModel: mongoose.Model<any>;
try {
  InquiryModel = mongoose.model("Inquiry");
} catch {
  InquiryModel = mongoose.model("Inquiry", InquiryMongooseSchema);
}

// 2. FILE DATABASE MANAGEMENT (FALLBACK MODE)
const LOCAL_DB_PATH = path.join(process.cwd(), "data", "db.json");

// Ensure data folder and db.json exist
function initLocalDb() {
  const dir = path.dirname(LOCAL_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify([], null, 2), "utf-8");
  }
}

function readLocalInquiries(): IInquiry[] {
  try {
    initLocalDb();
    const data = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading local DB:", err);
    return [];
  }
}

function writeLocalInquiries(inquiries: IInquiry[]) {
  try {
    initLocalDb();
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(inquiries, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to local DB:", err);
  }
}

// 3. UNIFIED STORAGE INTERFACE
function normalizeMongoUri(uri: string): string {
  if (!uri) return "";
  try {
    const prefix = uri.startsWith("mongodb+srv://") ? "mongodb+srv://" : uri.startsWith("mongodb://") ? "mongodb://" : "";
    if (!prefix) return uri;
    
    const remaining = uri.slice(prefix.length);
    const lastAtIndex = remaining.lastIndexOf("@");
    if (lastAtIndex === -1) return uri;
    
    const credentialsPart = remaining.slice(0, lastAtIndex);
    const hostPart = remaining.slice(lastAtIndex + 1);
    
    const firstColonIndex = credentialsPart.indexOf(":");
    if (firstColonIndex === -1) return uri;
    
    const username = credentialsPart.slice(0, firstColonIndex);
    const password = credentialsPart.slice(firstColonIndex + 1);
    
    let resolvedPassword = password;
    try {
      resolvedPassword = decodeURIComponent(password);
    } catch {
      // Keep as is if decode fails
    }
    
    const encodedPassword = encodeURIComponent(resolvedPassword);
    return prefix + username + ":" + encodedPassword + "@" + hostPart;
  } catch (err) {
    console.warn("⚠️ Normalization warning mapping MONGODB_URI:", err);
    return uri;
  }
}

function isValidMongoUri(uri: string): boolean {
  if (!uri || uri.trim() === "") return false;
  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    return false;
  }
  const lower = uri.toLowerCase();
  if (
    lower.includes("<username>") ||
    lower.includes("<password>") ||
    lower.includes("<your") ||
    lower.includes("your_") ||
    lower.includes("your-") ||
    lower.includes("yourhostname") ||
    lower.includes("insert_your_")
  ) {
    return false;
  }
  try {
    const normalized = normalizeMongoUri(uri);
    const urlString = normalized.replace(/^mongodb\+srv:\/\//, "http://").replace(/^mongodb:\/\//, "http://");
    const parsed = new URL(urlString);
    if (!parsed.hostname) {
      return false;
    }
  } catch {
    return false;
  }
  return true;
}

class StorageEngine {
  private useMongo = false;
  private connectionPromise: Promise<any> | null = null;

  constructor() {
    const rawUri = process.env.MONGODB_URI;
    const uri = rawUri ? normalizeMongoUri(rawUri) : "";
    
    // Listen to background mongoose connection errors safely to avoid console alert spamming
    mongoose.connection.on("error", (err) => {
      console.warn("⚠️ Background Mongoose connection event error:", err.message);
    });

    if (uri && uri.trim() !== "" && isValidMongoUri(rawUri || "")) {
      this.useMongo = true;
      console.log("====================================================");
      console.log("🔗 Database Engine: Valid MONGODB_URI detected. Initializing Connection...");
      console.log("====================================================");
      mongoose
        .connect(uri, {
          serverSelectionTimeoutMS: 3000,
          connectTimeoutMS: 3000,
        })
        .then(() => {
          console.log("✅ Success: Mongoose connected to MongoDB server.");
        })
        .catch(async (err) => {
          console.error("❌ Error: Failed to connect to MongoDB server:", err.message);
          this.useMongo = false;
          try {
            await mongoose.disconnect();
          } catch {
            // Ignore disconnect failures during fallback teardown
          }
          console.log("⚠️ Fallback: Starting storage engine in local JSON file mode.");
          initLocalDb();
        });
    } else {
      console.log("====================================================");
      console.log("📂 Database Engine: Running in Local Fallback mode.");
      if (uri && uri.trim() !== "") {
        console.log("⚠️ Reason: Provided MONGODB_URI has invalid syntax or placeholder tokens.");
      }
      console.log(`📂 Storage Location: ${LOCAL_DB_PATH}`);
      console.log("ℹ️ Provide a valid 'MONGODB_URI' in .env to connect to a live MongoDB cluster.");
      console.log("====================================================");
      initLocalDb();
    }
  }

  // Serverless reconnection helper
  async ensureConnected() {
    if (!this.useMongo) return;
    if (mongoose.connection.readyState >= 1) return; // 1 = connected, 2 = connecting

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    const rawUri = process.env.MONGODB_URI;
    const uri = rawUri ? normalizeMongoUri(rawUri) : "";
    if (uri && uri.trim() !== "" && isValidMongoUri(rawUri || "")) {
      console.log("🔗 [Mongoose] Serverless Trigger: Dynamic database connection establishing...");
      this.connectionPromise = mongoose
        .connect(uri, {
          serverSelectionTimeoutMS: 4000,
          connectTimeoutMS: 4000,
        })
        .then(() => {
          this.connectionPromise = null;
          console.log("✅ [Mongoose] Dynamic Database Connection established.");
        })
        .catch((err) => {
          this.connectionPromise = null;
          console.error("❌ [Mongoose] Dynamic Database Connection failed:", err.message);
          throw err;
        });
      return this.connectionPromise;
    }
  }

  // Save a new inquiry
  async saveInquiry(data: Partial<IInquiry>): Promise<IInquiry> {
    await this.ensureConnected();

    const record: Omit<IInquiry, "id"> & { id?: string } = {
      fullName: data.fullName || "Anonymous",
      companyName: data.companyName || "",
      phone: data.phone || "",
      email: data.email || "",
      service: data.service || "General Inquiry",
      message: data.message || "",
      createdAt: new Date().toISOString(),
      status: "New",
    };

    if (this.useMongo) {
      const doc = await InquiryModel.create(record);
      return {
        id: doc._id.toString(),
        fullName: doc.fullName,
        companyName: doc.companyName,
        phone: doc.phone,
        email: doc.email,
        service: doc.service,
        message: doc.message,
        createdAt: doc.createdAt,
        status: doc.status as "New" | "Pending" | "Completed",
      };
    } else {
      const id = "INQ-" + Math.floor(100000 + Math.random() * 900000);
      const unifiedRecord: IInquiry = { ...record, id };
      const list = readLocalInquiries();
      list.unshift(unifiedRecord);
      writeLocalInquiries(list);
      return unifiedRecord;
    }
  }

  // Retrieve inquiries
  async listInquiries(): Promise<IInquiry[]> {
    await this.ensureConnected();

    if (this.useMongo) {
      const docs = await InquiryModel.find().sort({ _id: -1 });
      return docs.map((doc) => ({
        id: doc._id.toString(),
        fullName: doc.fullName,
        companyName: doc.companyName,
        phone: doc.phone,
        email: doc.email,
        service: doc.service,
        message: doc.message,
        createdAt: doc.createdAt,
        status: doc.status as "New" | "Pending" | "Completed",
      }));
    } else {
      return readLocalInquiries();
    }
  }

  // Update status
  async updateStatus(id: string, status: "New" | "Pending" | "Completed"): Promise<IInquiry | null> {
    await this.ensureConnected();

    if (this.useMongo) {
      const doc = await InquiryModel.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
      );
      if (!doc) return null;
      return {
        id: doc._id.toString(),
        fullName: doc.fullName,
        companyName: doc.companyName,
        phone: doc.phone,
        email: doc.email,
        service: doc.service,
        message: doc.message,
        createdAt: doc.createdAt,
        status: doc.status as "New" | "Pending" | "Completed",
      };
    } else {
      const list = readLocalInquiries();
      const index = list.findIndex((x) => x.id === id);
      if (index === -1) return null;
      list[index].status = status;
      writeLocalInquiries(list);
      return list[index];
    }
  }

  // Delete inquiry
  async deleteInquiry(id: string): Promise<boolean> {
    await this.ensureConnected();

    if (this.useMongo) {
      const res = await InquiryModel.findByIdAndDelete(id);
      return res !== null;
    } else {
      const list = readLocalInquiries();
      const initialLength = list.length;
      const updatedList = list.filter((x) => x.id !== id);
      if (updatedList.length === initialLength) {
        return false;
      }
      writeLocalInquiries(updatedList);
      return true;
    }
  }
}

export const dbService = new StorageEngine();
