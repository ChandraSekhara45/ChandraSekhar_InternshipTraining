let tickets = [];

let selectedTicket = null;

let activePage = 'dashboard';

const ticketsContainer = document.getElementById('ticketsContainer');
const recentTicketsContainer = document.getElementById('recentTicketsContainer');
const myTicketsContainer = document.getElementById('myTicketsContainer');
const ticketModal = document.getElementById('ticketModal');
const createTicketModal = document.getElementById('createTicketModal');

// Navigation
function setActiveNav(page){
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    const el = document.querySelector(`[data-page="${page}"]`);
    if(el) el.classList.add('active');
}

function showPage(page){
    activePage = page;
    setActiveNav(page);
    document.getElementById('dashboardPage').classList.toggle('hidden', page !== 'dashboard');
    document.getElementById('allTicketsPage').classList.toggle('hidden', page !== 'all');
    document.getElementById('myTicketsPage').classList.toggle('hidden', page !== 'my');
    // render appropriate content
    if(page === 'dashboard') renderDashboard();
    if(page === 'all') renderAllTickets();
    if(page === 'my') renderMyTickets();
}

document.getElementById('navDashboard').addEventListener('click', e=>{ e.preventDefault(); showPage('dashboard')});
document.getElementById('navAllTickets').addEventListener('click', e=>{ e.preventDefault(); showPage('all')});
document.getElementById('navMyTickets').addEventListener('click', e=>{ e.preventDefault(); showPage('my')});

// Helpers
function titleCaseStatus(status){
    if (!status) return '';
    if (status === 'in-progress') return 'In Progress';
    if (status === 'open') return 'Open';
    if (status === 'closed') return 'Closed';
    return status.replace(/(^|\-|_)(\w)/g, s => s.toUpperCase());
}

function apiToUi(ticket){
    return {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        priority: (ticket.priority || 'medium').toLowerCase(),
        status: (ticket.status || 'open').toLowerCase(),
        uiStatus: titleCaseStatus((ticket.status || 'open').toLowerCase()),
        assignee: ticket.assignee || 'Unassigned',
        category: ticket.category || 'General',
        createdAt: ticket.createdAt || null,
        time: ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Just Now'
    };
}

async function fetchTickets(){
    try{
        const res = await fetch('/api/tickets');
        const data = await res.json();
        tickets = data.map(apiToUi);
        showPage(activePage);
    }catch(err){
        console.error('Failed to load tickets', err);
    }
}

// Filters
function getFilterState(){
    return {
        open: document.getElementById('openFilter') ? document.getElementById('openFilter').checked : true,
        progress: document.getElementById('progressFilter') ? document.getElementById('progressFilter').checked : true,
        closed: document.getElementById('closedFilter') ? document.getElementById('closedFilter').checked : true,
    };
}

function getFilteredTickets(list){
    const f = getFilterState();
    return list.filter(t => {
        if (!t || !t.status) return false;
        if (t.status === 'open' && f.open) return true;
        if (t.status === 'in-progress' && f.progress) return true;
        if (t.status === 'closed' && f.closed) return true;
        return false;
    });
}

// wire filter checkboxes to re-render
['openFilter','progressFilter','closedFilter'].forEach(id=>{
    const el = document.getElementById(id);
    if(el){
        el.addEventListener('change', ()=> showPage(activePage));
    }
});

function renderTickets(list, container){
    if(!container) return;
    container.innerHTML = '';
    list.forEach(ticket => {
        const initials = (ticket.assignee || 'U').split(' ').map(n => n[0]).join('');
        const card = document.createElement('div');
        card.className = `ticket-card ${ticket.priority}`;
        card.innerHTML = `
            <div class="ticket-top">
                <div>
                    <h3>${ticket.title}</h3>
                    <span class="ticket-id">TK-${ticket.id}</span>
                </div>
                <div class="badges">
                    <span class="badge ${ticket.priority}-badge">${ticket.priority.toUpperCase()}</span>
                    <span class="badge">${ticket.uiStatus}</span>
                </div>
            </div>
            <p class="ticket-description">${ticket.description}</p>
            <div class="ticket-footer">
                <div class="assignee">
                    <div class="mini-avatar">${initials}</div>
                    <span>${ticket.assignee}</span>
                </div>
                <span class="time">${ticket.time}</span>
            </div>
        `;
        card.addEventListener('click', () => openTicket(ticket));
        container.appendChild(card);
    });
}

function renderDashboard(){
    updateStats();
    const filtered = getFilteredTickets(tickets);
    const recent = filtered.slice(0,5);
    renderTickets(recent, recentTicketsContainer);
}

function renderAllTickets(){
    const filtered = getFilteredTickets(tickets);
    renderTickets(filtered, ticketsContainer);
}

function renderMyTickets(){
    const me = 'Chandra Sekhar';
    const filtered = getFilteredTickets(tickets);
    const mine = filtered.filter(t=>t.assignee === me);
    renderTickets(mine, myTicketsContainer);
}

function openTicket(ticket) {

    selectedTicket = ticket;
    // show details in the right-hand panel for the active page
    showDetails(ticket);
}

function formatDate(iso){
    try{
        return new Date(iso).toLocaleString();
    }catch(e){ return iso || '' }
}

function showDetails(ticket){
    if(!ticket) return;
    const targetId = activePage === 'dashboard' ? 'ticketDetails' : (activePage === 'all' ? 'ticketDetailsAll' : 'ticketDetailsMine');
    const container = document.getElementById(targetId);
    if(!container) return;

    container.innerHTML = `
        <div class="detail-card">
            <div class="detail-header">
                <div style="font-weight:700;font-size:16px;margin-bottom:4px">${ticket.title}</div>
                <div style="color:#888;font-size:13px">TK-${ticket.id}</div>
            </div>

            <div class="detail-row">
                <div class="label">Assignee</div>
                <input id="assigneeInput" type="text" value="${ticket.assignee}">
            </div>

            <div class="detail-row">
                <div class="label">Priority</div>
                <select id="prioritySelect">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>

            <div class="detail-row">
                <div class="label">Status</div>
                <select id="statusSelect">
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <div class="detail-row">
                <div class="label">Category</div>
                <div class="value">${ticket.category || 'General'}</div>
            </div>

            <div class="detail-row">
                <div class="label">Created</div>
                <div class="value">${formatDate(ticket.createdAt)}</div>
            </div>

            <div class="desc-section">
                <label>Description</label>
                <textarea id="descInput" rows="5">${ticket.description}</textarea>
            </div>

            <div class="detail-actions">
                <button id="updateTicketBtn">Update Ticket</button>
                <button id="closeTicketBtnDetail">Close Ticket</button>
                <button id="deleteTicketBtnDetail">Delete</button>
            </div>
        </div>
    `;

    // set selects to current values
    const ps = document.getElementById('prioritySelect'); if(ps) ps.value = ticket.priority || 'medium';
    const ss = document.getElementById('statusSelect'); if(ss) ss.value = ticket.status || 'open';

    // Update handler
    const upd = document.getElementById('updateTicketBtn');
    if(upd){
        upd.onclick = async () => {
            const newPriority = document.getElementById('prioritySelect').value;
            const newStatus = document.getElementById('statusSelect').value;
            const newDesc = document.getElementById('descInput').value.trim();
            const newAssignee = document.getElementById('assigneeInput').value.trim();
            if(!newDesc){ alert('Description cannot be empty'); return; }

            try{
                const res = await fetch(`/api/tickets/${ticket.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type':'application/json' },
                    body: JSON.stringify({ priority: newPriority, status: newStatus, description: newDesc, assignee: newAssignee })
                });
                const updated = await res.json();
                // update local
                const idx = tickets.findIndex(t=>t.id === updated.id);
                if(idx !== -1) tickets[idx] = apiToUi(updated);
                showPage(activePage);
                showDetails(apiToUi(updated));
            }catch(e){ console.error(e); alert('Update failed'); }
        };
    }

    // Close handler (mark closed)
    const closeBtn = document.getElementById('closeTicketBtnDetail');
    if(closeBtn){
        closeBtn.onclick = async ()=>{
            try{
                const res = await fetch(`/api/tickets/${ticket.id}`, {
                    method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status: 'closed' })
                });
                const updated = await res.json();
                const idx = tickets.findIndex(t=>t.id === updated.id);
                if(idx !== -1) tickets[idx] = apiToUi(updated);
                showPage(activePage);
                showDetails(apiToUi(updated));
            }catch(e){ console.error(e); }
        };
    }

    // Delete handler
    const del = document.getElementById('deleteTicketBtnDetail');
    if(del){
        del.onclick = async ()=>{
            if(!confirm('Delete this ticket?')) return;
            try{
                const res = await fetch(`/api/tickets/${ticket.id}`, { method: 'DELETE' });
                const deleted = await res.json();
                tickets = tickets.filter(t=>t.id !== deleted.id && t.id !== ticket.id);
                showPage(activePage);
            }catch(e){ console.error(e); alert('Delete failed'); }
        };
    }
}

document
    .querySelectorAll(".close-btn")
    .forEach(btn => {

        btn.addEventListener(
            "click",
            () => {

                ticketModal.classList.remove("show");

                createTicketModal.classList.remove("show");

            }
        );

    });

document
    .getElementById("newTicketBtn")
    .addEventListener(
        "click",
        () => {

            createTicketModal.classList.add('show');



        }
    );


document
    .getElementById("addTicketBtn")
    .addEventListener(
        "click",
        () => {
            const title = document.getElementById('ticketTitle').value.trim();
            const description = document.getElementById('ticketDescription').value.trim();
            const priority = document.getElementById('ticketPriority') ? document.getElementById('ticketPriority').value : 'medium';
            const assignee = document.getElementById('ticketAssignee') ? document.getElementById('ticketAssignee').value.trim() : 'Unassigned';
            const category = document.getElementById('ticketCategory') ? document.getElementById('ticketCategory').value.trim() : 'General';
            const status = document.getElementById('ticketStatus') ? document.getElementById('ticketStatus').value : 'open';

            if (!title || !description) {
                alert('Please enter title and description');
                return;
            }

            // Send to server with full details
            fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, priority, assignee: assignee || 'Unassigned', category: category || 'General', status })
            })
            .then(r => r.json())
            .then(created => {
                const ui = apiToUi(created);
                tickets.unshift(ui);
                document.getElementById('ticketTitle').value = '';
                document.getElementById('ticketDescription').value = '';
                if(document.getElementById('ticketAssignee')) document.getElementById('ticketAssignee').value = '';
                if(document.getElementById('ticketCategory')) document.getElementById('ticketCategory').value = '';
                createTicketModal.classList.remove('show');
                showPage(activePage);
                showDetails(ui);
            })
            .catch(err => {
                console.error('Create failed', err);
                alert('Failed to create ticket');
            });
        }
    );


document
    .getElementById("closeTicketBtn")
    .addEventListener(
        "click",
        () => {

            if (!selectedTicket) return;

            // Update on server
            fetch(`/api/tickets/${selectedTicket.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'closed' })
            })
            .then(r => r.json())
            .then(updated => {
                // update local
                const idx = tickets.findIndex(t => t.id === updated.id);
                if (idx !== -1) tickets[idx] = apiToUi(updated);
                ticketModal.classList.remove('show');
                showPage(activePage);
            })
            .catch(err => {
                console.error('Close failed', err);
            });

        }
    );

document
    .getElementById("deleteTicketBtn")
    .addEventListener(
        "click",
        () => {

            if (!selectedTicket) return;

            fetch(`/api/tickets/${selectedTicket.id}`, { method: 'DELETE' })
            .then(r => r.json())
            .then(deleted => {
                tickets = tickets.filter(t => t.id !== deleted.id && t.id !== selectedTicket.id);
                ticketModal.classList.remove('show');
                showPage(activePage);
            })
            .catch(err => {
                console.error('Delete failed', err);
            });

        }
    );

document
    .getElementById("searchInput")
    .addEventListener(
        "keyup",
        e => {

            const search = e.target.value.toLowerCase();
            document.querySelectorAll('.ticket-card').forEach(card => {
                const text = card.innerText.toLowerCase();
                card.style.display = text.includes(search) ? 'block' : 'none';
            });

        }
    );


function updateStats() {

    const open = tickets.filter(t => t.status === 'open').length;
    const progress = tickets.filter(t => t.status === 'in-progress').length;
    const closed = tickets.filter(t => t.status === 'closed').length;

    document.getElementById('openCount').innerText = open;
    document.getElementById('progressCount').innerText = progress;
    document.getElementById('closedCount').innerText = closed;
    document.getElementById('totalCount').innerText = tickets.length;
}

/* -------------------
   Initial Load
-------------------- */
fetchTickets();


