import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import { FiCheckCircle, FiAlertTriangle, FiShoppingBag, FiTruck, FiLoader } from 'react-icons/fi';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const OrderSuccess = () => {
  const query = useQuery();
  const sessionId = query.get('session_id');
  const orderIdStr = query.get('order_id');
  const orderId = orderIdStr ? parseInt(orderIdStr) : 0;

  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const confirmPaymentAndLoad = async () => {
      if (!sessionId || !orderId) {
        setStatus('error');
        return;
      }
      try {
        // Confirm payment in backend
        await api.post('/orders/confirm-payment', { orderId, sessionId });
        
        // Fetch order details
        const orderRes = await api.get(`/orders/${orderId}`);
        setOrder(orderRes.data);
        setStatus('success');
      } catch (error) {
        console.error("Failed to confirm order payment", error);
        setStatus('error');
      }
    };

    confirmPaymentAndLoad();
  }, [sessionId, orderId]);

  if (status === 'verifying') {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center flex flex-col items-center gap-4">
        <FiLoader size={44} className="animate-spin text-indigo-500" />
        <h2 className="text-xl font-bold text-slate-200">Verifying Payment...</h2>
        <p className="text-sm text-slate-500">
          We are currently confirming your transaction with Stripe. Please do not close this window.
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center flex flex-col items-center gap-4">
        <div className="p-4 bg-red-950/40 rounded-full border border-red-900/30 text-red-400">
          <FiAlertTriangle size={44} />
        </div>
        <h2 className="text-xl font-bold text-slate-200">Payment Verification Failed</h2>
        <p className="text-sm text-slate-500">
          We couldn't confirm your transaction details or find your order record. Contact support if you were charged.
        </p>
        <Link to="/cart" className="bg-slate-900 border border-slate-800 text-slate-300 font-bold px-6 py-2.5 rounded-full mt-2 hover:bg-slate-950 transition-all">
          Go Back to Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col items-center gap-8 animate-fade-in">
      
      {/* Visual Success Indicator */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-emerald-500 p-2 bg-emerald-950/20 rounded-full border border-emerald-900/20">
          <FiCheckCircle size={56} className="fill-emerald-950/10" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Purchase Confirmed</span>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight mt-1">Thank you for your order!</h1>
          <p className="text-sm text-slate-500 mt-2">
            Your payment was processed successfully. A confirmation summary is listed below.
          </p>
        </div>
      </div>

      {/* Order Summary Receipt Box */}
      {order && (
        <div className="w-full glass-card border border-slate-900 rounded-3xl p-6 flex flex-col gap-6 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-900 pb-4 text-sm text-slate-400">
            <div>
              <span className="font-semibold block">Order ID</span>
              <span className="font-mono text-slate-200 mt-1 block">#CH-{order.orderId}</span>
            </div>
            <div className="text-right">
              <span className="font-semibold block">Date</span>
              <span className="text-slate-200 mt-1 block">
                {new Date(order.createdDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-4">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ordered Wardrobe</span>
            <div className="flex flex-col gap-3">
              {order.items?.map((item) => (
                <div key={item.orderItemId} className="flex justify-between items-center gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 aspect-[3/4] bg-slate-900 rounded-lg overflow-hidden shrink-0">
                      <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover object-top" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 block max-w-xs truncate">{item.productName}</span>
                      <span className="text-[11px] text-slate-500">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-300">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary pricing */}
          <div className="flex flex-col gap-2 pt-4 border-t border-slate-900 text-sm text-slate-400">
            <div className="flex justify-between">
              <span>Payment Gateway</span>
              <span className="font-bold text-slate-300">Stripe Card Payment</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Status</span>
              <span className="font-bold text-indigo-400 flex items-center gap-1">
                <FiTruck />
                <span>{order.orderStatus}</span>
              </span>
            </div>
            <div className="flex justify-between text-base text-slate-200 font-extrabold pt-3 border-t border-slate-900 mt-1">
              <span>Total Paid</span>
              <span className="text-indigo-400">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

        </div>
      )}

      {/* Redirect Options */}
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Link
          to="/"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-600/10 transition-all text-center text-sm"
        >
          Return Home
        </Link>
        <Link
          to="/orders"
          className="bg-slate-900 hover:bg-slate-950 text-slate-300 font-bold py-3 px-8 rounded-full border border-slate-800 hover:border-slate-700 transition-all text-center text-sm"
        >
          Track Order History
        </Link>
      </div>

    </div>
  );
};

export default OrderSuccess;
