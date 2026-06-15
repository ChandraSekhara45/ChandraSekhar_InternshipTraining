# 🎫 TicketingPlatform - Premium Support Ticketing System

A modern, user-friendly ticketing platform built with Node.js, Express, and vanilla JavaScript. Features a clean UI with complete CRUD operations for ticket management.

## ✨ Features

- **Dashboard View**: Quick overview with ticket statistics
- **Ticket Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Smart Filtering**: Filter by status and priority
- **Search Functionality**: Quickly find tickets by title, description, or ID
- **Ticket Details**: View comprehensive ticket information in a beautiful modal
- **Quick Actions**: Update status, priority, and assignees without leaving the detail view
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Modern UI**: Premium design with smooth animations and gradients
- **Real-time Updates**: Instant feedback for all operations

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to the project directory**
   ```bash
   cd /home/chandra.sekhara/Developer/TicketingPlatform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000`

4. **Open in browser**
   - Navigate to `http://localhost:3000` in your web browser

## 📋 Project Structure

```
TicketingPlatform/
├── server.js                    # Express server with API endpoints
├── package.json                 # Dependencies and scripts
└── public/
    ├── index.html              # Main HTML structure
    ├── styles.css              # Complete styling with animations
    └── app.js                  # Frontend JavaScript (CRUD + interactions)
```

## 🔌 API Endpoints

### Get All Tickets
```
GET /api/tickets
Query Parameters: status, priority
Example: /api/tickets?status=open&priority=high
```

### Get Single Ticket
```
GET /api/tickets/:id
```

### Create New Ticket
```
POST /api/tickets
Body: {
  "title": "string (required)",
  "description": "string (required)",
  "priority": "low|medium|high",
  "category": "string",
  "assignee": "string"
}
```

### Update Ticket
```
PUT /api/tickets/:id
Body: {
  "title": "string (optional)",
  "description": "string (optional)",
  "status": "open|in-progress|closed",
  "priority": "low|medium|high",
  "category": "string",
  "assignee": "string"
}
```

### Delete Ticket
```
DELETE /api/tickets/:id
```

## 💡 Usage Guide

### Creating a Ticket
1. Click the **"+ New Ticket"** button in the sidebar
2. Fill in the ticket details (Title and Description are required)
3. Select Priority and Category
4. Assign to a team member
5. Click "Create Ticket"

### Viewing Ticket Details
1. Click on any ticket card in the list
2. A detailed modal will open showing all ticket information
3. Use the quick action dropdowns to update status, priority, or assignee
4. Click "Update Ticket" to save changes

### Filtering Tickets
- Use sidebar checkboxes to filter by status
- Click filter buttons in "All Tickets" view to filter by priority
- Use the search box to find tickets by title, description, or ID

### Dashboard
The dashboard shows:
- **Open Tickets**: Count of unresolved tickets
- **In Progress**: Tickets currently being worked on
- **Closed Tickets**: Resolved tickets
- **Recent Tickets**: Latest 5 tickets created

## 🎨 Design Highlights

- **Premium Gradient UI**: Beautiful purple gradient sidebar with smooth transitions
- **Status Badges**: Color-coded badges for quick status recognition
  - 🔴 High Priority (Red)
  - 🟡 Medium Priority (Orange)
  - 🟢 Low Priority (Green)
- **Smooth Animations**: All interactions include subtle animations
- **User Avatars**: Dynamic avatars for team members
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: Clear visual hierarchy and readable typography

## 🔧 Customization

### Change Colors
Edit the CSS variables in `public/styles.css` at the `:root` selector:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  /* ... other colors */
}
```

### Add More Team Members
Update the assignee select in `public/index.html`:
```html
<option value="New Person Name">New Person Name</option>
```

### Modify Default Tickets
Edit the `tickets` array in `server.js` to add your own sample data.

## 📝 Sample Tickets

The system comes pre-populated with 3 sample tickets:
1. **Login Issues** - High priority bug
2. **Dashboard Performance** - Medium priority performance improvement
3. **Add Dark Mode** - Low priority feature request

## 🌐 Development

### Development Mode with Auto-reload
```bash
npm install --save-dev nodemon
npm run dev
```

### Browser DevTools
- All API calls can be monitored in the Network tab
- JavaScript can be debugged in the Console and Sources tabs
- CSS can be inspected in the Elements tab

## 🐛 Troubleshooting

**Tickets not loading?**
- Ensure the server is running on port 3000
- Check browser console for error messages
- Verify CORS is enabled

**Changes not persisting?**
- Currently using in-memory storage (resets on server restart)
- To persist data, integrate a database like MongoDB or PostgreSQL

**Modal not closing?**
- Press ESC key or click outside the modal
- Click the X button in the top-right corner

## 🚢 Deployment

To deploy this application:

1. **For production**, change `localhost:3000` to your domain in API calls
2. **Database**: Replace in-memory storage with a real database
3. **Authentication**: Add user authentication and authorization
4. **Hosting**: Deploy on Heroku, Vercel, AWS, or similar platforms

## 📚 Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- User authentication and authorization
- Real-time updates with WebSockets
- Email notifications
- File attachments for tickets
- Advanced reporting and analytics
- Dark mode toggle
- Multi-language support

## 📄 License

This project is open source and available for educational and commercial use.

## 🤝 Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Happy Ticketing! 🎫**
