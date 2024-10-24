import React from 'react';
import './PaymentCancel.css';
import { FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
    const navigate = useNavigate()
  return (
    <div className="payment-cancel">
      <div className="cancel-icon">
        <FaTimesCircle size={80} color="#dc3545" />
      </div>
      <h1>Payment Canceled</h1>
      <p>We’re sorry, your transaction could not be completed at this time.</p>
      <button onClick={() =>navigate('/shop')}>Return to Shop</button>
    </div>
  );
}

export default PaymentCancel;
