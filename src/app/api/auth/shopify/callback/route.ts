import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import crypto from "crypto";
import {
  safeLogger,
  validateShopDomain,
  sanitizeShopDomain,
  getValidatedAppUrl,
} from "../../../../../lib/security";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const shop = searchParams.get("shop");
    const hmac = searchParams.get("hmac");

    if (!code || !state || !shop || !hmac) {
      await prisma.auditLog.create({
        data: {
          actor: "server",
          action: "oauth_failure",
          meta: { error: "Missing required parameters", shop },
        },
      });
      safeLogger.error("OAuth callback missing parameters", {
        shop,
        hasCode: !!code,
        hasState: !!state,
        hasHmac: !!hmac,
      });
      return NextResponse.redirect(
        `${getValidatedAppUrl()}?error=missing_params`
      );
    }

    if (!validateShopDomain(shop)) {
      await prisma.auditLog.create({
        data: {
          actor: "server",
          action: "oauth_failure",
          meta: { error: "Invalid shop domain", shop },
        },
      });
      safeLogger.error("OAuth callback invalid shop domain", { shop });
      return NextResponse.redirect(
        `${getValidatedAppUrl()}?error=invalid_shop`
      );
    }

    const sanitizedShop = sanitizeShopDomain(shop);

    const shopifyClientSecret = process.env.SHOPIFY_CLIENT_SECRET;
    if (!shopifyClientSecret) {
      return NextResponse.json(
        { error: "Shopify client secret not configured" },
        { status: 500 }
      );
    }

    const params = new URLSearchParams(searchParams);
    params.delete("hmac");
    params.delete("signature");

    const sortedParams = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const calculatedHmac = crypto
      .createHmac("sha256", shopifyClientSecret)
      .update(sortedParams)
      .digest("hex");

    if (calculatedHmac !== hmac) {
      await prisma.auditLog.create({
        data: {
          actor: "server",
          action: "oauth_failure",
          meta: { error: "HMAC verification failed", shop },
        },
      });
      return NextResponse.redirect(
        `${getValidatedAppUrl()}?error=invalid_hmac`
      );
    }

    const tokenResponse = await fetch(
      `https://${sanitizedShop}/admin/oauth/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.SHOPIFY_CLIENT_ID,
          client_secret: shopifyClientSecret,
          code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      await prisma.auditLog.create({
        data: {
          actor: "server",
          action: "oauth_failure",
          meta: { error: "Token exchange failed", shop },
        },
      });
      return NextResponse.redirect(
        `${getValidatedAppUrl()}?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, scope } = tokenData;

    const shopRecord = await prisma.shop.upsert({
      where: { shopDomain: sanitizedShop },
      update: {
        accessToken: access_token,
        apiScope: scope,
        updatedAt: new Date(),
      },
      create: {
        shopDomain: sanitizedShop,
        accessToken: access_token,
        apiScope: scope,
      },
    });

    safeLogger.info("Shop connected successfully", {
      shop: sanitizedShop,
      shopId: shopRecord.id,
    });

    await prisma.auditLog.create({
      data: {
        actor: "server",
        action: "oauth_success",
        shopId: shopRecord.id,
        meta: { shop: sanitizedShop, scope },
      },
    });

    return NextResponse.redirect(
      `${getValidatedAppUrl()}/metrics?connected=true&shop=${encodeURIComponent(
        sanitizedShop
      )}&shopId=${shopRecord.id}`
    );
  } catch (error) {
    safeLogger.error("OAuth callback error", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    await prisma.auditLog.create({
      data: {
        actor: "server",
        action: "oauth_failure",
        meta: { error: "Internal server error" },
      },
    });

    return NextResponse.redirect(
      `${getValidatedAppUrl()}?error=internal_error`
    );
  }
}
