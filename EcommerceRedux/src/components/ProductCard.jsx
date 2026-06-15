import React from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';

const ProductCard = ({ product, onViewDetails, isWishlisted, onToggleWishlist, onAddToCart }) => {
  const { name, price, category, image, rating, reviews } = product;

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Image Container with Hover Zoom & Heart Button */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-tertiary)',
        paddingBottom: '110%', /* 1.1 aspect ratio */
        width: '100%',
        cursor: 'pointer'
      }} onClick={() => onViewDetails(product)}>
        
        <img 
          src={image} 
          alt={name} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(20%) contrast(105%)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="product-card-image"
        />

        {/* Gray Hover Tint */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.03)',
          pointerEvents: 'none'
        }} />

        {/* Wishlist Heart Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="btn-icon"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            borderRadius: '0px',
            width: '36px',
            height: '36px',
            zIndex: 10,
            backgroundColor: isWishlisted ? 'var(--text-primary)' : 'var(--glass-bg)',
            color: isWishlisted ? 'var(--bg-primary)' : 'var(--text-primary)',
            borderColor: 'var(--glass-border)'
          }}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content Container */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>
        {/* Category & Rating */}
        <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
          <span className="badge" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>{category}</span>
          
          {rating > 0 ? (
            <div className="flex items-center gap-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              <Star size={12} fill="currentColor" className="star-filled" />
              <span>{rating}</span>
              <span className="text-muted" style={{ fontWeight: 400 }}>({reviews?.length || 0})</span>
            </div>
          ) : (
            <span className="text-muted" style={{ fontSize: '0.7rem' }}>No reviews</span>
          )}
        </div>

        {/* Product Name */}
        <h3 
          onClick={() => onViewDetails(product)}
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.4,
            marginBottom: '6px',
            cursor: 'pointer',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            height: '2.8em',
            transition: 'color 0.2s ease'
          }}
          className="product-name-hover"
        >
          {name}
        </h3>

        {/* Pricing & Bag Action */}
        <div className="flex items-center justify-between" style={{ marginTop: 'auto', paddingTop: '12px' }}>
          <span className="font-bold text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>
            ₹{price.toLocaleString()}
          </span>

          <button
            onClick={() => onAddToCart(product)}
            className="btn btn-secondary"
            style={{
              padding: '8px 12px',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShoppingBag size={12} />
            <span>Add</span>
          </button>
        </div>
      </div>

      <style>{`
        .card:hover .product-card-image {
          transform: scale(1.06);
        }
        .product-name-hover:hover {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
