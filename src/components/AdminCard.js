import React from "react";
import { Link } from "react-router-dom";
import "./AdminCard.css"; 

const AdminCard = () => {
  const cards = [
    { title: "ADMIN", link: "/admin", color: "#581010" },
    { title: "STAFF", link: "/home", color: "#701818ff" },
    { title: "DEALER", link: "/dealer-page", color: "#960505ff" },
    { title: "REPRESENTATIVE", link: "/representative-page", color: "#870303ff" },
  ];

  return (
    <div className="cards-container">
      {cards.map((card, index) => (
        <Link to={card.link} key={index} className="card-link">
          <div className="dashboard-card" style={{ backgroundColor: card.color }}>
            <h3>{card.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AdminCard;