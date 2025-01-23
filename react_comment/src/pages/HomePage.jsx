import React, { useState } from "react";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import "../css/HomePage.css";


const HomePage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="home-page">
      <h1>CommentS</h1>

      {!showForm && (
        <button className="form-toggle-button" onClick={() => setShowForm(true)}>
          Write comment
        </button>
      )}

      {showForm && (
        <div className="form-container">
          <CommentForm onAdd={() => window.location.reload()} />
          <button className="cancel-button" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </div>
      )}

      <CommentList />
    </div>
  );
};

export default HomePage;
