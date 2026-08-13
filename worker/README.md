# TWOIN contact form Worker

Cloudflare Worker endpoint for the contact forms on `twoinstudio.com`.

## Deploy

1. Verify `mail.twoinstudio.com` in Resend.
2. In this directory, run `npx wrangler login`.
3. Run `npx wrangler secret put RESEND_API_KEY` and paste the key when prompted.
4. Run `npx wrangler deploy`.
5. Add the Worker custom domain `contact.twoinstudio.com` in Cloudflare.
6. Test `POST https://contact.twoinstudio.com/submit` before publishing the frontend changes.

Never commit the Resend API key or place it in frontend JavaScript.
