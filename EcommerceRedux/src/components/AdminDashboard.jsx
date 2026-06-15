import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, updateProduct, deleteProduct } from '../redux/productsSlice';
import { addNotification } from '../redux/notificationSlice';
import { Plus, Edit3, Trash2, X, PlusCircle } from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.items);
  const formRef = useRef(null);

  // Form local state
  const [editingId, setEditingId] = useState(null);
  const [formFields, setFormFields] = useState({
    name: '',
    price: '',
    category: 'Tech',
    image: '',
    description: '',
    detailsText: ''
  });

  const categories = ['Audio', 'Accessories', 'Tech', 'Lifestyle', 'Home', 'Office'];

  const resetForm = () => {
    setEditingId(null);
    setFormFields({
      name: '',
      price: '',
      category: 'Tech',
      image: '',
      description: '',
      detailsText: ''
    });
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setFormFields({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      description: product.description,
      detailsText: product.details ? product.details.join('\n') : ''
    });
    
    // Smooth scroll to form
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteClick = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      dispatch(deleteProduct(id));
      dispatch(addNotification({ text: `Deleted "${name}"`, type: 'info' }));
      if (editingId === id) resetForm();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, price, category, image, description, detailsText } = formFields;

    if (!name.trim() || !price || !image.trim() || !description.trim()) {
      dispatch(addNotification({ text: 'Please fill in all required fields.', type: 'error' }));
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      dispatch(addNotification({ text: 'Please enter a valid positive price.', type: 'error' }));
      return;
    }

    const detailsArray = detailsText
      .split('\n')
      .map(item => item.trim())
      .filter(item => item !== '');

    const productPayload = {
      name: name.trim(),
      price: priceNum,
      category,
      image: image.trim(),
      description: description.trim(),
      details: detailsArray
    };

    if (editingId) {
      // Dispatch edit
      dispatch(updateProduct({ id: editingId, ...productPayload }));
      dispatch(addNotification({ text: `Updated "${name}" successfully`, type: 'success' }));
    } else {
      // Dispatch add
      dispatch(addProduct(productPayload));
      dispatch(addNotification({ text: `Added "${name}" to catalog`, type: 'success' }));
    }

    resetForm();
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      
      {/* Intro Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Product Studio
        </h1>
        <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
          Add, edit, or remove catalog items. All updates reflect instantly in the catalog.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8" style={{ alignItems: 'flex-start' }}>
        
        {/* Left Side: Product Editor Form (1 Column) */}
        <div 
          ref={formRef}
          style={{
            border: '1px solid var(--border-color)',
            padding: '32px',
            backgroundColor: 'var(--bg-secondary)'
          }}
          className="admin-form-container"
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
            <h3 style={{ textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.15em', fontWeight: 600, margin: 0 }}>
              {editingId ? 'Edit Product' : 'Create Product'}
            </h3>
            {editingId && (
              <button 
                onClick={resetForm}
                className="text-muted hover:text-primary flex items-center gap-1"
                style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' }}
              >
                <X size={12} /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input 
                type="text" 
                value={formFields.name}
                onChange={(e) => setFormFields(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Minimal desk shelf"
                className="form-input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4" style={{ margin: 0, padding: 0 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Price ($) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formFields.price}
                  onChange={(e) => setFormFields(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g. 120"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Category *</label>
                <select 
                  value={formFields.category}
                  onChange={(e) => setFormFields(prev => ({ ...prev, category: e.target.value }))}
                  className="form-select"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label className="form-label">Image URL *</label>
              <input 
                type="url" 
                value={formFields.image}
                onChange={(e) => setFormFields(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea 
                rows={3}
                value={formFields.description}
                onChange={(e) => setFormFields(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Write a brief product description..."
                className="form-input"
                style={{ resize: 'none', fontFamily: 'inherit' }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Specifications (one per line)</label>
              <textarea 
                rows={3}
                value={formFields.detailsText}
                onChange={(e) => setFormFields(prev => ({ ...prev, detailsText: e.target.value }))}
                placeholder="e.g. Weight: 200g&#10;Dimensions: 30cm x 15cm"
                className="form-input"
                style={{ resize: 'none', fontFamily: 'inherit' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full"
              style={{ padding: '14px', fontSize: '0.75rem', marginTop: '10px' }}
            >
              {editingId ? 'Update Product' : 'Add to Catalog'}
            </button>
          </form>
        </div>

        {/* Right Side: Product Inventory List (2 Columns) */}
        <div style={{ gridColumn: 'span 2' }} className="admin-inventory-container">
          <div style={{ 
            border: '1px solid var(--border-color)', 
            padding: '32px',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            <h3 style={{ textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.15em', marginBottom: '24px', fontWeight: 600 }}>
              Inventory List ({products.length})
            </h3>

            {products.length === 0 ? (
              <p className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
                No products in store inventory. Create a new product to begin.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {products.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-4 justify-between"
                    style={{ 
                      paddingBottom: '16px', 
                      borderBottom: '1px solid var(--border-color)' 
                    }}
                  >
                    
                    {/* Thumbnail & Title */}
                    <div className="flex items-center gap-4" style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        background: 'var(--bg-tertiary)',
                        flexShrink: 0
                      }}>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }}
                        />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ 
                          fontSize: '0.9rem', 
                          fontWeight: 600, 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis' 
                        }}>
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2" style={{ marginTop: '2px' }}>
                          <span className="badge" style={{ fontSize: '0.55rem', padding: '1px 4px' }}>{item.category}</span>
                          <span className="font-semibold text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            ${item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditClick(item)}
                        className="btn btn-secondary"
                        style={{ padding: '8px 12px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Edit Product"
                      >
                        <Edit3 size={12} />
                        <span className="hide-tablet">Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(item.id, item.name)}
                        className="btn btn-secondary"
                        style={{ padding: '8px 12px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--danger-color)', borderColor: 'var(--border-color)' }}
                        title="Delete Product"
                      >
                        <Trash2 size={12} />
                        <span className="hide-tablet">Delete</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .grid-cols-3 {
            grid-template-columns: 1fr !important;
          }
          .admin-form-container {
            grid-column: span 3 !important;
          }
          .admin-inventory-container {
            grid-column: span 3 !important;
          }
        }
        @media (max-width: 600px) {
          .hide-tablet {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
