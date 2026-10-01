# medhaa
"Medhaa – Bhāva Tech's educational gaming platform for cognitive and emotional development" helps anyone (or future you) instantly understand the repo's purpose.

## Web sign-in

Student and parent logins support email/password and Google. Email sign-in uses the existing password flow; it does not send a magic link. Apple sign-in is not enabled.

To enable Google sign-in, create a **Web application** OAuth client ID in [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Add the website's authorized JavaScript origins (for example, `http://localhost:5173`, `http://127.0.0.1:5173`, and `https://medhaa.net`). Set the same client ID in both places:

- API environment: `GOOGLE_CLIENT_ID`
- Web build environment: `VITE_GOOGLE_CLIENT_ID`

Restart the API and web development server after changing these values, or redeploy both services. The Google button remains unavailable until the web client ID is set. Never put a Google client secret in the web application.
