import 'server-only';
import nodemailer from 'nodemailer';
import { buildSurpriseEmail, surpriseInbox, type SurpriseNotification } from './surprise-email';

export async function sendSurpriseNotification(requestId: string, data: SurpriseNotification): Promise<'accepted' | 'not_configured' | 'failed'> {
  const password = process.env.SURPRISE_SMTP_PASSWORD;
  const user = process.env.SURPRISE_SMTP_USER?.trim() || surpriseInbox;
  const port = Number(process.env.SURPRISE_SMTP_PORT || '465');
  if (!password || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user) || ![465, 587].includes(port)) {
    console.error('Surprise notification: SMTP configuration missing or invalid; request remains saved.');
    return 'not_configured';
  }
  const transport = nodemailer.createTransport({
    host: 'smtp.ionos.de', port, secure: port === 465, requireTLS: true,
    auth: { user, pass: password }, tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
    logger: false, debug: false, disableFileAccess: true, disableUrlAccess: true,
  });
  try {
    const message = buildSurpriseEmail(requestId, data);
    const result = await transport.sendMail({ ...message, from: { name: 'LÜDIGO Surprise', address: user } });
    if (!result.accepted?.some(address => String(address).toLowerCase() === surpriseInbox)) throw new Error('Recipient not accepted');
    return 'accepted';
  } catch {
    // Never log the SMTP error object: it can contain credentials or customer data.
    console.error('Surprise notification: delivery attempt failed; request remains saved.');
    return 'failed';
  } finally { transport.close(); }
}
