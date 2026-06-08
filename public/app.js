const tickets = [
    {
        id: 1024,
        title: "Payment Gateway Failure",
        description: "Customers unable to complete transactions through payment gateway.",
        priority: "high",
        status: "Open",
        assignee: "John Doe",
        time: "2 Hours Ago"
    },
    {
        id: 1025,
        title: "Dashboard Slow Response",
        description: "Dashboard loading takes more than 8 seconds.",
        priority: "medium",
        status: "In Progress",
        assignee: "Alice Smith",
        time: "4 Hours Ago"
    }
];

let selectedTicket = null;

const ticketsContainer =
    document.getElementById("ticketsContainer");

const ticketModal =
    document.getElementById("ticketModal");

const createTicketModal =
    document.getElementById("createTicketModal");

/* -------------------
   Render Tickets
-------------------- */

function renderTickets() {

    ticketsContainer.innerHTML = "";

    tickets.forEach(ticket => {

        const initials =
            ticket.assignee
                .split(" ")
                .map(name => name[0])
                .join("");

        const card =
            document.createElement("div");

        card.className =
            `ticket-card ${ticket.priority}`;

        card.innerHTML = `
            <div class="ticket-top">

                <div>

                    <h3>${ticket.title}</h3>

                    <span class="ticket-id">
                        TK-${ticket.id}
                    </span>

                </div>

                <div class="badges">

                    <span class="badge ${ticket.priority}-badge">
                        ${ticket.priority.toUpperCase()}
                    </span>

                    <span class="badge">
                        ${ticket.status.toUpperCase()}
                    </span>

                </div>

            </div>

            <p class="ticket-description">
                ${ticket.description}
            </p>

            <div class="ticket-footer">

                <div class="assignee">

                    <div class="mini-avatar">
                        ${initials}
                    </div>

                    <span>
                        ${ticket.assignee}
                    </span>

                </div>

                <span class="time">
                    ${ticket.time}
                </span>

            </div>
        `;

        card.addEventListener(
            "click",
            () => openTicket(ticket)
        );

        ticketsContainer.appendChild(card);

    });

    updateStats();
}

/* -------------------
   Open Ticket
-------------------- */

function openTicket(ticket) {

    selectedTicket = ticket;

    document.getElementById(
        "modalTitle"
    ).innerText =
        ticket.title;

    document.getElementById(
        "modalDescription"
    ).innerText =
        ticket.description;

    ticketModal.classList.add("show");
}

/* -------------------
   Close Modal
-------------------- */

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

/* -------------------
   Open Create Modal
-------------------- */

document
    .getElementById("newTicketBtn")
    .addEventListener(
        "click",
        () => {

            createTicketModal.classList.add("show");

        }
    );

/* -------------------
   Add Ticket
-------------------- */

document
    .getElementById("addTicketBtn")
    .addEventListener(
        "click",
        () => {

            const title =
                document.getElementById(
                    "ticketTitle"
                ).value.trim();

            const description =
                document.getElementById(
                    "ticketDescription"
                ).value.trim();

            if (!title || !description) {

                alert(
                    "Please enter title and description"
                );

                return;
            }

            tickets.unshift({

                id: Date.now(),

                title,

                description,

                priority: "high",

                status: "Open",

                assignee: "Chandra Sekhar",

                time: "Just Now"
            });

            document.getElementById(
                "ticketTitle"
            ).value = "";

            document.getElementById(
                "ticketDescription"
            ).value = "";

            createTicketModal.classList.remove(
                "show"
            );

            renderTickets();

        }
    );

/* -------------------
   Close Ticket
-------------------- */

document
    .getElementById("closeTicketBtn")
    .addEventListener(
        "click",
        () => {

            if (!selectedTicket) return;

            selectedTicket.status =
                "Closed";

            ticketModal.classList.remove(
                "show"
            );

            renderTickets();

        }
    );

/* -------------------
   Delete Ticket
-------------------- */

document
    .getElementById("deleteTicketBtn")
    .addEventListener(
        "click",
        () => {

            if (!selectedTicket) return;

            const index =
                tickets.findIndex(
                    t => t.id === selectedTicket.id
                );

            if (index !== -1) {

                tickets.splice(index, 1);

            }

            ticketModal.classList.remove(
                "show"
            );

            renderTickets();

        }
    );

/* -------------------
   Search
-------------------- */

document
    .getElementById("searchInput")
    .addEventListener(
        "keyup",
        e => {

            const search =
                e.target.value.toLowerCase();

            document
                .querySelectorAll(".ticket-card")
                .forEach(card => {

                    const text =
                        card.innerText.toLowerCase();

                    card.style.display =
                        text.includes(search)
                            ? "block"
                            : "none";

                });

        }
    );

/* -------------------
   Dashboard Stats
-------------------- */

function updateStats() {

    const open =
        tickets.filter(
            t => t.status === "Open"
        ).length;

    const progress =
        tickets.filter(
            t => t.status === "In Progress"
        ).length;

    const closed =
        tickets.filter(
            t => t.status === "Closed"
        ).length;

    document.getElementById(
        "openCount"
    ).innerText = open;

    document.getElementById(
        "progressCount"
    ).innerText = progress;

    document.getElementById(
        "closedCount"
    ).innerText = closed;

    document.getElementById(
        "totalCount"
    ).innerText = tickets.length;
}

/* -------------------
   Initial Load
-------------------- */

renderTickets();

