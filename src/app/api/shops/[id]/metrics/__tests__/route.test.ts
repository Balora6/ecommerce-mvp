import { NextRequest } from 'next/server';
import { GET } from '../route';
import { PrismaClient } from '@prisma/client';
import { ShopifyClient } from '@/lib/shopify';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    shop: {
      findUnique: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  })),
}));

// Mock ShopifyClient
jest.mock('@/lib/shopify', () => ({
  ShopifyClient: jest.fn().mockImplementation(() => ({
    getOrders: jest.fn(),
  })),
}));

// Mock security logger
jest.mock('@/lib/security', () => ({
  safeLogger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('/api/shops/[id]/metrics', () => {
  let mockPrisma: any;
  let mockShopifyClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = new PrismaClient();
    mockShopifyClient = new ShopifyClient('token', 'shop');
  });

  it('should return 400 if shop ID is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/shops//metrics');
    const response = await GET(request, { params: { id: '' } });
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Shop ID is required');
  });

  it('should return 404 if shop is not found', async () => {
    mockPrisma.shop.findUnique.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/shops/test-id/metrics');
    const response = await GET(request, { params: { id: 'test-id' } });
    
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe('Shop not found');
  });

  it('should return metrics for valid shop', async () => {
    const mockShop = {
      id: 'test-shop-id',
      shopDomain: 'test-shop',
      accessToken: 'test-token',
      apiScope: 'read_orders,read_products',
    };

    const mockOrders = [
      {
        id: 1,
        total_price: '100.00',
        currency: 'USD',
        created_at: '2024-01-15T10:00:00Z',
        financial_status: 'paid',
        refunds: [],
      },
    ];

    mockPrisma.shop.findUnique.mockResolvedValue(mockShop);
    mockShopifyClient.getOrders.mockResolvedValue(mockOrders);
    mockPrisma.auditLog.create.mockResolvedValue({});

    const request = new NextRequest('http://localhost:3000/api/shops/test-shop-id/metrics');
    const response = await GET(request, { params: { id: 'test-shop-id' } });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    
    expect(data).toHaveProperty('shopId', 'test-shop-id');
    expect(data).toHaveProperty('ordersCount', 1);
    expect(data).toHaveProperty('grossRevenue', 100);
    expect(data).toHaveProperty('currency', 'USD');
    expect(data).toHaveProperty('avgOrderValue', 100);
    expect(data).toHaveProperty('refundedAmount', 0);
    expect(data).toHaveProperty('netRevenue', 100);
    expect(data).toHaveProperty('from');
    expect(data).toHaveProperty('to');
  });

  it('should handle Shopify API errors', async () => {
    const mockShop = {
      id: 'test-shop-id',
      shopDomain: 'test-shop',
      accessToken: 'test-token',
      apiScope: 'read_orders,read_products',
    };

    mockPrisma.shop.findUnique.mockResolvedValue(mockShop);
    mockShopifyClient.getOrders.mockRejectedValue(new Error('Shopify API error'));

    const request = new NextRequest('http://localhost:3000/api/shops/test-shop-id/metrics');
    const response = await GET(request, { params: { id: 'test-shop-id' } });
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Internal server error');
  });

  it('should return zero metrics for shop with no orders', async () => {
    const mockShop = {
      id: 'test-shop-id',
      shopDomain: 'test-shop',
      accessToken: 'test-token',
      apiScope: 'read_orders,read_products',
    };

    mockPrisma.shop.findUnique.mockResolvedValue(mockShop);
    mockShopifyClient.getOrders.mockResolvedValue([]);
    mockPrisma.auditLog.create.mockResolvedValue({});

    const request = new NextRequest('http://localhost:3000/api/shops/test-shop-id/metrics');
    const response = await GET(request, { params: { id: 'test-shop-id' } });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    
    expect(data.ordersCount).toBe(0);
    expect(data.grossRevenue).toBe(0);
    expect(data.avgOrderValue).toBe(0);
    expect(data.refundedAmount).toBe(0);
    expect(data.netRevenue).toBe(0);
  });
});
