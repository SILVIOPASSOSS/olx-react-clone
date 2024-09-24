import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {  SearchArea, PageArea } from './styled';
import useApi from "../../helpers/OlxAPI";

import { PageContainer } from "../../components/MainComponents";
import AdItem from "../../components/partials/AdItem";

const Page = () => {
  const api = useApi();

  const [stateList, setStateList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [adList, setAdList] = useState([]);

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

  useEffect(() => {
    const getRecentAds = async () => {
      const json = await api.getAds({
        sort: 'desc',
        limit: 8
      });
      setAdList(json);
    }
    getRecentAds();
  }, [api]);

  return (
    <>
      <SearchArea>
        <PageContainer>
          <div className="searchBox">
            <form method="GET" action="/ads">
              <input type="text" name="q" placeholder="O que você procura?" />
              <select name="state" id="">
                {stateList.map((state, index) => 
                  <option key={index} value={state}>{state}</option>
                )}
              </select>
              <button>Pesquisar</button>
            </form>
          </div>
          <div className="categoryList">
            {categories.map((category, index) => {
              const imageUrl = `http://localhost:3001/uploads/${category.img}`;
              return(
                <Link key={index} to={`/ads?cat=${category.slug}`} className="categoryItem">
                  <img src={imageUrl} alt="" />
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>
        </PageContainer>
      </SearchArea>
    
      <PageContainer>
        <PageArea>
          <h2>Anúncios Recentes</h2>
          <div className="list">
            {adList.map((ad, index) => 
              <AdItem key={index} data={ad} />
            )}
          </div>
          <Link to="/ads" className="seeAllLink">Ver todos</Link>

          <hr />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Eum, possimus. Veritatis eaque et ad nihil laudantium amet natus. 
            Laudantium beatae voluptas praesentium dolorum tempora rem quam et non officia iste!
        </PageArea>
      </PageContainer>
    </>
  );
}

export default Page;