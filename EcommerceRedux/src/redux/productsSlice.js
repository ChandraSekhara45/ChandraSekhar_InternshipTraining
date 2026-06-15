import { createSlice } from '@reduxjs/toolkit';

const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Aero ANC Headphones',
    price: 299,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'Ultra-lightweight active noise-cancelling headphones. Crafted with aerospace-grade aluminum and premium memory foam cups. Seamless multipoint Bluetooth connection.',
    details: [
      'Up to 40 hours of active listening time',
      'Custom 40mm titanium drivers',
      'Advanced hybrid feedback ANC',
      'USB-C ultra-fast charging (10 min = 5 hours)'
    ],
    reviews: [
      { id: 'rev-1', user: 'Julian V.', rating: 5, comment: 'The soundstage is wide and the dark aesthetic matches my desk setup perfectly.', date: '2026-06-01' },
      { id: 'rev-2', user: 'Clara M.', rating: 4, comment: 'Incredibly comfortable for 8+ hour work sessions. Noise cancellation is top tier.', date: '2026-06-03' }
    ],
    rating: 4.5
  },
  {
    id: 'prod-2',
    name: 'Horizon Chronograph',
    price: 450,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    description: 'A masterpiece of minimalism. Featuring a matte-grey brushed steel case, Swiss quartz movement, and an Italian full-grain black leather strap.',
    details: [
      'Water resistant up to 50 meters (5 ATM)',
      'Scratch-resistant sapphire crystal glass face',
      '40mm case diameter, 8mm thickness',
      '2-year international mechanism warranty'
    ],
    reviews: [
      { id: 'rev-3', user: 'Marcus T.', rating: 5, comment: 'Stark, minimal, perfect. Exactly what I wanted in a time piece.', date: '2026-05-28' }
    ],
    rating: 5.0
  },
  {
    id: 'prod-3',
    name: 'Ghost Mechanical Keyboard',
    price: 185,
    category: 'Tech',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    description: 'Hot-swappable 75% layout mechanical keyboard with silent linear switches. Elegant frosted glass base with subtle monochrome LED backlighting.',
    details: [
      'Double-shot PBT keycaps in shades of grey',
      'Custom pre-lubed silent linear switches',
      'USB-C and 2.4Ghz wireless connectivity',
      'Alnico plate-mounted stabilizers for solid sound'
    ],
    reviews: [
      { id: 'rev-4', user: 'Elena R.', rating: 5, comment: 'The typing feel is creamy and quiet. The LED glow underneath looks very high-end.', date: '2026-06-05' },
      { id: 'rev-5', user: 'David K.', rating: 3, comment: 'Good quality, but keycaps could have clearer legends.', date: '2026-06-08' }
    ],
    rating: 4.0
  },
  {
    id: 'prod-4',
    name: 'Mono Carbon Backpack',
    price: 220,
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    description: 'Waterproof commuter backpack featuring modern geometric lines. Crafted with carbon fiber reinforced Cordura fabric. Internal laptop sleeve protects up to 16” devices.',
    details: [
      '22L volume capacity with expandable rolltop',
      'YKK AquaGuard weather-resistant zippers',
      'Ergonomic air-mesh back cushion panels',
      'Concealed passport and travel wallet pocket'
    ],
    reviews: [
      { id: 'rev-6', user: 'Stefan W.', rating: 5, comment: 'Handles heavy downpours with ease. Everything stays bone dry inside.', date: '2026-06-04' }
    ],
    rating: 5.0
  },
  {
    id: 'prod-5',
    name: 'Cask Titanium Mug',
    price: 65,
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    description: 'Vacuum double-wall construction mug made from pure Japanese grade-1 titanium. Retains beverage temperature for hours while remaining cool to the touch.',
    details: [
      'Weighs only 118 grams',
      '350ml (12oz) volume capacity',
      'Foldable handles for ultimate packability',
      'Toxin-free, hypoallergenic and corrosion-resistant'
    ],
    reviews: [],
    rating: 0
  },
  {
    id: 'prod-6',
    name: 'Obelisk Desk Mat',
    price: 45,
    category: 'Office',
    image: 'https://images.unsplash.com/photo-1632292224971-0d45778bd364?auto=format&fit=crop&w=600&q=80',
    description: 'Reversible desk pad combining dark-charcoal merino wool felt on one side and premium anti-slip cork lining on the other. Protects and frames your workspace beautifully.',
    details: [
      'Dimensions: 900mm x 400mm x 4mm',
      'Water-repellent treatment on wool surface',
      'Eco-friendly, biodegradable materials',
      'Includes premium leather cable organizer strap'
    ],
    reviews: [
      { id: 'rev-7', user: 'Kenzo T.', rating: 4, comment: 'Makes the desk look incredibly clean. The wool feels premium, though it can slide slightly.', date: '2026-06-02' }
    ],
    rating: 4.0
  },
  {
    id: 'prod-7',
    name: 'Helix Modular Shelf',
    price: 135,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    description: 'Minimalist wall-mounted shelf constructed from powder-coated structural carbon steel. Interchangeable panel configurations to showcase your books and items.',
    details: [
      'Supports up to 25kg weight limit',
      'Easy modular anchor mounting system included',
      'Dimensions: 600mm width, 180mm depth',
      'Available in carbon black or concrete grey'
    ],
    reviews: [],
    rating: 0
  },
  {
    id: 'prod-8',
    name: 'Umbra Table Lamp',
    price: 195,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    description: 'Sculptural ambient light source. Featuring a solid black marble base, textured volcanic stone shaft, and a hand-blown frosted glass sphere diffuser.',
    details: [
      'G9 LED warm lightbulb included',
      'Stepless dimming control wheel on cord',
      '1.8m braided textile power cord',
      'Dimensions: 280mm height, 150mm base'
    ],
    reviews: [
      { id: 'rev-8', user: 'Arthur S.', rating: 5, comment: 'A gorgeous statement piece. The volcanic texture contrasted with light is stunning.', date: '2026-06-12' }
    ],
    rating: 5.0
  }
];

const loadProducts = () => {
  try {
    const data = localStorage.getItem('products');
    if (data) {
      return JSON.parse(data);
    }
    localStorage.setItem('products', JSON.stringify(MOCK_PRODUCTS));
    return MOCK_PRODUCTS;
  } catch (e) {
    return MOCK_PRODUCTS;
  }
};

const saveProducts = (products) => {
  localStorage.setItem('products', JSON.stringify(products));
};

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: loadProducts(),
    searchQuery: '',
    selectedCategory: 'All',
    selectedSort: 'featured',
    priceRange: [0, 600],
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedSort: (state, action) => {
      state.selectedSort = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: `prod-${Math.random().toString(36).substring(2, 9)}`,
        reviews: [],
        rating: 0
      };
      state.items.push(newProduct);
      saveProducts(state.items);
    },
    updateProduct: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload
        };
        saveProducts(state.items);
      }
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveProducts(state.items);
    },
    addReview: (state, action) => {
      const { productId, rating, comment, user } = action.payload;
      const product = state.items.find(item => item.id === productId);
      if (product) {
        const newReview = {
          id: `rev-${Math.random().toString(36).substring(2, 9)}`,
          user,
          rating: Number(rating),
          comment,
          date: new Date().toISOString().split('T')[0]
        };
        product.reviews.push(newReview);
        // Calculate new rating
        const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
        product.rating = parseFloat((totalRating / product.reviews.length).toFixed(1));
        saveProducts(state.items);
      }
    }
  }
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSelectedSort,
  setPriceRange,
  addProduct,
  updateProduct,
  deleteProduct,
  addReview
} = productsSlice.actions;

export default productsSlice.reducer;
