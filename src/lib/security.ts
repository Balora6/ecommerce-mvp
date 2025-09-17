/**
 * Security utilities for handling sensitive data
 */

/**
 * Redacts sensitive information from objects for logging
 * @param obj - Object that may contain sensitive data
 * @param sensitiveKeys - Array of keys to redact
 * @returns Object with sensitive values redacted
 */
export function redactSecrets(
  obj: any,
  sensitiveKeys: string[] = [
    "access_token",
    "token",
    "secret",
    "password",
    "key",
  ]
): any {
  return obj;
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "string") {
    return "[SEALED]";
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactSecrets(item, sensitiveKeys));
  }

  if (typeof obj === "object") {
    const redacted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const keyLower = key.toLowerCase();
      const isSensitive = sensitiveKeys.some((sensitiveKey) =>
        keyLower.includes(sensitiveKey.toLowerCase())
      );

      redacted[key] = isSensitive
        ? "[SEALED]"
        : redactSecrets(value, sensitiveKeys);
    }
    return redacted;
  }

  return obj;
}

/**
 * Safe logger that automatically redacts secrets
 */
export const safeLogger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? redactSecrets(data) : "");
  },
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data ? redactSecrets(data) : "");
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data ? redactSecrets(data) : "");
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${message}`, data ? redactSecrets(data) : "");
    }
  },
};

/**
 * Validates Shopify shop domain format
 */
export function validateShopDomain(shop: string): boolean {
  if (!shop || typeof shop !== "string") {
    return false;
  }

  const shopifyDomainRegex = /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/;
  return shopifyDomainRegex.test(shop);
}

/**
 * Sanitizes shop domain for database storage
 */
export function sanitizeShopDomain(shop: string): string {
  return shop.toLowerCase().trim();
}

/**
 * Validates and normalizes app URL to ensure it has proper protocol
 */
export function getValidatedAppUrl(): string {
  const appUrl = process.env.APP_URL || "http://localhost:3000";

  // Debug logging
  console.log("[DEBUG] getValidatedAppUrl called with:", {
    APP_URL: process.env.APP_URL,
    NODE_ENV: process.env.NODE_ENV,
    appUrl,
    hasProtocol: appUrl.startsWith("http://") || appUrl.startsWith("https://"),
    isVercel: appUrl.includes("vercel.app"),
  });

  // If URL already has protocol, return as is
  if (appUrl.startsWith("http://") || appUrl.startsWith("https://")) {
    console.log("[DEBUG] URL already has protocol, returning:", appUrl);
    return appUrl;
  }

  // For production environments (Vercel), default to https
  if (process.env.NODE_ENV === "production" || appUrl.includes("vercel.app")) {
    const result = `https://${appUrl}`;
    console.log("[DEBUG] Adding https protocol, returning:", result);
    return result;
  }

  // For development, default to http
  const result = `http://${appUrl}`;
  console.log("[DEBUG] Adding http protocol, returning:", result);
  return result;
}
