# 🎓 ChandraSekhar Internship Training Repository

Welcome to the **ChandraSekhar Internship Training** repository. This workspace hosts a collection of modern, feature-rich web applications built to showcase advanced styling, robust state management, responsive designs, and clean API integrations.

---

## 📂 Repository Structure

The repository is organized into distinct project directories, each serving a specific set of learning objectives and technical specifications:

```text
ChandraSekhar_InternshipTraining/
├── 🛍️ EcommerceRedux/           # React 19 + Redux Toolkit Monochromatic E-commerce App
│   ├── src/
│   │   ├── components/         # Modular React views (Cart, Checkout, Admin, Navbar, etc.)
│   │   ├── redux/              # Redux slices (cart, notifications, products, wishlist, theme)
│   │   ├── App.jsx             # Main Application Container & view router
│   │   └── index.css           # Premium Monochromatic styling guidelines
│   └── package.json            # React & Redux dependencies
│
├── 🎫 TicketingPlatform/        # Express + Vanilla JS Support Ticketing System
│   ├── public/                 # Static frontend assets (HTML, custom CSS, client JS)
│   ├── server.js               # Express API server with in-memory CRUD operations
│   └── package.json            # Node.js & Express dependencies
│
├── .gitignore                  # Git ignore definitions
└── README.md                   # Repository documentation (this file)
```

---

## 🛍️ Project 1: EcommerceRedux (React & Redux Toolkit)

[EcommerceRedux](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/EcommerceRedux) is a premium, monochromatic, client-side E-commerce web application featuring robust state management via Redux Toolkit. Designed under a sleek, minimalist aesthetic (named **ONYX**), it includes advanced client-side features without requiring a backend database.

### ✨ Key Features

- **🛒 Interactive Shopping Bag**: A slide-out [CartDrawer](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/EcommerceRedux/src/components/CartDrawer.jsx) that calculates sub-totals, items count, and dynamically updates based on product quantity modifications.
- **❤️ Wishlist System**: Add/remove products from a wishlist store and view them in a dedicated tab.
- **⚡ Advanced Catalog Filtering**: Search through products in real-time, filter by specific category (Audio, Tech, Accessories, etc.), sort by rating or price range, and clear all filters instantly.
- **🔧 Product Studio (Admin Dashboard)**: A full [AdminDashboard](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/EcommerceRedux/src/components/AdminDashboard.jsx) view that permits standard CRUD operations:
  - Add new products with title, category, description, and price.
  - Edit existing products, prices, descriptions, and stock statuses.
  - Delete products from the store.
  - Review business metrics (Total Sales, Revenue, and Inventory stats).
- **💳 Checkout Flow**: A multi-step-like single-page [CheckoutForm](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/EcommerceRedux/src/components/CheckoutForm.jsx) where users enter shipping details, apply discount coupons, and complete simulated payments.
- **🌓 Theme & Notification States**: 
  - Dynamic Light/Dark mode toggling driven by Redux.
  - System-wide notifications via toast alerts, managed by [notificationSlice](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/EcommerceRedux/src/redux/notificationSlice.js).

### 🛠️ Technology Stack
- **Library**: React 19 ([main.jsx](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/EcommerceRedux/src/main.jsx))
- **State Management**: Redux Toolkit & React-Redux ([store.js](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/EcommerceRedux/src/redux/store.js))
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with custom theme variables ([index.css](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/EcommerceRedux/src/index.css))
- **Icons**: Lucide React

### 🚀 Getting Started

1. Navigate to the project directory:
   ```bash
   cd EcommerceRedux
   ```
2. Install the dependencies:
   ```bash
   npm install
   # OR
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # OR
   yarn dev
   ```
4. Access the application in your browser at the local address provided (typically `http://localhost:5173`).

---

## 🎫 Project 2: TicketingPlatform (Node.js + Express + Vanilla JS)

[TicketingPlatform](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/TicketingPlatform) is a support ticket management dashboard featuring a responsive layout and smooth animations. It demonstrates full-stack REST API development and client-side DOM manipulation.

### ✨ Key Features

- **📊 Support Ticket Dashboard**: Visual counters displaying ticket statistics categorized by status (Open, In Progress, Closed).
- **📋 Complete Ticket CRUD**:
  - **Create**: Add tickets with custom descriptions, priorities (Low, Medium, High), categories, and assignees.
  - **Read**: View comprehensive ticket information in a clean, detailed modal.
  - **Update**: Adjust priority, category, status, or assignee directly from the modal.
  - **Delete**: Remove resolved or obsolete tickets instantly.
- **🔍 Smart Searching & Filtering**: Search tickets by title/description or filter by status and priority using sidebar toggles.
- **🎨 Premium Interface**: Styled using curated purple/indigo gradients, subtle hover micro-animations, color-coded status badges, and dynamic user avatars.

### 🛠️ Technology Stack
- **Backend**: Node.js & Express ([server.js](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/TicketingPlatform/server.js))
- **Frontend**: Vanilla HTML5, CSS3, and JavaScript ([app.js](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/TicketingPlatform/public/app.js))
- **ID Generation**: UUID

### 🚀 Getting Started

1. Navigate to the project directory:
   ```bash
   cd TicketingPlatform
   ```
2. Install the node modules:
   ```bash
   npm install
   ```
3. Start the application:
   - **Production Mode**:
     ```bash
     npm start
     ```
   - **Development Mode** (with Auto-reload via nodemon):
     ```bash
     npm run dev
     ```
4. Open your web browser and navigate to `http://localhost:3000`.

---

## ⚙️ Development Guidelines

- **Keep Slices Clean**: Any new global state in [EcommerceRedux](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/EcommerceRedux) should be structured as a distinct Redux slice in the [redux](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/EcommerceRedux/src/redux) folder and registered in [store.js](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/EcommerceRedux/src/redux/store.js).
- **Aesthetic Integrity**: Keep styling compliant with the premium design tokens established in [index.css](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/EcommerceRedux/src/index.css) (EcommerceRedux) and [styles.css](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/TicketingPlatform/public/styles.css) (TicketingPlatform).
- **No Direct Database State**: The ticketing system currently uses server-side in-memory storage (defined in [server.js](file:///Users/chandu45/Developer/ChandraSekhar_InternshipTraining/TicketingPlatform/server.js)), which resets on server restart.

---
*Developed during the ChandraSekhar Internship Training Program.*
