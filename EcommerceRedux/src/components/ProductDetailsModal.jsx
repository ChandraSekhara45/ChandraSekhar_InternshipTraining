import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addReview } from '../redux/productsSlice';
import { addNotification } from '../redux/notificationSlice';
import { X, Heart, ShoppingBag, Star, Calendar } from 'lucide-react';

const ProductDetailsModal = ({ product, onClose, onAddToCart, isWishlisted, onToggleWishlist }) => {
  const dispatch = useDispatch();
  
  // Review form local state
  const [reviewUser, setReviewUser] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!product) return null;

  const { id, name, price, category, image, description, details, reviews = [], rating } = product;

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewUser.trim() || !reviewComment.trim()) {
      dispatch(addNotification({ text: 'Please fill in all review fields.', type: 'error' }));
      return;
    }

    dispatch(addReview({
      productId: id,
      user: reviewUser,
      rating: reviewRating,
      comment: reviewComment
    }));

    dispatch(addNotification({ text: 'Review submitted successfully!', type: 'success' }));
    
    // Clear form
    setReviewUser('');
    setReviewRating(5);
    setReviewComment('');
  };

  return (
    <div className="overlay" onClick={onClose} style={{ padding: '16px' }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ borderRadius: '0px', maxWidth: '900px' }}
      >
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="btn-icon" 
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            borderRadius: '0px',
            backgroundColor: 'var(--bg-secondary)'
          }}
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-2 gap-8" style={{ padding: '0px' }}>
          
          {/* Left Column: Product Image */}
          <div style={{
            position: 'relative',
            background: 'var(--bg-tertiary)',
            minHeight: '400px',
            display: 'flex'
          }}>
            <img 
              src={image} 
              alt={name} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(10%) contrast(102%)'
              }}
            />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.02)',
              pointerEvents: 'none'
            }} />
          </div>

          {/* Right Column: Information & Actions */}
          <div style={{ padding: '40px 40px 40px 0px', display: 'flex', flexDirection: 'column' }} className="modal-right-padding">
            {/* Category */}
            <div>
              <span className="badge" style={{ marginBottom: '12px' }}>{category}</span>
            </div>

            {/* Title */}
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '10px', lineHeight: 1.2 }}>
              {name}
            </h2>

            {/* Pricing and Star Rating */}
            <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
                ₹{price.toLocaleString()}
              </span>

              {rating > 0 ? (
                <div className="flex items-center gap-1">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        size={14} 
                        fill={s <= Math.round(rating) ? 'currentColor' : 'none'} 
                        className={s <= Math.round(rating) ? 'star-filled' : 'star-empty'} 
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, marginLeft: '4px' }}>{rating}</span>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>({reviews.length} reviews)</span>
                </div>
              ) : (
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>No reviews yet</span>
              )}
            </div>

            {/* Scrollable specs & reviews area */}
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '380px', paddingRight: '8px', marginBottom: '20px' }}>
              
              {/* Description */}
              <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.6 }}>
                {description}
              </p>

              {/* Specs List */}
              {details && details.length > 0 && (
                <div style={{ marginBottom: '28px' }}>
                  <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)', marginBottom: '10px' }}>
                    Specifications
                  </h4>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {details.map((spec, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>{spec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reviews List */}
              <div style={{ marginBottom: '28px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)', marginBottom: '16px' }}>
                  Customer Reviews ({reviews.length})
                </h4>

                {reviews.length === 0 ? (
                  <p className="text-muted" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
                    No reviews for this product. Be the first to share your thoughts.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                          <span className="font-semibold text-sm">{rev.user}</span>
                          <div className="flex items-center gap-2">
                            <div className="stars">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                  key={s} 
                                  size={10} 
                                  fill={s <= rev.rating ? 'currentColor' : 'none'} 
                                  className={s <= rev.rating ? 'star-filled' : 'star-empty'} 
                                />
                              ))}
                            </div>
                            <span className="text-muted flex items-center gap-1" style={{ fontSize: '0.75rem' }}>
                              <Calendar size={10} />
                              {rev.date}
                            </span>
                          </div>
                        </div>
                        <p className="text-secondary text-sm">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Write A Review Form */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)', marginBottom: '16px' }}>
                  Write a Review
                </h4>
                <form onSubmit={handleSubmitReview}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input 
                        type="text" 
                        value={reviewUser} 
                        onChange={(e) => setReviewUser(e.target.value)} 
                        placeholder="e.g. Liam N." 
                        className="form-input" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Rating</label>
                      <select 
                        value={reviewRating} 
                        onChange={(e) => setReviewRating(Number(e.target.value))} 
                        className="form-select"
                      >
                        <option value={5}>5 Stars (Excellent)</option>
                        <option value={4}>4 Stars (Very Good)</option>
                        <option value={3}>3 Stars (Average)</option>
                        <option value={2}>2 Stars (Poor)</option>
                        <option value={1}>1 Star (Unacceptable)</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Review comments</label>
                    <textarea 
                      rows={3} 
                      value={reviewComment} 
                      onChange={(e) => setReviewComment(e.target.value)} 
                      placeholder="Share your experience with this product..." 
                      className="form-input" 
                      style={{ resize: 'none', fontFamily: 'inherit' }}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-secondary w-full" style={{ fontSize: '0.7rem' }}>
                    Submit Review
                  </button>
                </form>
              </div>

            </div>

            {/* Quick Actions (Bottom) */}
            <div className="flex gap-3" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: 'auto' }}>
              <button 
                onClick={() => onAddToCart(product)}
                className="btn btn-primary flex-1"
                style={{ display: 'flex', itemsCenter: 'center', gap: '8px' }}
              >
                <ShoppingBag size={14} />
                <span>Add to Bag</span>
              </button>

              <button 
                onClick={() => onToggleWishlist(product.id)}
                className="btn btn-secondary"
                style={{ width: '48px', height: '48px', padding: 0 }}
              >
                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .modal-content {
            max-height: 95vh;
          }
          .grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
          .modal-right-padding {
            padding: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailsModal;
