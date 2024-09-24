import React, { useState, useEffect } from "react";
import { PageArea } from './styled';
import useApi from "../../helpers/OlxAPI";
import { doLogin } from "../../helpers/AuthHandler";


import { PageContainer, PageTitle, ErrorMessage } from "../../components/MainComponents";

const Page = () => {
  const api = useApi();

  const [name, setName] = useState('');
  const [stateLoc, setStateLoc] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [stateList, setStateList] = useState([]);

  const [disabled, setDisabled] = useState(false)
  const [error, setError] = useState('')

  
  useEffect(() =>{
    const getStates = async () => {
      const slist = await api.getIBGEStates();
      setStateList(slist);
    }
    getStates();
  }, []) 
  

  const brazilStates = [
    "Acre",
    "Alagoas",
    "Amapá",
    "Amazonas",
    "Bahia",
    "Ceará",
    "Distrito Federal",
    "Espirito Santo",
    "Goiás",
    "Maranhão",
    "Mato Grosso do Sul",
    "Mato Grosso",
    "Minas Gerais",
    "Pará",
    "Paraíba",
    "Paraná",
    "Pernambuco",
    "Piauí",
    "Rio de Janeiro",
    "Rio Grande do Norte",
    "Rio Grande do Sul",
    "Rondônia",
    "Roraima",
    "Santa Catarina",
    "São Paulo",
    "Sergipe",
    "Tocantins",
  ];

  /* useEffect(() =>{
    const getStates = async () => {
      const slist = await OlxAPI.getLocalStates();
      setStateList(slist);
    }
    getStates();
  }, []) */ 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setError('');

    if(password !== confirmPassword) {
      setError('Senhas não são iguais');
      setDisabled(false);
      return;
    }

    const json = await api.register(name, email, password, stateLoc);

    if(json.error) {
      setError(json.error);
    } else {
        doLogin(json.token);
        window.location.href = '/';
    } 
    
    setDisabled(false);
  }

  return (
    <PageContainer>
      <PageTitle>Cadastro</PageTitle>
      <PageArea>
        {error &&
          <ErrorMessage>{error}</ErrorMessage>
        }
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
            <div className="area--title">Confirmar Senha</div>
            <div className="area--input">
              <input 
                type="password" 
                disabled={disabled} 
                value={confirmPassword}
                onChange={e=>setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </label>
          <label className="area">
            <div className="area--title"></div>
            <div className="area--input">
              <button disabled={disabled}>Registrar</button>
            </div>
          </label>
        </form>
      </PageArea>
    </PageContainer>
  );
}

export default Page;