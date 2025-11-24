import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, businessType, message } = body;

    // TODO: Implement your email service here
    // Options:
    // 1. EmailJS: https://www.emailjs.com/
    // 2. Formspree: https://formspree.io/
    // 3. Resend: https://resend.com/
    // 4. SendGrid, Mailgun, etc.

    // Example with Resend (recommended):
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'FeidUp Contact <onboarding@resend.dev>',
      to: ['your-email@example.com'],
      subject: `New ${businessType} inquiry from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Business Type:</strong> ${businessType}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });
    */

    // For now, just log the submission (REPLACE THIS WITH ACTUAL EMAIL SERVICE)
    console.log("Contact form submission:", {
      name,
      email,
      businessType,
      message,
      timestamp: new Date().toISOString(),
    });

    // Simulate success
    return NextResponse.json(
      { message: "Form submitted successfully" },
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
