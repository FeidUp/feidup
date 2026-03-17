import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, businessType, message } = body;

    // Validate required fields
    if (!name || !email || !businessType || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Send email using Resend
    // Add email verification and sanitization as needed
    const { data, error } = await resend.emails.send({
      from: 'FeidUp Contact <info@feidup.com>',
      to: [process.env.CONTACT_EMAIL || 'info@feidup.com'],
      replyTo: email,
      subject: `New ${businessType} inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: hsl(0, 83%, 59%); border-bottom: 2px solid hsl(0, 83%, 59%); padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Business Type:</strong> ${businessType}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <p style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid hsl(0, 83%, 59%); white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    console.log("Email sent successfully:", data);

    return NextResponse.json(
      { message: "Form submitted successfully", emailId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to process form submission" },
      { status: 500 }
    );
  }
}
