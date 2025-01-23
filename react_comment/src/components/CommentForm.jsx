import React, { useState, useEffect } from "react";
import { addComment, fetchCaptcha } from "../services/api";
import "../css/CommentForm.css";

const VALID_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 100 * 1024; // 100 КБ

const CommentForm = ({ onAdd, parent = null }) => {
  const [form, setForm] = useState({ user_name: "", email: "", text: "", home_page: "", captcha: "" });
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [captcha, setCaptcha] = useState({ captcha_key: "", captcha_image: "" });
  const [error, setError] = useState("");
  const textareaRef = React.useRef(null);

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
    const { name, value } = e.target;

    if (name === "user_name") {
      const isValid = /^[a-zA-Z0-9]*$/.test(value);
      if (!isValid) {
        setError("Имя пользователя может содержать только буквы латинского алфавита и цифры.");
        return;
      }
    }

    setForm({ ...form, [name]: value });
    setError("");
  };

  const handleImageChange = (e) => {
    const img = e.target.files[0];
    if (img) {
      if (!VALID_IMAGE_FORMATS.includes(img.type)) {
        setError("Недопустимый формат изображения. Поддерживаются JPG, PNG, GIF.");
        setImage(null);
        return;
      }
      setImage();
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

  const addHtmlTag = (tag) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setError("Не удалось найти текстовое поле.");
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    let wrappedText;
    if (tag === "a") {
      wrappedText = `<a href="" title="">${selectedText}</a>`;
    } else {
      wrappedText = `<${tag}>${selectedText}</${tag}>`;
    }

    const newText = before + wrappedText + after;
    setForm({ ...form, text: newText });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("user_name", form.user_name);
    formData.append("email", form.email);
    formData.append("text", form.text);
    formData.append("home_page", form.home_page);
    formData.append("captcha_key", captcha.captcha_key);
    formData.append("captcha_value", form.captcha_value);

    if (parent) formData.append("parent", parent);
    if (image) formData.append("image", image);
    if (file) formData.append("file", file);

    const response = await addComment(formData);
    onAdd(response.data);

    // Очищаем форму
    setForm({ user_name: "", email: "", text: "", home_page: "", captcha_value: "" });
    setImage(null);
    setFile(null);
    setError("");
    loadCaptcha(); // Обновляем CAPTCHA
  } catch (error) {
    // Обрабатываем ответ с сервера
    if (error.response && error.response.data) {
      // Проверяем, есть ли ошибка CAPTCHA
      if (error.response.data.captcha_value) {
        setError(error.response.data.captcha_value[0]); // Устанавливаем сообщение об ошибке CAPTCHA
      } else {
        setError("Ошибка при отправке комментария. Попробуйте снова.");
      }
    } else {
      console.error("Ошибка при добавлении комментария:", error);
      setError("Ошибка при отправке комментария. Попробуйте снова.");
    }
    loadCaptcha(); // Обновляем CAPTCHA в случае ошибки
  }
};


  return (
    <div>
      <form onSubmit={handleSubmit} className="comment-form">
        {error && <p className="error-message">{error}</p>}

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

        <input
          type="url"
          name="home_page"
          placeholder="Домашняя страница (необязательно)"
          value={form.home_page || ""}
          onChange={handleChange}
        />

        <div className="tag-buttons">
          <button type="button" onClick={() => addHtmlTag("i")}>[i]</button>
          <button type="button" onClick={() => addHtmlTag("strong")}>[strong]</button>
          <button type="button" onClick={() => addHtmlTag("code")}>[code]</button>
          <button type="button" onClick={() => addHtmlTag("a")}>[a]</button>
        </div>

        <textarea
          ref={textareaRef}
          id="comment-textarea"
          name="text"
          placeholder="Напишите ваш комментарий..."
          value={form.text}
          onChange={handleChange}
          required
        />

        <div>
          <img src={captcha.captcha_image} alt="CAPTCHA" />
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

      {/* Превью комментария */}
      <div className="comment-preview">
        <h3>Предварительный просмотр</h3>
        <p><strong>Имя:</strong> {form.user_name}</p>
        <p><strong>Email:</strong> {form.email}</p>
        {form.home_page && (
          <p>
            <strong>Домашняя страница:</strong>{" "}
            <a href={form.home_page} target="_blank" rel="noopener noreferrer">{form.home_page}</a>
          </p>
        )}
        <div
          className="comment-text-preview"
          dangerouslySetInnerHTML={{ __html: form.text }}
        />

      </div>
    </div>
  );
};

export default CommentForm;
