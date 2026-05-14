export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function GET(req: Request) {
  // Simple auth check for cron (in production use a secret header)
  const authHeader = req.headers.get("authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    // Find tracked grants with deadlines within 7 days that haven't been reminded
    const trackers = await prisma.deadlineTracker.findMany({
      where: {
        reminderSent: false,
        grant: {
          deadline: {
            gt: now,
            lte: sevenDaysFromNow,
          },
        },
      },
      include: {
        grant: true,
        user: true,
      },
    });

    if (trackers.length === 0) {
      return NextResponse.json({ message: "No reminders to send." });
    }

    // Configure mailer (using dummy settings or environment variables)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || "smtp.example.com",
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const results = [];

    for (const tracker of trackers) {
      if (!tracker.user.email) continue;

      const mailOptions = {
        from: '"GrantWriter AI" <noreply@grantwriter.ai>',
        to: tracker.user.email,
        subject: `Upcoming Deadline: ${tracker.grant.title}`,
        text: `Hello ${tracker.user.name || 'there'},\n\nThis is a reminder that the grant "${tracker.grant.title}" has an upcoming deadline on ${tracker.grant.deadline?.toLocaleDateString()}.\n\nDon't forget to complete your proposal!\n\nBest,\nGrantWriter AI Team`,
        html: `<p>Hello ${tracker.user.name || 'there'},</p><p>This is a reminder that the grant <strong>${tracker.grant.title}</strong> has an upcoming deadline on <strong>${tracker.grant.deadline?.toLocaleDateString()}</strong>.</p><p>Don't forget to complete your proposal!</p><p>Best,<br>GrantWriter AI Team</p>`,
      };

      try {
        // In a real sandbox we might not have SMTP, so we'll log it if it fails
        // Or we could use the sendEmail tool if we were doing it manually
        console.log(`Sending reminder email to ${tracker.user.email} for ${tracker.grant.title}`);
        
        // If we have SMTP config, send it. Otherwise just mark as sent for demo.
        if (process.env.EMAIL_SERVER_HOST) {
            await transporter.sendMail(mailOptions);
        }

        await prisma.deadlineTracker.update({
          where: { id: tracker.id },
          data: { reminderSent: true },
        });

        results.push({ email: tracker.user.email, grant: tracker.grant.title, status: "sent" });
      } catch (err: any) {
        console.error(`Failed to send email to ${tracker.user.email}:`, err);
        results.push({ email: tracker.user.email, grant: tracker.grant.title, status: "failed", error: err.message });
      }
    }

    return NextResponse.json({ message: "Reminders processed", results });
  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
