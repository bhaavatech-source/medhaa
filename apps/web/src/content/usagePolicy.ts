export const USAGE_POLICY_VERSION = "1.2";

export const USAGE_POLICY_TEXT = `
Medhā Usage & Data Policy (v1.2)

1. What we collect
   - Child's name/nickname (as entered by the parent/guardian)
   - Game scores and progress
   - Basic usage data required to operate the service
   - Only after a parent/guardian opts in on Android: anonymous first-open counts and total foreground time, stored as daily aggregates

2. What we do NOT do
   - Anonymous app statistics are not linked to an account, email, or persistent device identifier; individual sessions are not retained
   - We do not create individual child usage profiles or use a child's data for behavioural tracking
   - We do not use a child's data for targeted advertising
   - We do not sell or share a child's data with third parties for marketing

3. Parental rights
   - Parents/guardians may request a copy of their child's stored data at any time
   - Parents/guardians may delete their account and parent-created child profiles in Settings > Delete account
   - Independently registered child accounts linked to a deleted parent account are unlinked, not deleted
   - A user who cannot sign in may request account deletion by emailing support@medhaa.net from the registered address

4. Account deletion
   - Account deletion permanently removes the account profile, subscription record, saved game activity, scores, achievements, coin history, and account-linked child profiles created by that parent account
   - Public cognitive assessment submissions are stored separately from login accounts and are not deleted with an account; request their deletion separately by emailing support@medhaa.net
   - Anonymous daily app statistics are aggregated and are not linked to an account, so an individual account deletion cannot identify or remove a contribution from those totals

5. Consent
   - By checking the consent box, you confirm you are the parent or legal guardian of the child using this account, and you consent to Medhā processing the data described above for the purpose of providing the learning and gaming service.

6. Optional Android app statistics
   - A parent/guardian can allow or decline anonymous app statistics in the Android app and change that choice later in Settings
   - A random live-session token is held in API memory only while the app is open and expires after 90 seconds without a heartbeat; it is not saved or linked to an account or device
   - First-open counts are estimates and can count again after reinstalling the app or clearing its data
   - These statistics do not identify unique devices and cannot report confirmed uninstalls; official aggregate install metrics come from Google Play

7. Updates
   - This policy may be updated from time to time. Material changes will require renewed consent.
`;
