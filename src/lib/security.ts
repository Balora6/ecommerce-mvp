/**
 * Security utilities for handling sensitive data
 */

export function redactSecrets(text: string): string {
  const secrets = [
    process.env.SHOPIFY_APP_SECRET,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ].filter(Boolean);

  let redacted = text;
  secrets.forEach((secret) => {
    if (secret) {
      redacted = redacted.replace(new RegExp(secret, "g"), "[REDACTED]");
    }
  });

  redacted = redacted.replace(
    /access_token["\s]*[:=]["\s]*[a-zA-Z0-9]{20,}/g,
    "access_token: [REDACTED]"
  );

  return redacted;
}

export function logSecurely(message: string, data?: any) {
  const redactedMessage = redactSecrets(message);
  const redactedData = data ? redactSecrets(JSON.stringify(data)) : undefined;

  console.log(
    redactedMessage,
    redactedData ? JSON.parse(redactedData) : undefined
  );
}
