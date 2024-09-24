import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLogged } from '../helpers/AuthHandler';

const  PrivateRoute = ({ element, isPrivate, ...rest }) => {
  /* const isAuthenticated = /* lógica para verificar se o usuário está autenticado */;
   
  let logged = isLogged();
  // let authorized = (rest.private && !logged) ? false : true;

  if (isPrivate && !logged) {
    return <Navigate to="/signin" />;
  }

  return element;
};

export default PrivateRoute;