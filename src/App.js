import React, { useState } from 'react';
import Header from './Components/Header';
import Banner from './Components/Banner';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Login from './Components/Login';
import Register from './Components/Register';
import Shop from './Components/Shop';
import Cart from './Components/Cart';
import axios from 'axios';
import BuyProducts from './Components/BuyProducts';
import ContactUs from './Components/ContactUs';
import PaymentSuccess from './Components/PaymentSucccess';
import PaymentCancel from './Components/PaymentCancel';
import VlogPage from './Components/VlogPage';
import Footer from './Components/Footer';
import SearchProducts from './Components/SearchProducts';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false); 

  const fetchCartCount = async () => {
    try {
      const userId = localStorage.getItem('userid');
      if (userId) {
        const response = await axios.get(`http://localhost:8000/api/auth/findcartproduct/${userId}`);
        setCartCount(response.data.data.length); 
      }
    } catch (error) {
      console.error('Error fetching cart data', error);
    }
  };

  const handleSuccess = () => {
    setIsSuccess(true); 
    console.log('Payment successful, isSuccess set to true');
  };

  return (
    <Router>
      <div className="App">
        <Header fetchCartCount={fetchCartCount} cartCount={cartCount} /> 
        
        <Routes>
          <Route path="/" element={<Banner fetchCartCount={fetchCartCount} />} />  
          <Route path="/login" element={<Login />} />  
          <Route path="/register" element={<Register />} /> 
          <Route path='/shop' element={<Shop fetchCartCount={fetchCartCount} />} />
          <Route path='/cart' element={<Cart fetchCartCount={fetchCartCount} />} />
          <Route path='/buyproduct/:id' element={<BuyProducts isSuccess={isSuccess} />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route path='/success' element={<PaymentSuccess onSuccess={handleSuccess} />} />
          <Route path='/cancel' element={<PaymentCancel />} />
          <Route path='/Vlog' element={<VlogPage/>}/>
          <Route path='/SearchProducts' element={<SearchProducts/>}/>
        </Routes>
        {/* <Footer/> */}

      </div>
    </Router>
  );
}

export default App;
