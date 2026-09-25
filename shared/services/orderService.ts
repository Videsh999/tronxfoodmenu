import type { Order, OrderStatus, CreateOrderPayload, OrderItem } from '../types/order';
import { env } from '../config/env';
import { supabase } from './supabaseClient';
import { MOCK_ORDERS } from './mockData';

export class OrderService {
  static async getOrders(): Promise<Order[]> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      return MOCK_ORDERS;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((o) => this.mapSupabaseOrder(o));
  }

  static async getOrderById(orderId: string, trackingToken?: string): Promise<Order | null> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      const order = MOCK_ORDERS.find((o) => o.id === orderId || o.orderNumber === orderId);
      return order || null;
    }

    const token = trackingToken || (typeof window !== 'undefined' ? localStorage.getItem(`craftsland_tracking_${orderId}`) : null);

    // If tracking token is provided, or if the orderId might be an unauthenticated guest lookup
    if (token) {
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_guest_order_by_token', {
        p_order_number: orderId,
        p_tracking_token: token,
      });

      if (!rpcError && rpcData) {
        return this.mapGuestRpcOrder(rpcData, token);
      }
    }

    // Authenticated customer or Staff lookup via standard RLS-protected query
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
    let query = supabase.from('orders').select('*, order_items(*)');
    if (isUuid) {
      query = query.eq('id', orderId);
    } else {
      query = query.eq('order_number', orderId);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      // Fallback: If caller didn't pass trackingToken in param, check localStorage for a saved token for this order
      const storedToken = token || (typeof window !== 'undefined' ? localStorage.getItem(`craftsland_tracking_${orderId}`) : null);
      if (storedToken) {
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_guest_order_by_token', {
          p_order_number: orderId,
          p_tracking_token: storedToken,
        });
        if (!rpcError && rpcData) {
          return this.mapGuestRpcOrder(rpcData, storedToken);
        }
      }
      return null;
    }

    return this.mapSupabaseOrder(data);
  }

  static async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const orderNumber = `#CFL-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10000 + Math.random() * 90000)}`;

    if (env.isDevelopment && !env.isRazorpayConfigured) {
      const mockTrackingToken = `dev_tok_${Math.random().toString(36).substring(2, 18)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        trackingToken: mockTrackingToken,
        customerId: payload.customerId,
        guestName: payload.customerName,
        guestEmail: payload.customerEmail,
        orderType: payload.orderType,
        tableNumber: payload.tableNumber,
        deliveryAddress: payload.deliveryAddress,
        subtotal: payload.subtotal,
        taxAmount: payload.taxAmount,
        deliveryFee: payload.deliveryFee,
        discountAmount: payload.discountAmount,
        tipAmount: payload.tipAmount,
        totalAmount: payload.totalAmount,
        orderStatus: 'PENDING',
        paymentStatus: 'PAID',
        paymentReference: payload.paymentReference || `mock_ref_${Date.now()}`,
        specialInstructions: payload.specialInstructions,
        items: payload.items.map((item, idx) => ({
          id: `oi-${Date.now()}-${idx}`,
          orderId: `ord-${Date.now()}`,
          dishId: item.dishId,
          dishName: item.dishName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          selectedModifiers: item.selectedModifiers,
          itemSubtotal: item.itemSubtotal,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(`craftsland_tracking_${newOrder.id}`, mockTrackingToken);
        localStorage.setItem(`craftsland_tracking_${newOrder.orderNumber}`, mockTrackingToken);
      }

      MOCK_ORDERS.unshift(newOrder);
      return newOrder;
    }

    // Production Order Creation via Server-Authoritative Database RPC
    // Note: Browser-submitted subtotal/tax/deliveryFee/total are omitted or ignored by create_verified_order
    const rpcPayload = {
      order_type: payload.orderType,
      table_number: payload.tableNumber || null,
      delivery_address: payload.deliveryAddress ? { text: payload.deliveryAddress } : null,
      special_instructions: payload.specialInstructions || null,
      tip_amount: payload.tipAmount || 0.00,
      guest_info: {
        name: payload.customerName || 'Distinguished Guest',
        email: payload.customerEmail || 'guest@tronx.com',
      },
      items: payload.items.map((item) => ({
        dish_id: item.dishId,
        quantity: item.quantity,
        selected_modifiers: item.selectedModifiers.map((m) => ({
          name: m.modifierTitle,
          optionName: m.optionName,
          price: m.price,
        })),
      })),
    };

    const { data: verifiedResult, error: rpcError } = await supabase.rpc('create_verified_order', {
      p_payload: rpcPayload,
    });

    if (rpcError || !verifiedResult) {
      console.error('Server order verification RPC failed:', rpcError);
      throw new Error(rpcError?.message || 'Failed to verify and create order with kitchen concierge.');
    }

    // Store tracking token locally for seamless guest order status tracking
    if (typeof window !== 'undefined' && verifiedResult.tracking_token) {
      localStorage.setItem(`craftsland_tracking_${verifiedResult.id}`, verifiedResult.tracking_token);
      localStorage.setItem(`craftsland_tracking_${verifiedResult.order_number}`, verifiedResult.tracking_token);
    }

    // Retrieve the fully populated order from database
    const createdOrder = await this.getOrderById(verifiedResult.id, verifiedResult.tracking_token);
    if (!createdOrder) {
      // Fallback return using verified RPC return snapshot
      return {
        id: verifiedResult.id,
        orderNumber: verifiedResult.order_number,
        trackingToken: verifiedResult.tracking_token,
        customerId: payload.customerId,
        guestName: payload.customerName,
        guestEmail: payload.customerEmail,
        orderType: payload.orderType,
        tableNumber: payload.tableNumber,
        deliveryAddress: payload.deliveryAddress,
        subtotal: Number(verifiedResult.subtotal),
        taxAmount: Number(verifiedResult.tax_amount),
        deliveryFee: Number(verifiedResult.delivery_fee),
        discountAmount: 0.00,
        tipAmount: Number(verifiedResult.tip_amount),
        totalAmount: Number(verifiedResult.total_amount),
        orderStatus: verifiedResult.order_status || 'PENDING',
        paymentStatus: verifiedResult.payment_status || 'UNPAID',
        paymentReference: payload.paymentReference,
        specialInstructions: payload.specialInstructions,
        items: payload.items.map((item, idx) => ({
          id: `item-${idx}`,
          orderId: verifiedResult.id,
          dishId: item.dishId,
          dishName: item.dishName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          selectedModifiers: item.selectedModifiers,
          itemSubtotal: item.itemSubtotal,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    // Ensure trackingToken is explicitly preserved on the returned order
    if (verifiedResult.tracking_token && !createdOrder.trackingToken) {
      createdOrder.trackingToken = verifiedResult.tracking_token;
    }

    return createdOrder;
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      const order = MOCK_ORDERS.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (order) {
        order.orderStatus = status;
        order.updatedAt = new Date().toISOString();
      }
      return true;
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
    let query = supabase
      .from('orders')
      .update({ order_status: status, updated_at: new Date().toISOString() });
    
    if (isUuid) {
      query = query.eq('id', orderId);
    } else {
      query = query.eq('order_number', orderId);
    }

    const { error } = await query;
    if (error) {
      console.error('[OrderService] updateOrderStatus failed:', error);
      return false;
    }

    // Broadcast status change immediately so any open tab (customer/admin/kitchen) updates instantly
    try {
      const broadcastChannel = supabase.channel(`order-updates-${orderId}`);
      await broadcastChannel.send({
        type: 'broadcast',
        event: 'status_changed',
        payload: { orderId, orderStatus: status },
      });
    } catch {
      // Non-fatal broadcast warning
    }

    return true;
  }

  static async cancelOrder(orderId: string): Promise<boolean> {
    return this.updateOrderStatus(orderId, 'CANCELLED');
  }

  static subscribeToOrderUpdates(
    orderId: string,
    onUpdate: (order: Order) => void,
    trackingToken?: string
  ): () => void {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      const statusSequence: OrderStatus[] = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];
      let step = 0;

      const intervalId = setInterval(() => {
        const order = MOCK_ORDERS.find((o) => o.id === orderId || o.orderNumber === orderId);
        if (!order) return;

        const currentIndex = statusSequence.indexOf(order.orderStatus);
        if (currentIndex < statusSequence.length - 1 && currentIndex !== -1) {
          step = currentIndex + 1;
        } else if (currentIndex === -1) {
          step = Math.min(step + 1, statusSequence.length - 1);
        } else {
          clearInterval(intervalId);
          return;
        }

        order.orderStatus = statusSequence[step];
        order.updatedAt = new Date().toISOString();
        onUpdate({ ...order });
      }, 8000);

      return () => clearInterval(intervalId);
    }

    let isSubscribed = true;
    let cachedOrder: Order | null = null;

    // Fast-path optimistic UI update (<10ms): updates status immediately when realtime packet arrives
    const applyFastStatus = (newStatus: OrderStatus) => {
      if (!isSubscribed || !newStatus) return;
      if (cachedOrder && cachedOrder.orderStatus !== newStatus) {
        cachedOrder = {
          ...cachedOrder,
          orderStatus: newStatus,
          updatedAt: new Date().toISOString(),
        };
        onUpdate(cachedOrder);
      }
    };

    const handleSync = async () => {
      if (!isSubscribed) return;
      try {
        const updated = await this.getOrderById(orderId, trackingToken);
        if (updated && isSubscribed) {
          cachedOrder = updated;
          onUpdate(updated);
        }
      } catch (err) {
        // Handled silently; polling or reconnect will retry
      }
    };

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
    const orderEventsFilter = isUuid ? `order_id=eq.${orderId}` : `order_number=eq.${orderId}`;
    const ordersFilter = isUuid ? `id=eq.${orderId}` : `order_number=eq.${orderId}`;

    // Multi-transport Supabase Realtime Channel:
    // 1. postgres_changes on order_status_events (public table, bypasses guest RLS, zero PII, ultra-fast)
    // 2. postgres_changes on orders (authenticated users & staff)
    // 3. broadcast status_changed events (instant client-to-client relay)
    const channel = supabase
      .channel(`order-updates-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_status_events',
          filter: orderEventsFilter,
        },
        (payload: any) => {
          const status = payload.new?.order_status as OrderStatus;
          if (status) applyFastStatus(status);
          handleSync();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: ordersFilter,
        },
        (payload: any) => {
          const status = (payload.new?.order_status || payload.new?.status) as OrderStatus;
          if (status) applyFastStatus(status);
          handleSync();
        }
      )
      .on(
        'broadcast',
        { event: 'status_changed' },
        (payload: any) => {
          const status = (payload.payload?.orderStatus || payload.payload?.status) as OrderStatus;
          if (status) applyFastStatus(status);
          handleSync();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          handleSync();
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setTimeout(() => {
            if (isSubscribed) handleSync();
          }, 1500);
        }
      });

    // Reconnection & tab-visibility recovery listeners
    const handleOnline = () => {
      if (isSubscribed) handleSync();
    };
    const handleVisibility = () => {
      if (isSubscribed && typeof document !== 'undefined' && document.visibilityState === 'visible') {
        handleSync();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      document.addEventListener('visibilitychange', handleVisibility);
    }

    // Heartbeat fallback polling every 4 seconds to guarantee zero missed updates in hostile network conditions
    const pollInterval = setInterval(() => {
      handleSync();
    }, 4000);

    // Initial sync
    handleSync();

    return () => {
      isSubscribed = false;
      clearInterval(pollInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        document.removeEventListener('visibilitychange', handleVisibility);
      }
      supabase.removeChannel(channel);
    };
  }

  static async createRazorpayOrder(orderId: string, trackingToken?: string) {
    const token = trackingToken || (typeof window !== 'undefined' ? (localStorage.getItem(`craftsland_tracking_${orderId}`) || undefined) : undefined);
    const headers: Record<string, string> = {};
    if (token) headers['x-order-token'] = token;
    return await supabase.functions.invoke('create-razorpay-order', {
      body: { orderId, trackingToken: token },
      headers,
    });
  }

  static async verifyRazorpayPayment(payload: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    trackingToken?: string;
  }) {
    const token = payload.trackingToken || (typeof window !== 'undefined' ? (localStorage.getItem(`craftsland_tracking_${payload.orderId}`) || undefined) : undefined);
    const headers: Record<string, string> = {};
    if (token) headers['x-order-token'] = token;
    return await supabase.functions.invoke('verify-razorpay-payment', {
      body: { ...payload, trackingToken: token },
      headers,
    });
  }

  private static mapSupabaseOrder(o: any): Order {
    return {
      id: o.id,
      orderNumber: o.order_number,
      trackingToken: o.tracking_token,
      customerId: o.customer_id || o.user_id,
      guestName: o.guest_name || o.guest_info?.name,
      guestEmail: o.guest_email || o.guest_info?.email,
      guestPhone: o.guest_phone || o.guest_info?.phone,
      orderType: o.order_type,
      tableNumber: o.table_number,
      deliveryAddress: typeof o.delivery_address === 'string' ? o.delivery_address : o.delivery_address?.text,
      subtotal: Number(o.subtotal || 0),
      taxAmount: Number(o.tax_amount || o.tax || 0),
      deliveryFee: Number(o.delivery_fee || 0),
      discountAmount: Number(o.discount_amount || 0),
      tipAmount: Number(o.tip_amount || o.tip || 0),
      totalAmount: Number(o.total_amount || o.total || 0),
      orderStatus: o.order_status || o.status,
      paymentStatus: o.payment_status,
      paymentReference: o.payment_reference,
      specialInstructions: o.special_instructions,
      items: (o.order_items || []).map((item: any): OrderItem => ({
        id: item.id,
        orderId: item.order_id,
        dishId: item.dish_id,
        dishName: item.dish_name_snapshot || item.dish_name,
        unitPrice: Number(item.unit_price_snapshot || item.unit_price || 0),
        quantity: item.quantity,
        selectedModifiers: (item.selected_modifiers || []).map((m: any) => ({
          modifierTitle: m.name || m.modifierTitle || 'Modifier',
          optionName: m.optionName || m.name || '',
          price: Number(m.price || 0),
        })),
        itemSubtotal: Number(item.line_total || item.item_subtotal || 0),
      })),
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    };
  }

  private static mapGuestRpcOrder(o: any, fallbackToken?: string): Order {
    const token = o.tracking_token || fallbackToken || (typeof window !== 'undefined' ? (localStorage.getItem(`craftsland_tracking_${o.id}`) || localStorage.getItem(`craftsland_tracking_${o.order_number}`)) : undefined) || undefined;
    return {
      id: o.id,
      orderNumber: o.order_number,
      trackingToken: token,
      orderType: o.order_type,
      tableNumber: o.table_number,
      deliveryAddress: typeof o.delivery_address === 'string' ? o.delivery_address : o.delivery_address?.text,
      subtotal: Number(o.subtotal || 0),
      taxAmount: Number(o.tax_amount || 0),
      deliveryFee: Number(o.delivery_fee || 0),
      discountAmount: 0.00,
      tipAmount: Number(o.tip_amount || 0),
      totalAmount: Number(o.total_amount || 0),
      orderStatus: o.order_status,
      paymentStatus: o.payment_status,
      items: (o.items || []).map((item: any): OrderItem => ({
        id: item.id,
        orderId: o.id,
        dishId: item.dish_id || '',
        dishName: item.dish_name,
        unitPrice: Number(item.unit_price || 0),
        quantity: item.quantity,
        selectedModifiers: (item.selected_modifiers || []).map((m: any) => ({
          modifierTitle: m.name || m.modifierTitle || 'Modifier',
          optionName: m.optionName || m.name || '',
          price: Number(m.price || 0),
        })),
        itemSubtotal: Number(item.line_total || 0),
      })),
      createdAt: o.created_at,
      updatedAt: o.created_at,
    };
  }
}
