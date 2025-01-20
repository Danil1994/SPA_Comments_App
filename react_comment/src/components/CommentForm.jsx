import React, { useState } from "react";
import { addComment } from "../services/api";

const CommentForm = ({ onAdd }) => {
  const [form, setForm] = useState({ user_name: "", email: "", text: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await addComment(form);
    onAdd(response.data); // Update comments
    setForm({ user_name: "", email: "", text: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="user_name"
        placeholder="Имя"
        value={form.user_name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <textarea
        name="text"
        placeholder="Текст комментария"
        value={form.text}
        onChange={handleChange}
        required
      />
      <button type="submit">Добавить комментарий</button>
    </form>
  );
};

export default CommentForm;
