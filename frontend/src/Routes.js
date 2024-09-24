import React from "react";
import { Routes, Route } from 'react-router-dom';

import PrivateRoute from "./components/RouteHandler";

import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AdPage from './pages/AdPage';
import AddAd from './pages/AddAd';
import Ads from './pages/Ads';
import MyAccount from './pages/MyAccount';

import NotFound from './pages/NotFound';

export default () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/ad/:id" element={<AdPage />} />
      <Route path="/ads" element={<Ads />} />
      <Route 
        path="/post-an-ad" 
        element={<PrivateRoute isPrivate={true} element={<AddAd />} /> }
      />
      <Route 
        path="/user" 
        element={<PrivateRoute isPrivate={true} element={<MyAccount />} /> }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}