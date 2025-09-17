import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ShopifyClient } from "@/lib/shopify";
import { calculateMetrics } from "@/lib/metrics";
import { safeLogger } from "@/lib/security";
import { subDays } from "date-fns";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shopId = params.id;

    if (!shopId) {
      return NextResponse.json(
        { error: "Shop ID is required" },
        { status: 400 }
      );
    }

    // Fetch shop from database
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Calculate date range for last 30 days (inclusive of today)
    const to = new Date();
    const from = subDays(to, 29); // 29 days ago + today = 30 days total

    // Format dates for Shopify API (ISO 8601)
    const fromISO = from.toISOString();
    const toISO = to.toISOString();

    safeLogger.info("Fetching metrics for shop", {
      shopId,
      shopDomain: shop.shopDomain,
      from: fromISO,
      to: toISO,
    });

    // Initialize Shopify client
    const shopifyClient = new ShopifyClient(shop.accessToken, shop.shopDomain);

    // Fetch orders from Shopify
    const orders = await shopifyClient.getOrders(fromISO, toISO);

    // Calculate metrics
    const metrics = calculateMetrics(shopId, orders, from, to);

    // Log successful metrics fetch
    await prisma.auditLog.create({
      data: {
        actor: "server",
        action: "metrics_fetched",
        shopId: shopId,
        meta: {
          ordersCount: metrics.ordersCount,
          grossRevenue: metrics.grossRevenue,
          currency: metrics.currency,
        },
      },
    });

    safeLogger.info("Metrics calculated successfully", {
      shopId,
      ordersCount: metrics.ordersCount,
      grossRevenue: metrics.grossRevenue,
    });

    return NextResponse.json(metrics);
  } catch (error) {
    safeLogger.error("Error fetching metrics", {
      error: error instanceof Error ? error.message : "Unknown error",
      shopId: params.id,
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
