import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { PageArea } from './styled';
import useApi from "../../helpers/OlxAPI";

import { PageContainer } from "../../components/MainComponents";
import AdItem from "../../components/partials/AdItem";

let timer; 

const Page = () => {
  const api = useApi();
  const navigate = useNavigate();

  const useQueryString = () => {
    return new URLSearchParams( useLocation().search );
  }
  const query = useQueryString();

  const [q, setQ] = useState( query.get('q') != null ? query.get('q') : '');
  const [cat, setCat] = useState( query.get('cat') != null ? query.get('cat') : '');
  const [state, setState] = useState( query.get('state') != null ? query.get('state') : '');

  const [stateList, setStateList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [adList, setAdList] = useState([]);

  const [resultOpacity, setResultOpacity] = useState(1);

  useEffect(() => {
    let queryString = [];
    if(q) {
      queryString.push(`q=${q}`);
    }
    if(cat) {
      queryString.push(`cat=${cat}`);
    }
    if(state) {
      queryString.push(`state=${state}`);
    }

    navigate({
      search: `?${queryString.join('&')}`
    }, { replace: true });

    if(timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(getAdsList, 2000);
    getAdsList();
    setResultOpacity(1);
  }, [q, cat, state]);

 const getAdsList = async () => {

  try {
    const json = await api.getAds({
      where: {
        OR: [ // Pesquisar por nome (q)
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
        ...(cat && { category: { slug: cat } }), // Filtrar por categoria (se cat estiver definido)
        ...(state && { stateName: state }), // Filtrar por estado (se state estiver definido)
      },
      sort: 'desc',
      limit: 9,
    });

    // Verificar se a resposta da API contém dados
    if (json) {
      const filteredAds = json.filter((ad) => {
        const lowerCaseCatSlug = cat?.toLowerCase() || '';
        const adCategorySlug = ad.category?.slug?.toLowerCase() || ''; // Handle optional category object

        return (
          (!q || ad.title?.toLowerCase().includes(lowerCaseQuery)) &&
          (!cat || adCategorySlug === lowerCaseCatSlug) && // Compare category slugs (lowercase for case-insensitive matching)
          (!state || ad.state?.toLowerCase() === state?.toLowerCase())
        );
      });

      setAdList(filteredAds);
    } else {
      console.error('Erro ao buscar anúncios: Resposta da API vazia.');
      setAdList([]);
      setResultOpacity(1);
    }
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error);
    setAdList([]);
    setResultOpacity(1);
  }
};

  useEffect(() => {
    const getStates = async () => {
      const slist = await api.getIBGEStates();
      setStateList(slist);
    }
    getStates();
  }, []);

  useEffect(() => {
    const getCategorie = async () => {
      const cats = await api.getCategories();
      setCategories(cats);
    }
    getCategorie();
  }, []);

  return (
    <PageContainer>
      <PageArea>
        <div className="leftSide">
          <form method="GET">
            <input 
            type="text" 
            name="query" 
            placeholder="O que você procura?" 
            value={q}
            onChange={e=>setQ(e.target.value)}
            />

            <div className="filterName">Estado:</div>
            <select name="state" value={state} onChange={e=>setState(e.target.value)}>
              <option></option>
              {stateList.map((state, key)=>
                <option key={key} value={state}>{state}</option>
              )}
            </select>

            <div className="filterName">Categoria:</div>
            <ul>
              {categories.map((index, key)=> {
                const imageUrl = `http://localhost:3001/uploads/${index.img}`;
                return(
                <li 
                  key={key} 
                  className={cat==index.slug?'categoryItem active' : 'categoryItem'}
                  onClick={()=>setCat(index.slug)}
                >
                  <img src={imageUrl} alt="" />
                  <span>{index.name}</span>
                </li>
                );
              })}
            </ul>
          </form>
        </div>
        <div className="rightSide">
          <h2>Resultados</h2>
          <div className="list" style={{opacity:resultOpacity}}>
            {adList.map((ad, index) => 
              <AdItem key={index} data={ad} />
            )}
          </div>
        </div>
      </PageArea>
    </PageContainer>
  );
}

export default Page;