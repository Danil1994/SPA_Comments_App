import React, { useState } from "react";
import { addComment } from "../services/api";

const VALID_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/gif"]; // Допустимые форматы
const MAX_FILE_SIZE = 100 * 1024; // 100 КБ

const CommentForm = ({ onAdd, parent = null }) => {
  const [form, setForm] = useState({ user_name: "", email: "", text: "" });
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleImageChange = (e) => {
  const img = e.target.files[0];
  if (img) {
    // Проверяем формат изображения
    if (!VALID_IMAGE_FORMATS.includes(img.type)) {
      setError("Недопустимый формат изображения. Поддерживаются JPG, PNG, GIF.");
      setImage(null);
      return;
    }

    // Устанавливаем изображение, если формат корректный
    setImage(img);
    setError("");
  }
};
  const handleFileChange = (e) => {
    const txtFile = e.target.files[0];
    if (txtFile) {
      if (txtFile.size > MAX_FILE_SIZE || !txtFile.name.endsWith(".txt")) {
        setError("Размер файла не должен превышать 100 КБ, и допустим только формат .txt.");
        setFile(null);
        return;
      }
      setFile(txtFile);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("user_name", form.user_name);
      formData.append("email", form.email);
      formData.append("text", form.text);
      if (parent) formData.append("parent", parent);
      if (image) formData.append("image", image);
      if (file) formData.append("file", file);

      const response = await addComment(formData);
      onAdd(response.data); // Обновляем список комментариев/ответов
      setForm({ user_name: "", email: "", text: "" });
      setImage(null);
      setFile(null);
      setError("");
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <button type="submit">Отправить</button>
    </form>
  );
};

export default CommentForm;
