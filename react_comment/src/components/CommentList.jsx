import React, { useEffect, useState } from "react";
import { fetchComments } from "../services/api";
import Comment from "./Comment";

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    const loadComments = async () => {
      const response = await fetchComments(page, sortBy, order);
      setComments(response.data.results);
    };
    loadComments();
  }, [page, sortBy, order]);

  return (
    <div>
      <div>
        <button onClick={() => setSortBy("user_name")}>Сортировать по имени</button>
        <button onClick={() => setSortBy("email")}>Сортировать по email</button>
        <button onClick={() => setSortBy("created_at")}>Сортировать по дате</button>
        <button onClick={() => setOrder(order === "asc" ? "desc" : "asc")}>
          {order === "asc" ? "По убыванию" : "По возрастанию"}
        </button>
      </div>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      <div>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Предыдущая</button>
        <button onClick={() => setPage((prev) => prev + 1)}>Следующая</button>
      </div>
    </div>
  );
};

export default CommentList;
