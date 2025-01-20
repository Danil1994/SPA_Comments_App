import React from "react";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";

const HomePage = () => {
  return (
    <div>
      <h1>Комментарии</h1>
      <CommentForm onAdd={() => window.location.reload()} />
      <CommentList />
    </div>
  );
};

export default HomePage;
