import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice';
import { ShoppingBag, Heart, Sun, Moon, Settings, Compass } from 'lucide-react';

const Navbar = ({ currentTab, setCurrentTab, onOpenCart }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const wishlistItems = useSelector(state => state.wishlist.items);
  const themeMode = useSelector(state => state.theme.mode);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <header className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-color)',
      padding: '16px 0',
      transition: 'background-color 0.3s ease'
    }}>
      <div className="container flex items-center justify-between">
        
        {/* Navigation Tabs (Left) */}
        <nav className="flex items-center gap-6" style={{ flex: 1 }}>
          <button 
            onClick={() => setCurrentTab('catalog')}
            className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider hover:text-primary transition`}
            style={{ 
              color: currentTab === 'catalog' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: currentTab === 'catalog' ? '2px solid var(--text-primary)' : '2px solid transparent',
              paddingBottom: '4px',
              cursor: 'pointer'
            }}
          >
            <Compass size={16} />
            <span className="hide-mobile">Catalog</span>
          </button>
          
          <button 
            onClick={() => setCurrentTab('wishlist')}
            className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider hover:text-primary transition`}
            style={{ 
              color: currentTab === 'wishlist' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: currentTab === 'wishlist' ? '2px solid var(--text-primary)' : '2px solid transparent',
              paddingBottom: '4px',
              cursor: 'pointer'
            }}
          >
            <Heart size={16} />
            <span className="hide-mobile">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="badge" style={{ padding: '2px 6px', fontSize: '10px', marginLeft: '2px' }}>
                {wishlistCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setCurrentTab('admin')}
            className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider hover:text-primary transition`}
            style={{ 
              color: currentTab === 'admin' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: currentTab === 'admin' ? '2px solid var(--text-primary)' : '2px solid transparent',
              paddingBottom: '4px',
              cursor: 'pointer'
            }}
          >
            <Settings size={16} />
            <span className="hide-mobile">Studio</span>
          </button>
        </nav>

        {/* Typographic Logo (Center) */}
        <div style={{
          textAlign: 'center',
          flex: 'none'
        }}>
          <button 
            onClick={() => setCurrentTab('catalog')}
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.75rem',
              fontWeight: 700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            ONYX
          </button>
        </div>

        {/* Right Settings */}
        <div className="flex items-center gap-3" style={{ flex: 1, justifyContent: 'flex-end' }}>
          
          {/* Theme Toggle Button */}
          <button 
            onClick={() => dispatch(toggleTheme())}
            className="btn-icon"
            title={`Toggle Theme`}
          >
            {themeMode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Cart Trigger */}
          <button 
            onClick={onOpenCart}
            className="btn-icon"
            title="Open Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span 
                className="badge" 
                style={{ 
                  position: 'absolute', 
                  top: '-6px', 
                  right: '-6px', 
                  backgroundColor: 'var(--text-primary)', 
                  color: 'var(--bg-primary)',
                  borderRadius: '0%',
                  padding: '2px 6px',
                  fontSize: '9px',
                  fontWeight: 800,
                  border: 'none'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>

      <style>{`
        @media (max-width: 600px) {
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
