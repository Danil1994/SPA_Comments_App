import React, { useState } from "react";
import { fetchReplies } from "../services/api";
import CommentForm from "./CommentForm";

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
      <strong>{comment.user_name}</strong> ({comment.email}) написал:
      <p>{comment.text}</p>

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
