import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setSearchQuery, 
  setSelectedCategory, 
  setSelectedSort, 
  setPriceRange 
} from './redux/productsSlice';
import { addToCart } from './redux/cartSlice';
import { toggleWishlist } from './redux/wishlistSlice';
import { addNotification } from './redux/notificationSlice';

// Components
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import CheckoutForm from './components/CheckoutForm';
import AdminDashboard from './components/AdminDashboard';
import ToastContainer from './components/ToastContainer';

// Icons
import { Search, SlidersHorizontal, Heart, ShoppingBag, RefreshCw, X } from 'lucide-react';

function App() {
  const dispatch = useDispatch();

  // Tab State: 'catalog' | 'wishlist' | 'admin' | 'checkout'
  const [currentTab, setCurrentTab] = useState('catalog');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Redux Selectors
  const themeMode = useSelector(state => state.theme.mode);
  const products = useSelector(state => state.products.items);
  const searchQuery = useSelector(state => state.products.searchQuery);
  const selectedCategory = useSelector(state => state.products.selectedCategory);
  const selectedSort = useSelector(state => state.products.selectedSort);
  const priceRange = useSelector(state => state.products.priceRange);
  
  const wishlistItems = useSelector(state => state.wishlist.items);
  const cartItems = useSelector(state => state.cart.items);

  // Sync theme to root DOM node
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  // Categories list
  const categories = ['All', 'Audio', 'Accessories', 'Tech', 'Lifestyle', 'Home', 'Office'];

  // Reset all catalog filters
  const handleResetFilters = () => {
    dispatch(setSearchQuery(''));
    dispatch(setSelectedCategory('All'));
    dispatch(setSelectedSort('featured'));
    dispatch(setPriceRange([0, 60000]));
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    if (selectedSort === 'price-asc') return a.price - b.price;
    if (selectedSort === 'price-desc') return b.price - a.price;
    if (selectedSort === 'rating') return b.rating - a.rating;
    return 0; // 'featured' keeps original order
  });

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(addNotification({ text: `Added "${product.name}" to bag`, type: 'success' }));
  };

  const handleToggleWishlist = (id) => {
    dispatch(toggleWishlist(id));
    const isNowWishlisted = !wishlistItems.includes(id);
    dispatch(addNotification({ 
      text: isNowWishlisted ? 'Added to wishlist' : 'Removed from wishlist', 
      type: 'info' 
    }));
  };

  // Render the current view based on tab state
  const renderMainContent = () => {
    switch (currentTab) {
      case 'wishlist':
        return renderWishlistView();
      case 'admin':
        return <AdminDashboard />;
      case 'checkout':
        return <CheckoutForm setCurrentTab={setCurrentTab} />;
      case 'catalog':
      default:
        return renderCatalogView();
    }
  };

  // Catalog View
  const renderCatalogView = () => {
    return (
      <>
        {/* Typographic Hero Banner */}
        <section style={{
          padding: '80px 0 60px',
          borderBottom: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div className="container">
            <span className="badge badge-outline" style={{ marginBottom: '16px' }}>Volume 01 // Selected Gear</span>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              maxWidth: '850px',
              marginInline: 'auto',
              marginBottom: '20px'
            }}>
              Designed for the Essentialist.
            </h1>
            <p className="text-secondary" style={{
              maxWidth: '560px',
              marginInline: 'auto',
              fontSize: '1rem',
              lineHeight: 1.6
            }}>
              A curated collection of monochromatic tech, audio, and desk utilities designed to streamline your daily workflow and space.
            </p>
          </div>
        </section>

        {/* Toolbar & Filters Section */}
        <section style={{ borderBottom: '1px solid var(--border-color)', padding: '20px 0', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="container flex flex-col gap-4">
            
            {/* Main Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              
              {/* Category Toggles (Inline list) */}
              <div className="flex items-center gap-2 flex-wrap" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => dispatch(setSelectedCategory(cat))}
                    className="btn"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      backgroundColor: selectedCategory === cat ? 'var(--text-primary)' : 'transparent',
                      color: selectedCategory === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      border: selectedCategory === cat ? '1px solid var(--text-primary)' : '1px solid var(--border-color)'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Action buttons (Search & Sort) */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`btn btn-secondary ${showFilters ? 'active' : ''}`}
                  style={{ display: 'flex', itemsCenter: 'center', gap: '8px', fontSize: '0.65rem', padding: '10px 16px' }}
                >
                  <SlidersHorizontal size={12} />
                  <span>Filters</span>
                </button>

                <select
                  value={selectedSort}
                  onChange={(e) => dispatch(setSelectedSort(e.target.value))}
                  className="form-select"
                  style={{ width: '180px', padding: '10px 32px 10px 16px', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

            </div>

            {/* Extended Filters Pane (Slide down/Conditional) */}
            {showFilters && (
              <div style={{
                paddingTop: '20px',
                borderTop: '1px solid var(--border-color)',
                animation: 'fadeIn 0.2s ease'
              }} className="grid grid-cols-3 gap-6">
                
                {/* Search query input */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Search catalog</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="Type keywords..."
                      value={searchQuery}
                      onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                      className="form-input"
                      style={{ paddingLeft: '40px', fontSize: '0.8rem' }}
                    />
                    <Search size={14} className="text-muted" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* Price Slider */}
                <div className="form-group" style={{ margin: 0 }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
                    <label className="form-label" style={{ margin: 0 }}>Price Range</label>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="60000" 
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => dispatch(setPriceRange([priceRange[0], Number(e.target.value)]))}
                    style={{
                      width: '100%',
                      accentColor: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  />
                  <div className="flex justify-between" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>₹0</span>
                    <span>₹60,000</span>
                  </div>
                </div>

                {/* Active Filter status details & Reset */}
                <div className="flex flex-col justify-end" style={{ paddingBottom: '4px' }}>
                  <button 
                    onClick={handleResetFilters}
                    className="btn btn-secondary w-full"
                    style={{ display: 'flex', alignItems: 'center', justifyCenter: 'center', gap: '8px', fontSize: '0.65rem', padding: '10px' }}
                  >
                    <RefreshCw size={12} />
                    <span>Reset All Filters</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </section>

        {/* Product Catalog Grid */}
        <section style={{ padding: '60px 0 80px' }}>
          <div className="container">
            {filteredProducts.length === 0 ? (
              <div className="text-center" style={{ padding: '80px 0' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>No items match your filters</h3>
                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '20px' }}>Try resetting filters or adjusting search text.</p>
                <button onClick={handleResetFilters} className="btn btn-primary" style={{ fontSize: '0.7rem' }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onViewDetails={(prod) => setSelectedProduct(prod)}
                    isWishlisted={wishlistItems.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </>
    );
  };

  // Wishlist View
  const renderWishlistView = () => {
    const wishlistedProducts = products.filter(p => wishlistItems.includes(p.id));

    return (
      <section style={{ padding: '60px 0 80px' }}>
        <div className="container">
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Your Wishlist
            </h1>
            <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
              Saved products and accessories.
            </p>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="text-center" style={{ padding: '80px 0', border: '1px dashed var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
              <Heart size={36} style={{ marginBottom: '16px', color: 'var(--text-muted)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>Your wishlist is empty</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '20px' }}>Tap the heart button on items you like to save them here.</p>
              <button onClick={() => setCurrentTab('catalog')} className="btn btn-primary" style={{ fontSize: '0.7rem' }}>
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {wishlistedProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onViewDetails={(prod) => setSelectedProduct(prod)}
                  isWishlisted={true}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  // Helper selector for detail modal wishlisted status
  const isSelectedProductWishlisted = selectedProduct ? wishlistItems.includes(selectedProduct.id) : false;
  // Dynamic fetch of current modal product details to reflect live reviews addition
  const activeModalProduct = selectedProduct ? products.find(p => p.id === selectedProduct.id) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Sticky Premium Navbar */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      {/* Main Core View Area */}
      <main style={{ flexGrow: 1 }}>
        {renderMainContent()}
      </main>

      {/* Toast alert system container */}
      <ToastContainer />

      {/* Side Shopping Bag Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        setCurrentTab={setCurrentTab} 
      />

      {/* Product Information Overlay Modal */}
      {activeModalProduct && (
        <ProductDetailsModal 
          product={activeModalProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={handleAddToCart}
          isWishlisted={isSelectedProductWishlisted}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* Premium Stark Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '60px 0 40px',
        backgroundColor: 'var(--bg-secondary)',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)'
      }}>
        <div className="container flex justify-between flex-wrap gap-8">
          
          <div style={{ maxWidth: '300px' }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.2rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              display: 'block',
              marginBottom: '12px'
            }}>
              ONYX
            </span>
            <p className="text-muted" style={{ lineHeight: 1.6 }}>
              A premium, monochromatic hardware platform. Exploring design, typography, utility, and state systems.
            </p>
          </div>

          <div className="flex gap-16 flex-wrap">
            <div>
              <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
                Collection
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }} className="flex flex-col gap-2">
                <li><button onClick={() => { setCurrentTab('catalog'); dispatch(setSelectedCategory('Audio')); }} style={{ cursor: 'pointer', textAlign: 'left' }} className="hover:text-primary">Audio gear</button></li>
                <li><button onClick={() => { setCurrentTab('catalog'); dispatch(setSelectedCategory('Tech')); }} style={{ cursor: 'pointer', textAlign: 'left' }} className="hover:text-primary">Tech components</button></li>
                <li><button onClick={() => { setCurrentTab('catalog'); dispatch(setSelectedCategory('Accessories')); }} style={{ cursor: 'pointer', textAlign: 'left' }} className="hover:text-primary">Lifestyle tools</button></li>
              </ul>
            </div>

            <div>
              <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
                Studio
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }} className="flex flex-col gap-2">
                <li><button onClick={() => setCurrentTab('admin')} style={{ cursor: 'pointer', textAlign: 'left' }} className="hover:text-primary">Product studio</button></li>
                <li><button onClick={() => setCurrentTab('wishlist')} style={{ cursor: 'pointer', textAlign: 'left' }} className="hover:text-primary">Wishlist index</button></li>
                <li><button onClick={() => { setCurrentTab('catalog'); handleResetFilters(); }} style={{ cursor: 'pointer', textAlign: 'left' }} className="hover:text-primary">Clear state</button></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="container" style={{ marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <span className="text-muted">© 2026 ONYX Studio. Crafted in Pure Monochrome. No Backend.</span>
            <div className="flex gap-4">
              <span className="text-muted">React 19 + Redux Toolkit</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
