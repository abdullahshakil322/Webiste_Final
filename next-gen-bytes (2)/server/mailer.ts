import nodemailer from "nodemailer";

// Define TypeScript structure of inquiry details for mailing
interface MailParams {
  fullName: string;
  companyName?: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  createdAt: string;
}

export async function sendInquiryEmails(params: MailParams) {
  const { fullName, companyName, phone, email, service, message, createdAt } = params;

  // 1. Check if SMTP configuration is set
  let host = (process.env.SMTP_HOST || "").trim();
  
  // Normalize common email server domain name typos
  const lowerHost = host.toLowerCase();
  if (lowerHost === "smtp.gmail" || lowerHost === "gmail") {
    host = "smtp.gmail.com";
  } else if (lowerHost === "smtp.mailgun" || lowerHost === "mailgun") {
    host = "smtp.mailgun.org";
  } else if (lowerHost === "smtp.office365") {
    host = "smtp.office365.com";
  } else if (lowerHost === "smtp.outlook") {
    host = "smtp.outlook.com";
  } else if (lowerHost === "smtp.yahoo" || lowerHost === "yahoo") {
    host = "smtp.mail.yahoo.com";
  } else if (lowerHost.endsWith("smtp.gmail")) {
    host = host + ".com";
  }

  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const from = process.env.SMTP_FROM || "Next Gen Bytes <no-reply@nextgenbytes.com.pk>";
  const adminEmail = "abdullahshakil322@gmail.com";

  const isConfigured = user.trim() !== "" && pass.trim() !== "";

  // 2. Prepare customer auto-reply email templates
  const customerSubject = "Thank you for contacting Next Gen Bytes";
  const customerHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <div style="background-color: #0f172a; padding: 15px; border-radius: 6px; text-align: center; margin-bottom: 20px;">
        <h2 style="color: #38bdf8; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">NEXT GEN BYTES</h2>
        <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 11px; font-family: monospace;">IT SERVICES & SECURITY SOLUTIONS</p>
      </div>
      <p style="font-size: 16px; color: #1e293b; line-height: 1.5;">Dear <strong>${fullName}</strong>,</p>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        Thank you for contacting <strong>Next Gen Bytes</strong>. We have received your request successfully.
      </p>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">Our dedicated support team will review your requirements and reach back to you shortly.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #f1f5f9;">
        <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 14px; text-transform: uppercase;">Inquiry Details Recieved:</h4>
        <p style="margin: 4px 0; font-size: 13px; color: #475569;">👤 <strong>Name:</strong> ${fullName}</p>
        ${companyName ? `<p style="margin: 4px 0; font-size: 13px; color: #475569;">🏢 <strong>Company:</strong> ${companyName}</p>` : ""}
        <p style="margin: 4px 0; font-size: 13px; color: #475569;">⚙️ <strong>Requested Service:</strong> ${service}</p>
        <p style="margin: 4px 0; font-size: 13px; color: #475569;">✉️ <strong>Email Address:</strong> ${email}</p>
        <p style="margin: 4px 0; font-size: 13px; color: #475569;">📞 <strong>Phone Number:</strong> ${phone || "Not provided"}</p>
      </div>

      <p style="font-size: 13px; color: #64748b; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 15px;">
        This is an automated server confirmation email. Please do not reply directly to this notification.
        If you have urgent inquiries, please call us directly at <strong>0331-2558324</strong> or <strong>0333-5412666</strong>.
      </p>
    </div>
  `;

  const customerText = `
Thank you for contacting Next Gen Bytes.
We have received your request successfully.
Our team will contact you shortly.

---
Summary of Submission:
Name: ${fullName}
Company: ${companyName || "N/A"}
Service: ${service}
Phone: ${phone || "N/A"}
Message: ${message}
`;

  // 3. Prepare administrative alert email templates
  const adminSubject = `🚨 New Next Gen Bytes Inquiry from ${fullName}`;
  const adminHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; border-radius: 8px;">
      <div style="background-color: #ef4444; padding: 12px; border-radius: 6px; text-align: center; margin-bottom: 20px; color: white;">
        <h3 style="margin: 0; font-size: 18px; font-weight: bold; letter-spacing: 0.5px;">🚨 ADMIN NOTIFICATION: NEW INQUIRY</h3>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; font-weight: bold; width: 150px; color: #0f172a;">Customer Name:</td>
          <td style="padding: 10px 0;">${fullName}</td>
        </tr>
         <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">Company:</td>
          <td style="padding: 10px 0;">${companyName || "Private / Indivdual"}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">Phone Number:</td>
          <td style="padding: 10px 0;"><a href="tel:${phone}" style="color: #0284c7; text-decoration: none;">${phone}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">Email Address:</td>
          <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">Service Required:</td>
          <td style="padding: 10px 0; font-weight: bold; color: #0369a1;">${service}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">Date & Time:</td>
          <td style="padding: 10px 0; font-family: monospace;">${new Date(createdAt).toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; color: #0f172a; vertical-align: top;">Customer Message:</td>
          <td style="padding: 10px 0; background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; font-style: italic;">
            ${message.replace(/\n/g, "<br/>")}
          </td>
        </tr>
      </table>

      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; text-align: center;">
        <p style="font-size: 12px; color: #64748b; margin: 0;">
          Next Gen Bytes Automated Dispatcher • Running on Cloud Server
        </p>
      </div>
    </div>
  `;

  const adminText = `
🚨 ADMIN NOTIFICATION: NEW INQUIRY RECEIVED

Customer Details:
- Name: ${fullName}
- Company: ${companyName || "Private"}
- Phone: ${phone}
- Email: ${email}
- Service Required: ${service}
- Date & Time: ${new Date(createdAt).toLocaleString()}

Message:
${message}
`;

  if (isConfigured) {
    try {
      // 4. Create Nodemailer Transport
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // Use SSL/TLS for port 465
        auth: {
          user,
          pass,
        },
      });

      // 5. Send both emails in parallel
      await Promise.all([
        // Auto-reply to customer
        transporter.sendMail({
          from,
          to: email,
          subject: customerSubject,
          html: customerHtml,
          text: customerText,
        }),
        // Alert notification to admin
        transporter.sendMail({
          from,
          to: adminEmail,
          subject: adminSubject,
          html: adminHtml,
          text: adminText,
        }),
      ]);

      console.log(`✉️ Success: Nodemailer dispatched customer auto-reply & admin notification (${fullName})`);
      return { success: true, simulated: false };
    } catch (err: any) {
      console.error("❌ Nodemailer failed to send email alerts:", err.message || err);
      // Fallback response instead of throwing a hard error to the UI
      return { success: false, simulated: true, error: err.message || "Unknown SMTP Error" };
    }
  } else {
    // 6. Simulation Mode
    console.log("====================================================");
    console.log("📫 nodemaler EMAIL SIMULATION:");
    console.log(`To Customer (${email}):`);
    console.log(`Subject: ${customerSubject}`);
    console.log(`Body: ${customerText.trim()}`);
    console.log("----------------------------------------------------");
    console.log(`To Admin (${adminEmail}):`);
    console.log(`Subject: ${adminSubject}`);
    console.log(`Body: ${adminText.trim()}`);
    console.log("====================================================");
    return { success: true, simulated: true };
  }
}
