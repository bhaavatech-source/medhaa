# medhaa
"Medhaa – Bhāva Tech's educational gaming platform for cognitive and emotional development" helps anyone (or future you) instantly understand the repo's purpose.

## Web sign-in

Student and parent logins support email/password and Google. Email sign-in uses the existing password flow; it does not send a magic link. Apple sign-in is not enabled.

To enable Google sign-in, create a **Web application** OAuth client ID in [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Add the website's authorized JavaScript origins (for example, `http://localhost:5173`, `http://127.0.0.1:5173`, and `https://medhaa.net`). Set the same client ID in both places:

- API environment: `GOOGLE_CLIENT_ID`
- Web build environment: `VITE_GOOGLE_CLIENT_ID`

Restart the API and web development server after changing these values, or redeploy both services. The Google button remains unavailable until the web client ID is set. Never put a Google client secret in the web application.

## Platform administrator access

The three designated platform accounts are maintained in `apps/api/src/services/platformAdmins.ts`. Password login, verified Google sign-in, and token refresh ensure their ADMIN role. They may sign in through any login portal and play all active games without a paid subscription on any device. Disabled accounts and disabled games remain blocked.

Deploy the API migration to promote existing accounts, then sign out and back in to obtain an updated admin session. In **Admin > Subscriptions**, enter a registered recipient's email and select **Grant free lifetime access**. This creates or replaces their subscription with an ACTIVE, zero-cost LIFETIME plan without an expiry date; the grant is audit-logged. Non-admin accounts cannot grant subscriptions.
