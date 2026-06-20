import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const FROM = 'Winning With The Hunt <onboarding@resend.dev>';

export async function sendNewUserNotification({
  email,
  username,
  signedUpAt,
}: {
  email: string;
  username: string;
  signedUpAt: string;
}) {
  if (!ADMIN_EMAIL) return;
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New user signed up — ${username}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="margin: 0 0 16px;">New user on Winning With The Hunt</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Username</td>
            <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">@${username}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Email</td>
            <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Signed up</td>
            <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${new Date(signedUpAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
          </tr>
        </table>
      </div>
    `,
  });
}
