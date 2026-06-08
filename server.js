const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory database for tickets
let tickets = [
  {
    id: '1',
    title: 'Login Issues',
    description: 'Users unable to login with their credentials',
    priority: 'high',
    status: 'open',
    assignee: 'John Doe',
    createdAt: new Date('2024-06-01').toISOString(),
    updatedAt: new Date('2024-06-05').toISOString(),
    category: 'Bug'
  },
  {
    id: '2',
    title: 'Dashboard Performance',
    description: 'Dashboard takes too long to load',
    priority: 'medium',
    status: 'in-progress',
    assignee: 'Jane Smith',
    createdAt: new Date('2024-06-02').toISOString(),
    updatedAt: new Date('2024-06-04').toISOString(),
    category: 'Performance'
  },
  {
    id: '3',
    title: 'Add Dark Mode',
    description: 'Implement dark mode theme for the application',
    priority: 'low',
    status: 'open',
    assignee: 'Mike Johnson',
    createdAt: new Date('2024-06-03').toISOString(),
    updatedAt: new Date('2024-06-03').toISOString(),
    category: 'Feature'
  }
];

// GET all tickets
app.get('/api/tickets', (req, res) => {
  const { status, priority } = req.query;
  let filtered = [...tickets];
  
  if (status) {
    filtered = filtered.filter(t => t.status === status);
  }
  if (priority) {
    filtered = filtered.filter(t => t.priority === priority);
  }
  
  res.json(filtered);
});

// GET single ticket by ID
app.get('/api/tickets/:id', (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }
  res.json(ticket);
});

// CREATE new ticket
app.post('/api/tickets', (req, res) => {
  const { title, description, priority, category, assignee } = req.body;

  if (typeof title !== 'string' || typeof description !== 'string' || !title.trim() || !description.trim()) {
    return res.status(400).json({ error: 'Title and description are required and must be strings' });
  }

  const newTicket = {
    id: uuidv4(),
    title: title.trim(),
    description: description.trim(),
    priority: (typeof priority === 'string' && priority.trim()) ? priority.trim().toLowerCase() : 'medium',
    category: (typeof category === 'string' && category.trim()) ? category.trim() : 'General',
    assignee: (typeof assignee === 'string' && assignee.trim()) ? assignee.trim() : 'Unassigned',
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tickets.push(newTicket);
  res.status(201).json(newTicket);
});

// UPDATE ticket
app.put('/api/tickets/:id', (req, res) => {
  const ticket = tickets.find(t => t.id === req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }
  
  const { title, description, priority, status, assignee, category } = req.body;

  if (typeof title === 'string' && title.trim()) ticket.title = title.trim();
  if (typeof description === 'string' && description.trim()) ticket.description = description.trim();
  if (typeof priority === 'string' && priority.trim()) ticket.priority = priority.trim().toLowerCase();
  if (typeof status === 'string' && status.trim()) ticket.status = status.trim().toLowerCase();
  if (typeof assignee === 'string' && assignee.trim()) ticket.assignee = assignee.trim();
  if (typeof category === 'string' && category.trim()) ticket.category = category.trim();

  ticket.updatedAt = new Date().toISOString();

  res.json(ticket);
});

// DELETE ticket
app.delete('/api/tickets/:id', (req, res) => {
  const index = tickets.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Ticket not found' });
  }
  
  const deletedTicket = tickets.splice(index, 1);
  res.json(deletedTicket[0]);
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎫 Ticketing Platform running on http://localhost:${PORT}`);
});
