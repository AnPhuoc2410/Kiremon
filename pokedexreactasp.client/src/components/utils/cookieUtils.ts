/**
 * Cookie utility functions for managing authentication tokens and user data
 */

/**
 * Sets a cookie with the specified name, value, and expiration days
 * @param name Cookie name
 * @param value Cookie value
 * @param days Number of days until expiration
 */
export function setCookie(name: string, value: string, days: number): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    expires +
    "; path=/; SameSite=Strict";
}

/**
 * Gets a cookie value by name
 * @param name Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      const rawValue = c.substring(nameEQ.length);
      return decodeURIComponent(rawValue);
    }
  }
  return null;
}

/**
 * Erases a cookie by setting it to expire in the past
 * @param name Cookie name
 */
export function eraseCookie(name: string): void {
  document.cookie =
    name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict";
}
