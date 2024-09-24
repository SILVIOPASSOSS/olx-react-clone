import { getToken } from './AuthHandler';

const BASEAPI = 'http://localhost:3001';

/* const loginUser = async (email, password) => {
  const response = await fetch(`${BASEAPI}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('token', data.token); // Armazena o token no localStorage
  } else {
    console.error('Erro ao fazer login:', data.error);
  }

  return data;
};
 */
const apiFetchPost = async (endpoint, body) => {
  const token = getToken(); // Recupera o token do localStorage
  const res = await fetch(`${BASEAPI}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '', // Adiciona o token no cabeçalho
    },
    body: body,
  });

  const json = await res.json();

  if (res.status === 403) {
    window.location.href = '/signin';
    return;
  }

  return json;
};

// teste apiFetchPut
const apiFetchPut = async (endpoint, body) => {
  const token = getToken(); // Recupera o token do localStorage

  const headers = {
    'Authorization': token ? `Bearer ${token}` : '' // Adiciona o token no cabeçalho
  };

  const res = await fetch(`${BASEAPI}${endpoint}`, {
    method: 'PUT',
    headers: body instanceof FormData ? headers : { ...headers, 'Content-Type': 'application/json' }, // Remover 'Content-Type' para FormData
    body: body instanceof FormData ? body : JSON.stringify(body) // Enviar FormData ou JSON conforme apropriado
  });

  const json = await res.json();

  if (res.status === 403) {
    window.location.href = '/signin';
    return;
  }

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  return json;
};

/* const apiFetchPut = async (url, formData, token) => {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`, // Adicione o token de autenticação se necessário
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar anúncio:', error);
    throw error;
  }
}; */


const apiFetchGet = async (endpoint, body = {}) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
  const token = getToken();

  const headers = {
    'Authorization': token ? `Bearer ${token}` : '', // Adiciona o token no cabeçalho
    'Content-Type': 'application/json'
  };

  try {
    const queryString = new URLSearchParams(body).toString();
    const url = queryString ? `${BASEAPI + endpoint}?${queryString}` : `${BASEAPI + endpoint}`;
    const res = await fetch(url, { headers });
    const json = await res.json();

    if (res.status === 403) {
      window.location.href = '/signin';
      return [];// Retorna um objeto vazio para o caso de erro
    }

    // Retorna um array ou objeto, dependendo da resposta
    if (Array.isArray(json)) {
      return json;
    } else {
      return json;
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return {}; // Retorna um objeto vazio em caso de erro
  }
};

const apiFetchLogin = async (endpoint, body) => {                
  const response = await fetch(`${BASEAPI}${endpoint}`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  });
  const json = await response.json();

  if (response.status === 403){
    window.location.href = '/signin';
    return;
  }

  return json;
};

const apiFetchRegister = async (endpoint, body) => {
  const response = await fetch(`${BASEAPI}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    console.error('Erro ao registrar:', data.error);
    return data;
  }
};
const getFilteredAds = async (q, cat, state) => {
  try {
    const response = await fetch(`http://localhost:3001/ads?q=${q || ''}&cat=${cat || ''}&state=${state || ''}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error);
    throw error;
  }
};

const apiFetchDelete = async (endpoint) => {
  const token = getToken();
  try {
    const res = await fetch(`${BASEAPI}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json' // Adiciona Content-Type, se necessário
      }
    });

    if (res.status === 403) {
      window.location.href = '/signin';
      return;
    }

    if (!res.ok) {
      const errorText = await res.text(); // Lê a resposta como texto para depuração
      console.error('Erro na resposta:', errorText);
      throw new Error(`Erro na API: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Erro na função apiFetchDelete:', error);
    throw error; // Propaga o erro para tratamento externo, se necessário
  }
};

const OlxAPI = {
  login: async (email, password) => {
    const json = await apiFetchLogin('/auth/signin', { email, password });
    return json;
  },

  register: async (name, email, password, stateLoc) => {
    const json = await apiFetchRegister('/auth/register', { name, email, password, state: stateLoc });
    return json;
  },

  // acessar o próprio perfil
  getMyAccount: async () =>{
    const json = await apiFetchGet('/user');
    return json;
  },

  updateMyAccount: async (body) => {
    const json = await apiFetchPut('/user', body);
    return json;
  },

  getAdsByUser: async (userId) => {
    const json = await apiFetchGet(`/ads/user/${userId}`);
    return json;
  },

  getIBGEStates: async () => {
    const json = await apiFetchGet('/states');
    return json;
  },
  
  getCategories: async () => {
    const json = await apiFetchGet('/categories');
    return json;
  },

  getAds: async (options) => {
    const json = await apiFetchGet('/ads', options);
    return json;
  },

  getFilteredAds: async ({ q, cat, state }) => {
    const queryString = new URLSearchParams({ q, cat, state }).toString();
    const response = await apiFetchGet(`/ads?${queryString}`);
    return response;
  },
  
  getAd: async (id) => {
    const response = await apiFetchGet(`/ads/${id}`);
    return response;
  },

  postAd: async (id) => {
    const response = await apiFetchPost(`/ads/${id}`);
    return response;
  },

  addAd: async (fData) => {
    const json = await apiFetchPost('/ads', fData);
    return json;
  },

  // teste apiFetchPut novo
  updatedAd: async (id, formData) => {
    try {
      const json = await apiFetchPut(`/ads/${id}`, formData); // Envia o FormData
      return json;
    } catch (error) {
      console.error('Erro ao atualizar o anúncio:', error);
    }
  },

  deleteAd: async (id) => {
    const json = await apiFetchDelete(`/ads/${id}`);
    return json;
  },

  incrementAdViews: async (id) => {
    const token = getToken(); // Recupera o token do localStorage
    const res = await fetch(`${BASEAPI}/ads/item/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '', // Adiciona o token no cabeçalho
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const json = await res.json();
    return json;
  }
};

export default () => OlxAPI;