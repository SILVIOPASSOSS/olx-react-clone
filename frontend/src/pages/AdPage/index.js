import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { PageArea, Fake, BreadChumb, OthersArea } from './styled';
import useApi from "../../helpers/OlxAPI";
import { PageContainer } from "../../components/MainComponents";
import AdItem from "../../components/partials/AdItem";

const Page = () => {
  const api = useApi();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [adInfo, setAdInfo] = useState({});
  
  useEffect(() => {
    const fetchAdData = async (id) => {
      try {
        await api.incrementAdViews(id);
        const json = await api.getAd(id);
        setAdInfo(json); // Atualize o estado com o objeto recebido
      } catch (error) {
        console.error('Erro ao buscar dados do anuncio', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdData(id);
  }, [id]);

  const formatDate = (date) => {
    let cDate = new Date(date);
    let months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    let cDay = cDate.getDate();
    let cMonth = cDate.getMonth();
    let cYear = cDate.getFullYear();

    return `${cDay} de ${months[cMonth]} de ${cYear}`;
  }

  return (
    <PageContainer>
      <BreadChumb>
        Você está aqui:
        <Link to="/">Home</Link>
        /
        <Link to={`/ads?state=${adInfo?.user?.state}`}>{adInfo?.user?.state}</Link>
        / 
        {adInfo?.category && adInfo?.category.name && (
          <Link to={`/ads?state=${adInfo?.user?.state}&cat=${adInfo?.category?.slug}`}>{adInfo?.category?.name}</Link>
        )}
        / {adInfo?.title}
      </BreadChumb>
      <PageArea>
        <div className="leftSide">
          <div className="box">
            <div className="adImage">
              {loading ? (
                <Fake height={320} />
              ) : (
                <Slide
                  easing="ease"
                  duration={5000}
                  transitionDuration={500}
                  indicators={true}
                >
                  {adInfo?.images && adInfo?.images.length > 0 ? (
                    adInfo.images.map((image, index) => (
                      <div key={index} className="each-slide">
                        <img src={`http://localhost:3001/media/${image.url}`} alt={`Image ${index}`} />
                      </div>
                    ))
                  ) : (
                    <div className="each-slide">
                      <img src="http://localhost:3001/media/placeholder.png" alt="No image available" />
                    </div>
                  )}
                </Slide>
              )}
            </div>
            <div className="adInfo">
              <div className="adName">
                {loading && <Fake height={20} />}
                {adInfo?.title && <h2>{adInfo.title}</h2>}
                {adInfo?.createdAt && <small>Criado em {formatDate(adInfo.createdAt)}</small>}
              </div>
              <div className="adDescription">
                {loading && <Fake height={100} />}
                {adInfo?.description}
                <hr />
                {adInfo?.views !== undefined && <small>Visualizações: {adInfo.views}</small>}
              </div>
            </div>
          </div>
        </div>
        <div className="rightSide">
          <div className="box box--padding">
            {loading && <Fake height={20} />}
            {adInfo?.priceNegotiable && "Preço Negociável"}
            {!adInfo?.priceNegotiable && adInfo?.price && 
              <div className="price">Preço: 
                <span>
                  {new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(adInfo.price)}
                </span>
              </div>
            }
          </div>
          {loading && <Fake height={50} />}
          {adInfo?.user &&
            <>
              <a 
                href={`mailto:${adInfo.user.email}`} 
                target="_blank" 
                className="contactSellerLink"
              >
                Fale com o vendedor
              </a>
              <div className="createdBy box box--padding">
                <strong>{adInfo.user.name}</strong>
                <small>E-mail: {adInfo.user.email}</small>
                <br/>
                <small>Estado: {adInfo.user.state}</small>
              </div>
            </>
          }
        </div>
      </PageArea>
      <OthersArea>
        {adInfo?.others && adInfo.others.length > 0 &&
          <>
            <h2>Outras ofertas do vendedor</h2>
            <div className="list">
              {adInfo.others.map((i, k) =>
                <AdItem key={k} data={i} />
              )}
            </div>
          </>
        }
      </OthersArea>
    </PageContainer>
  );
}

export default Page;
