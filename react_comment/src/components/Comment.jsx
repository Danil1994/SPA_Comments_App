import React, { useState } from "react";
import { fetchReplies } from "../services/api";

const Comment = ({ comment }) => {
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);

  const handleShowReplies = async () => {
    if (!showReplies) {
      const response = await fetchReplies(comment.id);
      setReplies(response.data);
    }
    setShowReplies(!showReplies);
  };

  return (
    <div style={{ marginLeft: comment.parent ? "20px" : "0px", marginTop: "10px" }}>
      <strong>{comment.user_name}</strong> ({comment.email}) написал:
      <p>{comment.text}</p>
      <button onClick={handleShowReplies}>
        {showReplies ? "Скрыть ответы" : `Показать ${replies.length || "10"} ответов`}
      </button>
      {showReplies && replies.map((reply) => <Comment key={reply.id} comment={reply} />)}
    </div>
  );
};

export default Comment;
