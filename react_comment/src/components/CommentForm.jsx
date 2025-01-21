import React, { useState, useEffect } from "react";
import { addComment, fetchCaptcha } from "../services/api";

const VALID_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 100 * 1024; // 100 КБ

const CommentForm = ({ onAdd, parent = null }) => {
  const [form, setForm] = useState({ user_name: "", email: "", text: "", captcha: "" });
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [captcha, setCaptcha] = useState({ captcha_key: "", captcha_image: "" });
  const [error, setError] = useState("");


  useEffect(() => {
    loadCaptcha();
  }, []);

  const loadCaptcha = async () => {
    try {
      const response = await fetchCaptcha();
      setCaptcha(response.data);
    } catch (error) {
      console.error("Ошибка загрузки CAPTCHA:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const img = e.target.files[0];
    if (img) {
      if (!VALID_IMAGE_FORMATS.includes(img.type)) {
        setError("Недопустимый формат изображения. Поддерживаются JPG, PNG, GIF.");
        setImage(null);
        return;
      }
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

    // Добавляем CAPTCHA ключ и значение
    formData.append("captcha_key", captcha.captcha_key);
    formData.append("captcha_value", form.captcha_value);

    if (parent) formData.append("parent", parent); // Для ответа на комментарий
    if (image) formData.append("image", image); // Для загрузки изображения
    if (file) formData.append("file", file); // Для загрузки текстового файла

    const response = await addComment(formData);
    onAdd(response.data);

    // Очищаем форму и обновляем CAPTCHA
    setForm({ user_name: "", email: "", text: "", captcha_value: "" });
    setImage(null);
    setFile(null);
    setError("");
    loadCaptcha(); // Обновляем CAPTCHA после успешного отправления
  } catch (error) {
    console.error("Ошибка при добавлении комментария:", error);
    setError("Ошибка проверки CAPTCHA или данных."); // Устанавливаем ошибку
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

        <div>
            <img src={captcha.captcha_image} alt="CAPTCHA"/>
            <button type="button" onClick={loadCaptcha}>Обновить CAPTCHA</button>
          </div>
          <input
            type="text"
            name="captcha_value"
            placeholder="Введите CAPTCHA"
            value={form.captcha_value}
            onChange={(e) => setForm({ ...form, captcha_value: e.target.value })}
            required
          />

      <input type="file" accept="image/*" onChange={handleImageChange} />
      <input type="file" accept=".txt" onChange={handleFileChange} />


      <button type="submit">Отправить</button>
    </form>
  );
};

export default CommentForm;