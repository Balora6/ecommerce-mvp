import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ShopifyClient } from "@/lib/shopify";
import { calculateMetrics } from "@/lib/metrics";
import { safeLogger } from "@/lib/security";
import { subDays } from "date-fns";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: shopId } = await params;

    if (!shopId) {
      return NextResponse.json(
        { error: "Shop ID is required" },
        { status: 400 }
      );
    }

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const to = new Date();
    const from = subDays(to, 29); 

    const fromISO = from.toISOString();
    const toISO = to.toISOString();

    safeLogger.info("Fetching metrics for shop", {
      shopId,
      shopDomain: shop.shopDomain,
      from: fromISO,
      to: toISO,
    });

    const shopifyClient = new ShopifyClient(shop.accessToken, shop.shopDomain);

    const orders = await shopifyClient.getOrders(fromISO, toISO);

    const metrics = calculateMetrics(shopId, orders, from, to);

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
    const { id: shopId } = await params;
    safeLogger.error("Error fetching metrics", {
      error: error instanceof Error ? error.message : "Unknown error",
      shopId: shopId,
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
