import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { PageArea } from './styled';
import useApi from "../../helpers/OlxAPI";
import { PageContainer, PageTitle, ErrorMessage } from "../../components/MainComponents";

const Page = () => {
  const api = useApi();
  const fileField = useRef();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [stateName, setStateName] = useState('');
  const [price, setPrice] = useState('');
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [desc, setDesc] = useState('');
  const [categories, setCategories] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getCategories = async () => {
      const cats = await api.getCategories();
      setCategories(cats);
    };
    getCategories();
  }, [api]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setError('');

    let errors = [];

    if (!title.trim()) {
      errors.push('Título é obrigatório');
    }
    if (!category) {
      errors.push('Selecione uma categoria');
    }
    if (!stateName) {
      errors.push('Selecione a condição do produto');
    }
    // Limpar o valor do preço
  const cleanPrice = price.replace(/\D/g, '');

    if (errors.length === 0) {
      const fData = new FormData();
      fData.append('title', title);
      fData.append('price', cleanPrice);
      fData.append('priceNegotiable', String(priceNegotiable)); // Converta para string
      fData.append('description', desc);
      fData.append('categoryId', category);
      fData.append('stateName', stateName);

      if (fileField.current.files.length > 0) {
        for (let i = 0; i < fileField.current.files.length; i++) {
          fData.append('images', fileField.current.files[i]);
        }
      }

      try {
        const json = await api.addAd(fData);

        if (!json.error) {
          if (json.id) {
            navigate(`/ad/${json.id}`);
          } else {
            console.error('ID não encontrado na resposta');
            setError('Erro ao redirecionar para o anúncio');
          }
          return;
        } else {
          setError(json.error);
          console.error("Erro ao salvar anúncio:", json.error);
        }
      } catch (error) {
        setError('Erro ao enviar dados');
        console.error('Erro ao enviar dados:', error);
      }

    } else {
      setError(errors.join('\n'));
    }

    setDisabled(false);
  };

  const priceMask = createNumberMask({
    prefix: 'R$ ',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
  });

  return (
    <PageContainer>
      <PageTitle>Postar um anúncio</PageTitle>
      <PageArea>
        {error &&
          <ErrorMessage>{error}</ErrorMessage>
        }
        <form onSubmit={handleSubmit}>
          <label className="area">
            <div className="area--title">Título</div>
            <div className="area--input">
              <input
                type="text"
                disabled={disabled}
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
          </label>
          <label className="area">
            <div className="area--title">Categoria</div>
            <div className="area--input">
              <select
                disabled={disabled}
                onChange={e => setCategory(e.target.value)}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories && categories.map(index =>
                  <option key={index.id} value={index.id}>{index.name}</option>
                )}
              </select>
            </div>
          </label>
          <label className="area">
            <div className="area--title">Condição do Produto</div>
            <div className="area--input">
              <select
                disabled={disabled}
                onChange={e => setStateName(e.target.value)}
                required
              >
                <option value="">Selecione a condição</option>
                <option value="new">Novo</option>
                <option value="used">Usado</option>
              </select>
            </div>
          </label>
          <label className="area">
            <div className="area--title">Preço</div>
            <div className="area--input">
              <MaskedInput
                mask={priceMask}
                placeholder="R$"
                disabled={disabled || priceNegotiable}
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
          </label>
          <label className="area">
            <div className="area--title">Preço Negociável?</div>
            <div className="area--input">
              <input
                type="checkbox"
                disabled={disabled}
                checked={priceNegotiable}
                onChange={() => setPriceNegotiable(!priceNegotiable)}
              />
            </div>
          </label>
          <label className="area">
            <div className="area--title">Descrição</div>
            <div className="area--input">
              <textarea
                disabled={disabled}
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>
          </label>
          <label className="area">
            <div className="area--title">Imagens (1 ou mais)</div>
            <div className="area--input">
              <input
                type="file"
                disabled={disabled}
                multiple
                ref={fileField}
              />
            </div>
          </label>
          <label className="area">
            <div className="area--title"></div>
            <div className="area--input">
              <button disabled={disabled}>Adicionar Anúncio</button>
            </div>
          </label>
        </form>
      </PageArea>
    </PageContainer>
  );
};

export default Page;
