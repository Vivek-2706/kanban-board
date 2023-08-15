import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [groupBy, setGroupBy] = useState("status");
  const [orderBy, setOrderBy] = useState("priority");

  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error in fetching data:", error);
      });
  }, []);

  const handleGroupByChange = (event) => {
    setGroupBy(event.target.value);
  };

  const handleOrderByChange = (event) => {
    setOrderBy(event.target.value);
  };

  const getColumnStatusContent = (tickets, groupBy) => {
    const statusContent =
      groupBy === "userId"
        ? data.users.find((user) => user.id === tickets[0].userId)?.name || ""
        : groupBy === "priority"
        ? `Priority: ${tickets[0].priority}`
        : tickets[0].status;

    const cardCount = tickets.length;

    return (
      <>
        <div>{statusContent}</div>
        <div>{cardCount}</div>
      </>
    );
  };

  const groupedAndSortedTickets = data
    ? Object.values(
        data.tickets.reduce((groups, ticket) => {
          const groupKey =
            groupBy === "status"
              ? ticket.status
              : groupBy === "userId"
              ? ticket.userId
              : ticket.priority;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(ticket);
          return groups;
        }, {})
      ).map((tickets) =>
        orderBy === "priority"
          ? tickets.sort((a, b) => a.priority - b.priority)
          : tickets.sort((a, b) => a.title.localeCompare(b.title))
      )
    : [];

  return (
    <div className="App">
      <header className="header">
        <div className="filter-container">
          <label>Group By:</label>
          <select value={groupBy} onChange={handleGroupByChange}>
            <option value="status">Status</option>
            <option value="userId">User</option>
            <option value="priority">Priority</option>
          </select>
          <label>Order By:</label>
          <select value={orderBy} onChange={handleOrderByChange}>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </header>

      <div className="board">
        <div className="board-columns">
          {groupedAndSortedTickets.map((tickets, index) => (
            <div key={index} className="board-column">
              <div className="board-column-status">
                {getColumnStatusContent(tickets, groupBy)}
              </div>
              {tickets.map((ticket) => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-card-header">
                  <p>{ticket.id}</p>
                  <p>
                    {data.users.find((user) => user.id === ticket.userId)?.name}
                  </p>
                  </div>
                
                  <h2>{ticket.title}</h2>
                  <p>Tag: {ticket.tag.join(", ")}</p>
                  <p>Status: {ticket.status}</p>
                  <p>Priority: {ticket.priority}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
