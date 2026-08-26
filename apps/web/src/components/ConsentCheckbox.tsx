import { USAGE_POLICY_VERSION } from "../content/usagePolicy";

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ConsentCheckbox({ checked, onChange }: ConsentCheckboxProps) {
  return (
    <label
      className="consent-checkbox"
      style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "0.9rem", margin: "12px 0" }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        data-policy-version={USAGE_POLICY_VERSION}
      />
      <span>
        I am this child&apos;s parent/guardian and I consent to Medhā&apos;s{" "}
        <a href="/usage-policy" target="_blank" rel="noreferrer">
          usage policy
        </a>
        .
      </span>
    </label>
  );
}
