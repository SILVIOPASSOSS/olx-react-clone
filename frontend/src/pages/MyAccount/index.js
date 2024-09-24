import React, { useEffect, useState } from "react";
import 'react-slideshow-image/dist/styles.css';
import { PageArea, OthersArea } from './styled';
import useApi from "../../helpers/OlxAPI";
import { PageContainer, PageTitle, ErrorMessage } from "../../components/MainComponents";
import AdItem from "../../components/partials/AdItem";

const Page = () => {
  const api = useApi();
  const [stateList, setStateList] = useState([]);
  const [name, setName] = useState('');
  const [stateLoc, setStateLoc] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState([])
  const [adInfo, setAdInfo] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);


  const handleDelete = async (adId) => {
    try {
      await api.deleteAd(adId);
      setAdInfo(adInfo.filter(ad => ad.id !== adId));
      alert('Ad deleted with success');
    } catch(err) {  
      setError('Erro ao excluir anúncio')
    }
  };

  const handleEdit = async (adId, updatedData) => {
    try {
      const response = await api.updatedAd(adId, updatedData);
      setAdInfo(adInfo.map(ad => (ad.id === adId ? response : ad)));
    } catch (err) {
      setError("Erro ao atualizar anúncio.");
    }
  };
  
useEffect(() => {
  const fetchAds = async () => {
    if(user && user.id) {
      try {
          const adsData = await api.getAdsByUser(user.id);
          setAdInfo(adsData);
      } catch (err) {
        setError("Erro ao carregar anúncios do usuário.")
      }
    };
  }

  fetchAds();
}, [user, api]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const slist = await api.getIBGEStates();
      setStateList(slist);

      const userData = await api.getMyAccount();
      if (userData) {
        setUser(userData);
        setCurrentUserId(userData.id);
        setName(userData.name || '');
        setStateLoc(userData.state || '');
        setEmail(userData.email || '');
        setPassword(userData.password || '');
      } else {
        setError("Usuário não encontrado.");
      }
    } catch (err) {
      setError("Erro ao carregar dados.");
    }
  };
  fetchData();
}, [api]);


const handleSubmit = async (e) => {
  e.preventDefault();// Evita o comportamento padrão do formulário
  setDisabled(true);
  setError('');

  try {
    // chama api para atualizar os dados do user
    const response = await api.updateMyAccount({
      name,
      email,
      password,
      state: stateLoc
    });

    if (response.error) {
      setError(response.error); 
    }else {
      alert('Feito com sucesso!')
      setUser(response);
    }
  } catch  (error) {
    setError({error: 'Erro ao atualizar os dados'})
  }

  setDisabled(false);
};

  return (
    <PageContainer>
      <PageTitle>Meus dados</PageTitle>
      <PageArea>
        {error && (
          <ErrorMessage>
            {typeof error === 'string' ? error : 'Erro desconhecido'}
          </ErrorMessage>
      )}
  
        <form onSubmit={handleSubmit}>
          <label className="area">
            <div className="area--title">Nome Completo</div>
            <div className="area--input">
              <input 
                type="text" 
                disabled={disabled} 
                value={name}
                onChange={e=>setName(e.target.value)}
                required
              />
            </div>
          </label>
          <label className="area">
            <div className="area--title">Estado UF</div>
            <div className="area--input">
              <select 
                required
                value={stateLoc} 
                onChange={e=>setStateLoc(e.target.value)}
              >
                  <option></option>
                  {stateList.map((state, index) => 
                    <option key={index} value={state}>{state}</option>
                  )}
              </select>
            </div>
          </label>
          <label className="area">
            <div className="area--title">Email</div>
            <div className="area--input">
              <input 
                type="email" 
                disabled={disabled} 
                value={email}
                onChange={e=>setEmail(e.target.value)}
                required
              />
            </div>
          </label>
          <label className="area">
            <div className="area--title">Senha</div>
            <div className="area--input">
              <input 
                type="password" 
                disabled={disabled} 
                value={password}
                onChange={e=>setPassword(e.target.value)}
                required
              />
            </div>
          </label>
          <label className="area">
            <div className="area--title"></div>
            <div className="area--input">
              <button disabled={disabled}>Alterar</button>
            </div>
          </label>
        </form>
      </PageArea>
      <OthersArea>
        {adInfo && adInfo.length > 0 && (
          <>
            <h2>Meus anuncios</h2>
            <div className="list">
              {adInfo.map((i, k) =>
                <AdItem 
                  key={k} 
                  data={i} 
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  currentUserId={currentUserId}
                />
              )}
            </div>
          </>
        )}
      </OthersArea>
    </PageContainer>
  );
}
export default Page;
