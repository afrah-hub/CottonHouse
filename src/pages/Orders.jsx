import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FiShoppingBag, FiTruck, FiCheck, FiX, FiPlus, FiMinus, FiLoader } from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-amber-400 bg-amber-950/40 border border-amber-900/30';
      case 'Confirmed': return 'text-sky-400 bg-sky-950/40 border border-sky-900/30';
      case 'Shipped': return 'text-indigo-400 bg-indigo-950/40 border border-indigo-900/30';
      case 'Delivered': return 'text-emerald-400 bg-emerald-950/40 border border-emerald-900/30';
      case 'Cancelled': return 'text-red-400 bg-red-950/40 border border-red-900/30';
      default: return 'text-slate-400 bg-slate-900 border border-slate-800';
    }
  };

  const getProgressWidth = (status) => {
    switch (status) {
      case 'Pending': return 'w-[10%]';
      case 'Confirmed': return 'w-[40%]';
      case 'Shipped': return 'w-[75%]';
      case 'Delivered': return 'w-[100%]';
      case 'Cancelled': return 'w-[0%]';
      default: return 'w-[0%]';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <FiLoader className="animate-spin text-indigo-500" size={30} />
          <span className="text-sm font-semibold">Loading order logs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8">
      
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 uppercase">My Order History</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-6">
          <div className="p-5 bg-slate-900/60 rounded-full border border-slate-800 text-slate-500">
            <FiShoppingBag size={36} />
          </div>
          <div>
            <h3 className="font-bold text-slate-300 text-lg">No orders found</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              You haven't placed any purchases yet. Add some items to your cart and place an order.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-fade-in">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.orderId;
            return (
              <div 
                key={order.orderId} 
                className="glass-card border border-slate-900 rounded-3xl p-6 flex flex-col gap-6 shadow-xl hover:border-slate-800/80 transition-colors"
              >
                
                {/* Header specs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                    <div>
                      <span className="font-semibold block">Order Reference</span>
                      <span className="font-mono text-slate-200 mt-1 block font-bold">#CH-{order.orderId}</span>
                    </div>
                    <div className="h-6 w-px bg-slate-900 hidden sm:block" />
                    <div>
                      <span className="font-semibold block">Placed On</span>
                      <span className="text-slate-200 mt-1 block">
                        {new Date(order.createdDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                    </div>
                    <div className="h-6 w-px bg-slate-900 hidden sm:block" />
                    <div>
                      <span className="font-semibold block">Payment Status</span>
                      <span className={`font-semibold mt-1 inline-block px-2 py-0.5 rounded text-[10px] uppercase ${
                        order.paymentStatus === 'Paid' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Estimated Subtotal</span>
                    <span className="text-lg font-extrabold text-slate-200">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Progress bar tracking visualizer (hide if cancelled) */}
                {order.orderStatus !== 'Cancelled' ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] uppercase font-extrabold tracking-widest text-slate-500">
                      <span className={order.orderStatus === 'Pending' ? 'text-indigo-400' : ''}>Pending</span>
                      <span className={order.orderStatus === 'Confirmed' ? 'text-indigo-400' : ''}>Confirmed</span>
                      <span className={order.orderStatus === 'Shipped' ? 'text-indigo-400' : ''}>Shipped</span>
                      <span className={order.orderStatus === 'Delivered' ? 'text-indigo-400' : ''}>Delivered</span>
                    </div>
                    
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800/40">
                      <div className={`h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-700 ${getProgressWidth(order.orderStatus)}`} />
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] uppercase font-extrabold px-3 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <p className="text-xs text-slate-500 italic">
                        {order.orderStatus === 'Pending' && "Your order has been placed and is awaiting payment validation."}
                        {order.orderStatus === 'Confirmed' && "Payment verified. We are packaging your premium items."}
                        {order.orderStatus === 'Shipped' && "Courier package dispatched. Awaiting delivery drop."}
                        {order.orderStatus === 'Delivered' && "Package has been marked as delivered at your doorstep."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-extrabold px-3 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                      Cancelled
                    </span>
                    <p className="text-xs text-slate-500 italic">
                      This order was cancelled and transaction voided.
                    </p>
                  </div>
                )}

                {/* Expanded Item list drawer */}
                <div className="border-t border-slate-950 pt-4 flex flex-col gap-4">
                  <button
                    id={`btn-order-expand-${order.orderId}`}
                    onClick={() => setExpandedOrder(isExpanded ? null : order.orderId)}
                    className="flex items-center justify-between gap-4 w-full text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    <span>{isExpanded ? "Hide Item Details" : `View ${order.items?.length || 0} Ordered Items`}</span>
                    {isExpanded ? <FiMinus /> : <FiPlus />}
                  </button>

                  {isExpanded && (
                    <div className="flex flex-col gap-4 mt-2 animate-fade-in">
                      {order.items?.map((item) => (
                        <div key={item.orderItemId} className="flex justify-between items-center gap-4 text-xs bg-slate-950/40 rounded-xl p-3 border border-slate-900/60">
                          <div className="flex items-center gap-3">
                            <div className="w-10 aspect-[3/4] bg-slate-900 rounded-lg overflow-hidden shrink-0">
                              <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover object-top" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-200 block max-w-xs truncate">{item.productName}</span>
                              <span className="text-[10px] text-slate-500 mt-0.5 block">Quantity: {item.quantity} &bull; Price: ${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                          <span className="font-bold text-slate-300">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Orders;
