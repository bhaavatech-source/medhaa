import { USAGE_POLICY_VERSION } from '../content/usagePolicy';

export const APP_USAGE_CONSENT_CHANGE_EVENT = 'medhaa:app-usage-consent-change';
export const APP_USAGE_CONSENT_REVIEW_EVENT = 'medhaa:app-usage-consent-review';
export const APP_USAGE_FIRST_OPEN_KEY = 'medhaa_app_usage_first_open_reported';

const consentKey = `medhaa_android_aggregate_analytics_${USAGE_POLICY_VERSION}`;

export function isNativeAndroidApp(): boolean {
  if (typeof window === 'undefined') return false;
  const capacitor = (window as Window & {
    Capacitor?: { isNativePlatform?: () => boolean; getPlatform?: () => string };
  }).Capacitor;

  return capacitor?.isNativePlatform?.() === true && capacitor.getPlatform?.() === 'android';
}

export function getAppUsageConsent(): boolean | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(consentKey);
    return value === 'granted' ? true : value === 'declined' ? false : null;
  } catch {
    return null;
  }
}

export function setAppUsageConsent(granted: boolean): void {
  try {
    window.localStorage.setItem(consentKey, granted ? 'granted' : 'declined');
  } catch {
    return;
  }
  window.dispatchEvent(new Event(APP_USAGE_CONSENT_CHANGE_EVENT));
}

export function requestAppUsageConsentReview(): void {
  window.dispatchEvent(new Event(APP_USAGE_CONSENT_REVIEW_EVENT));
}