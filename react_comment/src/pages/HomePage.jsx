import React, { useState } from "react";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import "../css/HomePage.css"; // Подключаем стили

const HomePage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="home-page">
      <h1>Комментарии</h1>

      {/* Кнопка для переключения отображения формы */}
      {!showForm && (
        <button className="form-toggle-button" onClick={() => setShowForm(true)}>
          Написать комментарий
        </button>
      )}

      {/* Отображение формы, если showForm === true */}
      {showForm && (
        <div className="form-container">
          <CommentForm onAdd={() => window.location.reload()} />
          <button className="cancel-button" onClick={() => setShowForm(false)}>
            Отмена
          </button>
        </div>
      )}

      {/* Список комментариев */}
      <CommentList />
    </div>
  );
};

export default HomePage;
