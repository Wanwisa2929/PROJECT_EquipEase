import React from "react";
import { useNavigate } from "react-router-dom";


const itemsData = [
  { id: 1, name: "Football", img: "/images/Football.jpg" },
  { id: 2, name: "Volleyball", img: "/images/Volleyball.jpg" },
  { id: 3, name: "Basketball", img: "/images/basketball.png" },
  { id: 4, name: "Tennis Ball", img: "/images/TennisBall.jpg" },
  { id: 5, name: "Petanque Ball", img: "/images/PetanqueBall.jpg" },
  { id: 6, name: "Futsal Ball", img: "/images/FutsalBall.jpg" },
];

export default function Home() {
  const navigate = useNavigate();
  const handleClick = (id) => navigate(`/items?id=${id}`);

  return (
    <main className="content">
      <h1>HOME</h1>
      <div className="card-container">
        {itemsData.map((item) => (
          <div
            key={item.id}
            className="card"
            onClick={() => handleClick(item.id)}
          >
            <img src={item.img} alt={item.name} />
            <h2>{item.name}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}
