import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { addNotification } from '../redux/notificationSlice';
import { ShoppingBag, ArrowLeft, ShieldCheck, Check } from 'lucide-react';

const CheckoutForm = ({ setCurrentTab }) => {
  const dispatch = useDispatch();
  const { items: cartItems, promoCode, discountPercent } = useSelector(state => state.cart);

  // Address inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });

  // Success modal receipt details
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = parseFloat(((subtotal * discountPercent) / 100).toFixed(2));
  const discountedSubtotal = subtotal - discountAmount;
  const shipping = subtotal > 0 && discountedSubtotal < 15000 ? 1000 : 0;
  const tax = parseFloat(((discountedSubtotal * 8) / 100).toFixed(2));
  const total = parseFloat((discountedSubtotal + shipping + tax).toFixed(2));

  // If cart is empty and not showing receipt, show redirect state
  if (cartItems.length === 0 && !showReceipt) {
    return (
      <div className="container text-center" style={{ padding: '80px 24px' }}>
        <ShoppingBag size={48} style={{ marginBottom: '24px', color: 'var(--text-muted)' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '12px' }}>Your shopping bag is empty</h2>
        <p className="text-secondary" style={{ marginBottom: '28px', maxWidth: '400px', marginInline: 'auto' }}>
          Please add items to your cart from our catalog before proceeding to checkout.
        </p>
        <button onClick={() => setCurrentTab('catalog')} className="btn btn-primary">
          Explore Catalog
        </button>
      </div>
    );
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    // Basic validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.address.trim() || !formData.city.trim() || !formData.zip.trim()) {
      dispatch(addNotification({ text: 'Please complete all shipping address fields.', type: 'error' }));
      return;
    }
    if (!formData.cardNumber.trim() || !formData.cardExpiry.trim() || !formData.cardCvc.trim()) {
      dispatch(addNotification({ text: 'Please complete all payment details.', type: 'error' }));
      return;
    }

    // Generate mock order details
    const orderId = `ONX-${Math.floor(Math.random() * 900000) + 100000}`;
    const orderReceipt = {
      orderId,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      customerName: formData.name,
      customerEmail: formData.email,
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}`,
      items: [...cartItems],
      subtotal,
      discountAmount,
      shipping,
      tax,
      total,
      promoCode
    };

    setReceiptData(orderReceipt);
    setShowReceipt(true);

    // Empty cart and notify
    dispatch(clearCart());
    dispatch(addNotification({ text: 'Order processed successfully!', type: 'success' }));
  };

  if (showReceipt && receiptData) {
    return (
      <div className="overlay" style={{ padding: '24px', overflowY: 'auto' }}>
        <div className="modal-content" style={{ 
          maxWidth: '540px', 
          borderRadius: '0px', 
          backgroundColor: 'var(--bg-primary)',
          padding: '40px'
        }}>
          
          {/* Header checkmark */}
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '2px solid var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              backgroundColor: 'var(--text-primary)',
              color: 'var(--bg-primary)'
            }}>
              <Check size={32} strokeWidth={3} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Order Confirmed
            </h2>
            <p className="text-secondary" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
              Thank you for your purchase. Your receipt details are listed below.
            </p>
          </div>

          {/* Receipt Info */}
          <div style={{
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            padding: '24px',
            fontSize: '0.8rem',
            marginBottom: '32px'
          }}>
            <div className="flex justify-between" style={{ marginBottom: '12px' }}>
              <span className="text-muted">Order ID:</span>
              <span className="font-semibold">{receiptData.orderId}</span>
            </div>
            <div className="flex justify-between" style={{ marginBottom: '12px' }}>
              <span className="text-muted">Date:</span>
              <span>{receiptData.date}</span>
            </div>
            <div className="flex justify-between" style={{ marginBottom: '12px' }}>
              <span className="text-muted">Customer Name:</span>
              <span>{receiptData.customerName}</span>
            </div>
            <div className="flex justify-between" style={{ marginBottom: '12px' }}>
              <span className="text-muted">Email:</span>
              <span>{receiptData.customerEmail}</span>
            </div>
            <div style={{ marginBottom: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <span className="text-muted" style={{ display: 'block', marginBottom: '4px' }}>Ship To:</span>
              <span style={{ display: 'block', lineHeight: 1.4 }}>{receiptData.shippingAddress}</span>
            </div>

            {/* Receipt Items list */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginBottom: '16px' }}>
              <span className="text-muted" style={{ display: 'block', marginBottom: '8px' }}>Purchased Items:</span>
              <div className="flex flex-col gap-2">
                {receiptData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span>{item.name} <span className="text-muted">x{item.quantity}</span></span>
                    <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Receipt Cost Breakdown */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <div className="flex justify-between text-secondary" style={{ marginBottom: '4px' }}>
                <span>Subtotal:</span>
                <span>₹{receiptData.subtotal.toLocaleString()}</span>
              </div>
              {receiptData.discountAmount > 0 && (
                <div className="flex justify-between text-secondary" style={{ marginBottom: '4px' }}>
                  <span>Promo Discount ({receiptData.promoCode}):</span>
                  <span>-₹{receiptData.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-secondary" style={{ marginBottom: '4px' }}>
                <span>Shipping:</span>
                <span>{receiptData.shipping === 0 ? 'FREE' : `₹${receiptData.shipping.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-secondary" style={{ marginBottom: '8px' }}>
                <span>Tax (8%):</span>
                <span>₹{receiptData.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-base" style={{ fontSize: '0.95rem', borderTop: '1px dashed var(--border-color)', paddingTop: '8px' }}>
                <span>Amount Paid:</span>
                <span>₹{receiptData.total.toLocaleString()}</span>
              </div>
            </div>

          </div>

          {/* Action button */}
          <button 
            onClick={() => {
              setShowReceipt(false);
              setReceiptData(null);
              setCurrentTab('catalog');
            }}
            className="btn btn-primary w-full"
            style={{ padding: '14px', fontSize: '0.75rem' }}
          >
            Continue Shopping
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      
      {/* Back to Catalog Link */}
      <button 
        onClick={() => setCurrentTab('catalog')} 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '32px',
          cursor: 'pointer',
          color: 'var(--text-secondary)'
        }}
        className="hover:text-primary"
      >
        <ArrowLeft size={14} />
        <span>Back to catalog</span>
      </button>

      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Checkout
        </h1>
        <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
          Please complete your delivery details and payment below.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-3 gap-8" style={{ alignItems: 'flex-start' }}>
        
        {/* Left Form (2 Columns width) */}
        <div style={{ gridColumn: 'span 2' }} className="checkout-fields-span">
          
          {/* Shipping Address */}
          <div style={{ 
            border: '1px solid var(--border-color)', 
            padding: '32px',
            backgroundColor: 'var(--bg-secondary)',
            marginBottom: '24px'
          }}>
            <h3 style={{ textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.15em', marginBottom: '24px', fontWeight: 600 }}>
              1. Delivery Information
            </h3>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className="form-input" 
                placeholder="e.g. Alexander Mercer" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                className="form-input" 
                placeholder="e.g. alexander@example.com" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                className="form-input" 
                placeholder="e.g. 742 Evergreen Terrace" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4" style={{ margin: 0, padding: 0 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">City</label>
                <input 
                  type="text" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  placeholder="e.g. Springfield" 
                  required 
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Postal / Zip Code</label>
                <input 
                  type="text" 
                  name="zip" 
                  value={formData.zip} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  placeholder="e.g. 90210" 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div style={{ 
            border: '1px solid var(--border-color)', 
            padding: '32px',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
              <h3 style={{ textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.15em', fontWeight: 600, margin: 0 }}>
                2. Payment Details
              </h3>
              <span className="flex items-center gap-1 text-muted" style={{ fontSize: '0.75rem' }}>
                <ShieldCheck size={14} /> Secure Encryption
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Credit Card Number</label>
              <input 
                type="text" 
                name="cardNumber" 
                maxLength="19"
                value={formData.cardNumber} 
                onChange={handleInputChange} 
                className="form-input" 
                placeholder="•••• •••• •••• ••••" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4" style={{ margin: 0, padding: 0 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Expiry Date</label>
                <input 
                  type="text" 
                  name="cardExpiry" 
                  maxLength="5"
                  value={formData.cardExpiry} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  placeholder="MM/YY" 
                  required 
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">CVC / Security Code</label>
                <input 
                  type="password" 
                  name="cardCVC" 
                  maxLength="3"
                  value={formData.cardCvc} 
                  onChange={(e) => setFormData(prev => ({ ...prev, cardCvc: e.target.value }))} 
                  className="form-input" 
                  placeholder="•••" 
                  required 
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Summary (1 Column width) */}
        <div style={{ 
          border: '1px solid var(--border-color)', 
          padding: '32px',
          backgroundColor: 'var(--bg-secondary)',
          position: 'sticky',
          top: '110px'
        }} className="checkout-summary-span">
          <h3 style={{ textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.15em', marginBottom: '24px', fontWeight: 600 }}>
            Order Summary
          </h3>

          {/* List items */}
          <div className="flex flex-col gap-3" style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '24px', paddingRight: '4px' }}>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start" style={{ fontSize: '0.8rem' }}>
                <div style={{ flex: 1, paddingRight: '8px' }}>
                  <span className="font-semibold" style={{ display: 'block' }}>{item.name}</span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>Qty: {item.quantity} × ₹{item.price.toLocaleString()}</span>
                </div>
                <span className="font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginBottom: '16px' }} />

          {/* Costs */}
          <div className="flex flex-col gap-2" style={{ fontSize: '0.85rem', marginBottom: '24px' }}>
            <div className="flex justify-between text-secondary">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-secondary">
                <span>Promo Discount</span>
                <span>-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-secondary">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Estimated Tax (8%)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px dashed var(--border-color)', margin: '8px 0' }} />
            <div className="flex justify-between" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              <span>Total Price</span>
              <span style={{ fontFamily: "'Outfit', sans-serif" }}>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full"
            style={{ padding: '14px', fontSize: '0.8rem' }}
          >
            Submit Order
          </button>
        </div>

      </form>

      <style>{`
        @media (max-width: 900px) {
          .grid-cols-3 {
            grid-template-columns: 1fr !important;
          }
          .checkout-fields-span {
            grid-column: span 3 !important;
          }
          .checkout-summary-span {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutForm;
