// Verifica se o usuário está logado
export const isLogged = () => {
  // Obtém o token do localStorage
  const token = localStorage.getItem('token');
  // Retorna true se o token existir, false caso contrário
  return !!token;
};

// Faz login e armazena o token no localStorage
export const doLogin = (token, rememberPassword = false) => {
  // Armazena o token no localStorage (não há diferença entre lembrar e não lembrar aqui, mas o parâmetro pode ser útil para futuro uso)
  localStorage.setItem('token', token);
};

// Faz logout removendo o token do localStorage
export const doLogout = () => {
  localStorage.removeItem('token');
};

// Obtém o token armazenado no localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};
