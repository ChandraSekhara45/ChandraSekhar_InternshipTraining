import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  removeFromCart, 
  updateQuantity, 
  applyPromoCode, 
  removePromoCode 
} from '../redux/cartSlice';
import { addNotification } from '../redux/notificationSlice';
import { X, Trash2, Plus, Minus, Tag } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, setCurrentTab }) => {
  const dispatch = useDispatch();
  const { items: cartItems, promoCode, discountPercent, promoError } = useSelector(state => state.cart);
  const [promoInput, setPromoInput] = useState('');

  if (!isOpen) return null;

  // Calculators
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = parseFloat(((subtotal * discountPercent) / 100).toFixed(2));
  const discountedSubtotal = subtotal - discountAmount;
  
  // Free shipping over $150
  const shipping = subtotal > 0 && discountedSubtotal < 150 ? 15 : 0;
  const tax = parseFloat(((discountedSubtotal * 8) / 100).toFixed(2));
  const total = parseFloat((discountedSubtotal + shipping + tax).toFixed(2));

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    dispatch(applyPromoCode(promoInput));
    setPromoInput('');
  };

  const handleQtyChange = (id, currentQty, amount) => {
    const nextQty = currentQty + amount;
    if (nextQty <= 0) {
      dispatch(removeFromCart(id));
      dispatch(addNotification({ text: 'Item removed from bag', type: 'info' }));
    } else {
      dispatch(updateQuantity({ id, quantity: nextQty }));
    }
  };

  const handleCheckoutClick = () => {
    onClose();
    setCurrentTab('checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-overlay" onClick={onClose} />

      {/* Drawer Body */}
      <div className="drawer glass">
        
        {/* Header */}
        <div className="flex items-center justify-between" style={{
          padding: '24px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1.1rem' }}>
            Shopping Bag ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
          </h3>
          <button onClick={onClose} className="btn-icon" style={{ borderRadius: '0px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }} className="flex flex-col gap-4">
          {cartItems.length === 0 ? (
            <div className="text-center" style={{ padding: '60px 0' }}>
              <p className="text-muted" style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
                Your bag is empty.
              </p>
              <button 
                onClick={() => { onClose(); setCurrentTab('catalog'); }} 
                className="btn btn-primary"
                style={{ fontSize: '0.7rem' }}
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-4" 
                style={{ 
                  borderBottom: '1px solid var(--border-color)', 
                  paddingBottom: '16px' 
                }}
              >
                {/* Thumb */}
                <div style={{
                  width: '70px',
                  height: '75px',
                  background: 'var(--bg-tertiary)',
                  flexShrink: 0
                }}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(10%)' }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3, marginBottom: '2px' }}>
                      {item.name}
                    </h4>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{item.category}</span>
                  </div>

                  <div className="flex items-center justify-between" style={{ marginTop: '8px' }}>
                    {/* Qty Adjustment */}
                    <div className="flex items-center" style={{ border: '1px solid var(--border-color)' }}>
                      <button 
                        onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                        style={{ padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-sm font-semibold" style={{ minWidth: '24px', textAlign: 'center', fontSize: '0.8rem' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                        style={{ padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <Plus size={10} />
                      </button>
                    </div>

                    {/* Price */}
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', fontFamily: "'Outfit', sans-serif" }}>
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Remove Trash Button */}
                <button 
                  onClick={() => {
                    dispatch(removeFromCart(item.id));
                    dispatch(addNotification({ text: `${item.name} removed`, type: 'info' }));
                  }}
                  style={{ alignSelf: 'flex-start', cursor: 'pointer', color: 'var(--text-muted)' }}
                  className="hover:text-primary"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Checkout Calculations (Footer panel) */}
        {cartItems.length > 0 && (
          <div style={{
            borderTop: '1px solid var(--border-color)',
            padding: '24px',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2" style={{ marginBottom: '16px' }}>
              <input 
                type="text" 
                placeholder="PROMO CODE (e.g. MINIMALIST10)" 
                value={promoInput} 
                onChange={(e) => setPromoInput(e.target.value)} 
                className="form-input" 
                style={{ padding: '8px 12px', fontSize: '0.75rem', flex: 1 }}
              />
              <button type="submit" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>
                Apply
              </button>
            </form>

            {/* Promo Errors/Status */}
            {promoError && (
              <p className="text-sm" style={{ color: 'var(--danger-color)', marginTop: '-12px', marginBottom: '12px', fontSize: '0.75rem' }}>
                {promoError}
              </p>
            )}

            {promoCode && (
              <div className="flex items-center justify-between" style={{
                backgroundColor: 'var(--bg-tertiary)',
                padding: '6px 12px',
                border: '1px dashed var(--text-muted)',
                marginBottom: '16px'
              }}>
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Tag size={12} />
                  {promoCode} ({discountPercent}% OFF)
                </span>
                <button 
                  type="button" 
                  onClick={() => dispatch(removePromoCode())}
                  style={{ cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                  className="hover:text-primary"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="flex flex-col gap-2" style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
              <div className="flex justify-between text-secondary">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              
              {discountPercent > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-secondary">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between text-secondary">
                <span>Estimated Tax (8%)</span>
                <span>${tax.toLocaleString()}</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />

              <div className="flex justify-between" style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ fontFamily: "'Outfit', sans-serif" }}>${total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={handleCheckoutClick}
              className="btn btn-primary w-full"
              style={{ padding: '14px', fontSize: '0.8rem' }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default CartDrawer;
