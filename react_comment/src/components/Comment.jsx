import React, { useState } from "react";
import { fetchReplies } from "../services/api";
import CommentForm from "./CommentForm";
import CommentImage from "./Image";
import "../css/Comment.css";

const BASE_URL = "http://127.0.0.1:8000";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString(); // transform date to good view
};


const Comment = ({ comment, level = 0 }) => {
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleShowReplies = async () => {
    if (!showReplies && replies.length === 0) {
      const response = await fetchReplies(comment.id);
      setReplies(response.data);
    }
    setShowReplies(!showReplies);
  };

const handleAddReply = (newReply) => {
    setReplies((prevReplies) => [...prevReplies, newReply]);
    setShowReplyForm(false);
  };

  return (
    <div
      className="comment-container"
      style={{ marginLeft: `${level * 20}px`, marginTop: "10px" }}
    >
      <strong>{comment.user_name}</strong>
      <span> ({comment.email})</span> {" wrote in "}
      <strong>{comment.created_at ? formatDate(comment.created_at) : "invalid time"}</strong>:
      <div
        className="comment-text"
        dangerouslySetInnerHTML={{ __html: comment.text }}
      />

      {comment.home_page && (
        <p>
          <a href={comment.home_page} target="_blank" rel="noopener noreferrer">
            Go to the authors page
          </a>
        </p>
      )}

    {comment.image && (
      <CommentImage image={`${BASE_URL}${comment.image}`} />
    )}


      {comment.file && (
        <div>
          <a href={`${BASE_URL}${comment.file}`} target="_blank" rel="noopener noreferrer">
            <button> Download file </button>
          </a>
        </div>
      )}

      <button onClick={handleShowReplies}>
        {showReplies ? "Hide comments" : `Show comments`}
      </button>

      <button onClick={() => setShowReplyForm(!showReplyForm)}>
        {showReplyForm ? "Cancel" : "Write answer"}
      </button>

      {showReplyForm && (
        <CommentForm
          onAdd={handleAddReply}
          parent={comment.id}
        />
      )}

      {showReplies &&
        replies.map((reply) => (
          <Comment key={reply.id} comment={reply} level={level + 1} />
        ))}
    </div>
  );
};

export default Comment;
