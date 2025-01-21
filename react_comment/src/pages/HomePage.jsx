import React, { useState } from "react";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";

const HomePage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <h1>Комментарии</h1>
      {/* Кнопка для переключения отображения формы */}
      {!showForm && (
        <button onClick={() => setShowForm(true)}>Написать комментарий</button>
      )}

      {/* Отображение формы, если showForm === true */}
      {showForm && (
        <div>
          <CommentForm onAdd={() => window.location.reload()} />
          <button onClick={() => setShowForm(false)}>Отмена</button>
        </div>
      )}

      {/* Список комментариев */}
      <CommentList />
    </div>
  );
};

export default HomePage;
