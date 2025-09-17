import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  safeLogger,
  validateShopDomain,
  sanitizeShopDomain,
} from "../../../../lib/security";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const shopifyClientId = process.env.SHOPIFY_CLIENT_ID;
    const shopifyScopes =
      process.env.SHOPIFY_SCOPES || "read_orders,read_products,read_customers";
    const vercelUrl = process.env.VERCEL_URL || "http://localhost:3000";

    if (!shopifyClientId) {
      return NextResponse.json(
        { error: "Shopify client ID not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const shop = searchParams.get("shop");

    if (!shop) {
      return NextResponse.json(
        { error: "Shop parameter is required" },
        { status: 400 }
      );
    }

    if (!validateShopDomain(shop)) {
      return NextResponse.json(
        { error: "Invalid shop domain" },
        { status: 400 }
      );
    }

    const sanitizedShop = sanitizeShopDomain(shop);
    const state = Math.random().toString(36).substring(2, 15);

    await prisma.auditLog.create({
      data: {
        actor: "server",
        action: "oauth_initiated",
        meta: { shop: sanitizedShop, state },
      },
    });

    safeLogger.info("OAuth initiated", { shop: sanitizedShop, state });

    const redirectUri = `${vercelUrl}/api/auth/shopify/callback`;
    const oauthUrl =
      `https://${sanitizedShop}/admin/oauth/authorize?` +
      `client_id=${shopifyClientId}&` +
      `scope=${shopifyScopes}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}`;

    return NextResponse.redirect(oauthUrl);
  } catch (error) {
    safeLogger.error("OAuth initiation error", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
