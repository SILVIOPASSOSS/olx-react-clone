import React, { useState } from 'react';
import { Item } from './styled';

const AdEditModal = ({ adData, onClose, onSave }) => {
  const [title, setTitle] = useState(adData.title || '');
  const [description, setDescription] = useState(adData.description || '');
  const [price, setPrice] = useState(adData.price || '');
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState(adData.images || []);
  const [removedImages, setRemovedImages] = useState([]);

  // Handle new image files
  const handleNewImage = (event) => {
    const files = Array.from(event.target.files);
    setNewImages(files);
  };

  // Remove existing image
  const handleRemoveImage = (imageId) => {
    setRemovedImages([...removedImages, imageId]);
    setExistingImages(existingImages.filter((image) => image.id !== imageId));
  };

  // Save the ad
  const handleSave = () => {
    const adData = {
      title,
      description,
      price: parseFloat(price) || 0,
      removedImages
    };


    // Check if there are actual changes before sending
    if (adData.title === adData.title && adData.description === adData.description && adData.price === adData.price && !newImages.length && !removedImages.length) {
      console.log('No changes detected');
      return;
    };

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('removedImages', JSON.stringify(removedImages));
    newImages.forEach((image) => formData.append('images', image));

    // Log FormData for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Send FormData
    onSave(formData);
    onClose();
  };

  return (
    <Item className="aditem">
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={onClose}>&times;</span>
            <h2>Edite seu anúncio</h2>
            <div>
              <label>Título do Anúncio</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label>Descrição</label>
              <input 
                type="text"
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input 
                type="number"
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="existing-images">
              <h3>Imagens existentes</h3>
              {existingImages.map((image, index) => (
                <div key={index}>
                  <img src={`http://localhost:3001/media/${image.url}`} alt={`Image ${index + 1}`} />
                  <button type="button" onClick={() => handleRemoveImage(image.id)} className="remove-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 24 24">
                      <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div>
              <label htmlFor="newImages">Adicione novas imagens</label>
              <input 
                type="file" 
                id="newImages"
                multiple
                onChange={handleNewImage}
              />
            </div>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </Item>
  );
};

export default AdEditModal;
