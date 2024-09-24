import React, { useState } from 'react';
import { ButtonContainer, Item } from './styled';
import { Link, useLocation } from 'react-router-dom';
import AdEditModal from '../AdEditModal';
import ConfirmationModal from '../ConfirmationModal';

const AdItem = (props) => {
  const { data, onDelete, onEdit, currentUserId } = props;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const location = useLocation();

  // Verifica se data está disponível antes de tentar desestruturar
  if (!data) {
    return null; // Evita renderizar se data estiver indefinido
  }

  // Desestruture as propriedades de data depois da verificação
  const { id, title, images, priceNegotiable, price, userId } = data;

  

  const displayPrice = priceNegotiable ? 'Preço Negociável' : `R$ ${price}`;

  const imageUrl = images && images.length > 0 
    ? `http://localhost:3001/media/${images[0].url}`
    : 'http://localhost:3001/media/placeholder.png';

  // Verifica se o usuário está na página de "Minha Conta" e se ele é o dono do anúncio
  const isOwner = location.pathname === '/user' && userId === currentUserId;

  const handleDeleteClick = () => {
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsConfirmDeleteOpen(false);
    try {
      await onDelete(id);
    } catch (err) {
      console.error("Erro ao deletar anúncio.");
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmDeleteOpen(false);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  return (
    <Item className="aditem">
      <Link to={`/ad/${id}`}>
        <div className="itemImage">
          <img src={imageUrl} alt="" />
        </div>
        <div className="itemName">{title}</div>
        <div className="itemPrice">
          {new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(Number(price))}
        </div>
      </Link>

      {isOwner && (
        <>
          <ButtonContainer>
            <button onClick={handleEdit}>Editar</button>
            <button onClick={handleDeleteClick}>Excluir</button>
          </ ButtonContainer>
        </>
      )}

      {isEditModalOpen && (
        <AdEditModal
          adData={data}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(formData) => {
            onEdit(id, formData);
            setIsEditModalOpen(false);
          }}
        />
      )}

      {isConfirmDeleteOpen && (
        <ConfirmationModal 
          show={isConfirmDeleteOpen}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </Item>
  );
};

export default AdItem;
