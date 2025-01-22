import React, { useState } from "react";
import { fetchReplies } from "../services/api";
import CommentForm from "./CommentForm";

const BASE_URL = "http://127.0.0.1:8000";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString(); // Это отформатирует дату в удобочитаемый формат
};

const Comment = ({ comment }) => {
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleShowReplies = async () => {
    if (!showReplies) {
      const response = await fetchReplies(comment.id);
      setReplies(response.data);
    }
    setShowReplies(!showReplies);
  };

  const handleAddReply = (newReply) => {
    setReplies((prevReplies) => [...prevReplies, newReply]); // Добавляем новый ответ в список
    setShowReplyForm(false); // Закрываем форму после добавления
  };

  return (
    <div style={{ marginLeft: comment.parent ? "20px" : "0px", marginTop: "10px" }}>
      <strong>{comment.user_name}</strong> ({comment.email}) написал в{" "}
      <strong>{comment.created_at ? formatDate(comment.created_at) : "неизвестное время"}</strong>:
      <div dangerouslySetInnerHTML={{ __html: comment.text }} />

      {/* Если есть home_page (ссылка на сайт), отображаем ссылку */}
      {comment.home_page && (
        <p>
          <a href={comment.home_page} target="_blank" rel="noopener noreferrer">
            Перейти на страницу автора
          </a>
        </p>
      )}

      {/* Если есть изображение, отображаем его */}
        {comment.image && (
          <div>
            <img
              src={`${BASE_URL}${comment.image}`} // добавляем базовый путь
              alt="comment image"
              style={{ maxWidth: "320px", height: "240px" }}
            />
          </div>
        )}

      {/* Если есть файл, отображаем кнопку для его скачивания */}
        {comment.file && (
          <div>
            <a href={`${BASE_URL}${comment.file}`} target="_blank" rel="noopener noreferrer">
              <button>Скачать файл</button>
            </a>
          </div>
        )}

      {/* Кнопка для отображения/скрытия ответов */}
      <button onClick={handleShowReplies}>
        {showReplies ? "Скрыть ответы" : `Показать ${replies.length || "10"} ответов`}
      </button>

      {/* Кнопка для написания ответа */}
      <button onClick={() => setShowReplyForm(!showReplyForm)}>
        {showReplyForm ? "Отменить" : "Написать ответ"}
      </button>

      {/* Форма для ответа */}
      {showReplyForm && (
        <CommentForm
          onAdd={handleAddReply}
          parent={comment.id} // Передаём ID родительского комментария
        />
      )}

      {/* Отображение ответов */}
      {showReplies && replies.map((reply) => <Comment key={reply.id} comment={reply} />)}
    </div>
  );
};

export default Comment;
