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
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "string") {
    return "[REDACTED]";
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
        ? "[REDACTED]"
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

  // Basic validation for .myshopify.com domains
  const shopifyDomainRegex = /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/;
  return shopifyDomainRegex.test(shop);
}

/**
 * Sanitizes shop domain for database storage
 */
export function sanitizeShopDomain(shop: string): string {
  return shop.toLowerCase().trim();
}
