import React, { useEffect, useState } from "react";
import { fetchComments } from "../services/api";
import Comment from "./Comment";

import "../css/CommentList.css";

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);


  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await fetchComments(page, sortBy, order);
        setComments(response.data.results);

        // update pagination
        setHasNext(!!response.data.next);
        setHasPrevious(!!response.data.previous);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error loading comments: ", error);
      }
    };
    loadComments();
  }, [page, sortBy, order]);

  const getButtonClass = (filter) => (sortBy === filter ? "selected" : "");

  return (
    <div className="comment-list">
      <div className="sort-buttons">
        <button
          className={getButtonClass("user_name")}
          onClick={() => setSortBy("user_name")}
        >
          Sort By Name
        </button>
        <button
          className={getButtonClass("email")}
          onClick={() => setSortBy("email")}
        >
          Sort by Email
        </button>
        <button
          className={getButtonClass("created_at")}
          onClick={() => setSortBy("created_at")}
        >
          Sort by date
        </button>
        <button
          className={order === "asc" ? "selected" : ""}
          onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
        >
          {order === "asc" ? "Descending" : "Ascending"}
        </button>
      </div>

      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <Comment comment={comment} />
        </div>
      ))}

        <div className="pagination">
        {hasPrevious && (
          <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
        )}
        {hasNext && (
          <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
        )}
      </div>
    </div>
  );
};

export default CommentList;
