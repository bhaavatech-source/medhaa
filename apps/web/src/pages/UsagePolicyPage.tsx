import { USAGE_POLICY_TEXT, USAGE_POLICY_VERSION } from "../content/usagePolicy";

export default function UsagePolicyPage() {
  return (
    <div className="policy-page" style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px", lineHeight: 1.6 }}>
      <h1>Usage & Data Policy</h1>
      <p style={{ color: "#666" }}>Version {USAGE_POLICY_VERSION}</p>
      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "1rem" }}>{USAGE_POLICY_TEXT}</pre>
    </div>
  );
}
