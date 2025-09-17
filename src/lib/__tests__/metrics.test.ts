import { calculateMetrics } from '../metrics';
import { ShopifyOrder } from '@/types/metrics';

describe('calculateMetrics', () => {
  const mockShopId = 'test-shop-id';
  const mockFrom = new Date('2024-01-01');
  const mockTo = new Date('2024-01-31');

  it('should calculate metrics correctly with orders', () => {
    const mockOrders: ShopifyOrder[] = [
      {
        id: 1,
        total_price: '100.00',
        currency: 'USD',
        created_at: '2024-01-15T10:00:00Z',
        financial_status: 'paid',
        refunds: [
          {
            id: 1,
            created_at: '2024-01-20T10:00:00Z',
            transactions: [
              {
                amount: '20.00',
                kind: 'refund'
              }
            ]
          }
        ]
      },
      {
        id: 2,
        total_price: '50.00',
        currency: 'USD',
        created_at: '2024-01-20T10:00:00Z',
        financial_status: 'paid',
        refunds: []
      }
    ];

    const result = calculateMetrics(mockShopId, mockOrders, mockFrom, mockTo);

    expect(result).toEqual({
      shopId: mockShopId,
      from: '2024-01-01',
      to: '2024-01-31',
      ordersCount: 2,
      grossRevenue: 150.00,
      currency: 'USD',
      avgOrderValue: 75.00,
      refundedAmount: 20.00,
      netRevenue: 130.00
    });
  });

  it('should handle empty orders array', () => {
    const result = calculateMetrics(mockShopId, [], mockFrom, mockTo);

    expect(result).toEqual({
      shopId: mockShopId,
      from: '2024-01-01',
      to: '2024-01-31',
      ordersCount: 0,
      grossRevenue: 0,
      currency: 'USD',
      avgOrderValue: 0,
      refundedAmount: 0,
      netRevenue: 0
    });
  });

  it('should handle orders with no refunds', () => {
    const mockOrders: ShopifyOrder[] = [
      {
        id: 1,
        total_price: '100.00',
        currency: 'EUR',
        created_at: '2024-01-15T10:00:00Z',
        financial_status: 'paid'
      }
    ];

    const result = calculateMetrics(mockShopId, mockOrders, mockFrom, mockTo);

    expect(result).toEqual({
      shopId: mockShopId,
      from: '2024-01-01',
      to: '2024-01-31',
      ordersCount: 1,
      grossRevenue: 100.00,
      currency: 'EUR',
      avgOrderValue: 100.00,
      refundedAmount: 0,
      netRevenue: 100.00
    });
  });

  it('should round monetary values to 2 decimal places', () => {
    const mockOrders: ShopifyOrder[] = [
      {
        id: 1,
        total_price: '33.333',
        currency: 'USD',
        created_at: '2024-01-15T10:00:00Z',
        financial_status: 'paid',
        refunds: [
          {
            id: 1,
            created_at: '2024-01-20T10:00:00Z',
            transactions: [
              {
                amount: '11.111',
                kind: 'refund'
              }
            ]
          }
        ]
      }
    ];

    const result = calculateMetrics(mockShopId, mockOrders, mockFrom, mockTo);

    expect(result.grossRevenue).toBe(33.33);
    expect(result.refundedAmount).toBe(11.11);
    expect(result.netRevenue).toBe(22.22);
    expect(result.avgOrderValue).toBe(33.33);
  });
});
