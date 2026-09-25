export interface AnalyticsSummary {
  dailyRevenue: number;
  activeOrdersCount: number;
  reservationsTodayCount: number;
  averageOrderValue: number;
  completedOrdersTodayCount: number;
  pendingOrdersCount: number;
}

export interface TopDish {
  dishId: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
}

export interface SalesTrend {
  timeLabel: string;
  revenue: number;
  ordersCount: number;
}

export interface OrderTypeDistribution {
  type: string;
  count: number;
  percentage: number;
}

export class AnalyticsService {
  static async getSummary(): Promise<AnalyticsSummary> {
    return {
      dailyRevenue: 4890.00,
      activeOrdersCount: 8,
      reservationsTodayCount: 14,
      averageOrderValue: 185.50,
      completedOrdersTodayCount: 26,
      pendingOrdersCount: 3,
    };
  }

  static async getTopDishes(): Promise<TopDish[]> {
    return [
      { dishId: 'd3', name: 'A5 Miyazaki Wagyu Tenderloin', category: 'Signature Mains', unitsSold: 42, revenue: 6930.00 },
      { dishId: 'd1', name: 'Imperial Beluga Caviar Tartlet', category: 'Caviar & Starters', unitsSold: 38, revenue: 3610.00 },
      { dishId: 'd4', name: 'Wild Roasted Chilean Sea Bass', category: 'Signature Mains', unitsSold: 29, revenue: 2262.00 },
      { dishId: 'd2', name: 'Hokkaido Scallop Carpaccio', category: 'Caviar & Starters', unitsSold: 24, revenue: 1008.00 },
      { dishId: 'd5', name: 'Tronx Smoked Chocolate Sphere', category: 'Artisanal Desserts', unitsSold: 56, revenue: 1568.00 },
    ];
  }

  static async getHourlySalesTrend(): Promise<SalesTrend[]> {
    return [
      { timeLabel: '17:00', revenue: 420.00, ordersCount: 3 },
      { timeLabel: '18:00', revenue: 890.00, ordersCount: 6 },
      { timeLabel: '19:00', revenue: 1450.00, ordersCount: 10 },
      { timeLabel: '20:00', revenue: 1820.00, ordersCount: 12 },
      { timeLabel: '21:00', revenue: 1120.00, ordersCount: 8 },
      { timeLabel: '22:00', revenue: 640.00, ordersCount: 4 },
    ];
  }

  static async getOrderTypeDistribution(): Promise<OrderTypeDistribution[]> {
    return [
      { type: 'Dine-In', count: 28, percentage: 65 },
      { type: 'Pickup', count: 9, percentage: 21 },
      { type: 'Delivery', count: 6, percentage: 14 },
    ];
  }
}
