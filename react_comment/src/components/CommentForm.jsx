import React, { useState } from "react";
import { addComment } from "../services/api";

const CommentForm = ({ onAdd, parent = null }) => {
  const [form, setForm] = useState({ user_name: "", email: "", text: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newComment = { ...form, parent }; // Добавляем parent, если он есть
      const response = await addComment(newComment);
      onAdd(response.data); // Вызываем callback для обновления списка комментариев/ответов
      setForm({ user_name: "", email: "", text: "" }); // Очищаем форму
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
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
        placeholder="Напишите ваш комментарий..."
        value={form.text}
        onChange={handleChange}
        required
      />
      <button type="submit">Отправить</button>
    </form>
  );
};

export default CommentForm;
