import React, { useState } from "react";

const CommentImage = ({ image }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="comment-image-container">
      {/* show mini photo */}
      <img
        src={image}
        alt="Comment"
        style={{ maxWidth: "320px", height: "240px" }}
        onClick={handleImageClick}
      />

      {/* modal window to showing big photo  */}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <span className="modal-close">&times;</span>
          <img src={image} alt="Enlarged Comment" />
        </div>
      )}
    </div>
  );
};

export default CommentImage;
