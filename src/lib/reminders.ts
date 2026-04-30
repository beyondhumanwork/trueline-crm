import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Send a reminder email for a specific session */
export async function sendReminder(
  clientEmail: string,
  clientName: string,
  sessionDate: Date,
  location: string | null
): Promise<void> {
  const formattedDate = sessionDate.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const locationLine = location ? `Location: ${location}\n` : "";

  await resend.emails.send({
    from: "TrueLine CRM <onboarding@resend.dev>",
    to: [clientEmail],
    subject: `Reminder: Upcoming Session on ${formattedDate}`,
    text: `Hi ${clientName},\n\nThis is a reminder that you have a session scheduled:\n\nDate: ${formattedDate}\n${locationLine}Please arrive 5 minutes early.\n\nSee you soon,\nTrueLine CRM`,
  });
}
