import React, { useEffect, useState } from 'react';
import './PaymentSuccess.css';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate ,useSearchParams} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentSuccess = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [transection, setTransection] = useState(null);

  const fetchPayment = async () => {
    const sessionId = localStorage.getItem("sessionId");
    const response = await axios.get(`http://localhost:5000/paymentdetail/${sessionId}`);

    if (response && response.data) {
      setTransection(response.data);
      console.log("Payment success, calling onSuccess");
      onSuccess();  
    }
  };

  useEffect(() => {
    fetchPayment();
  }, []);

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  

  useEffect(() => {
    const handlePurchaseAfterPayment = async () => {
      if (sessionId) {
        try {
          const response = await axios.post("http://localhost:8000/api/auth/purchaseproducts", {
            sessionId, 
            productId: localStorage.getItem("product_id"), 
            userId: localStorage.getItem("userid"),
            address: localStorage.getItem("user_address"),
            name: localStorage.getItem("user_name"),
            mobile: localStorage.getItem("user_mobile"),
            paymentMethod: "online",
            quantity: localStorage.getItem("product_quantity"),
            price: localStorage.getItem("total_price"),
          });

          toast.success(response.data.msg);
        } catch (error) {
          console.error("Error in purchase details:", error);
          toast.error("Failed to complete purchase");
        }
      }
    };

    handlePurchaseAfterPayment();
  }, [sessionId, navigate]);

  return (
    <div className="payment-success">
      <div>
        {transection ? (
          <>
            Payment : Success
            <br />
            transectionId: {transection.payment_intent}
          </>
        ) : (
          <>Loading...</>
        )}
      </div>
      <div className="success-icon">
        <FaCheckCircle size={80} color="#28a745" />
      </div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase. Your transaction has been completed successfully.</p>
      <button onClick={() => navigate('/shop')}>Continue Shopping</button>
    </div>
  );
}

export default PaymentSuccess;
