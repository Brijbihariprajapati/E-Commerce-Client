import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useParams,useNavigate } from "react-router-dom";
import "./BuyProducts.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus,faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import {loadStripe} from '@stripe/stripe-js';

const BuyProducts = ({isSuccess}) => {
  const { id } = useParams(); 
  const loaction = useLocation()
  const count = loaction?.state?.product?.count || 1
  const navigate = useNavigate()

  console.log('count',count);
  const [offer, setoffer] = useState(0)
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(loaction ?count:1); 
  const [totalPrice, setTotalPrice] = useState(0); 
  console.log('type',typeof(offer));
  console.log(offer);
  
  const [userInfo, setUserInfo] = useState({
    name: "",
    address: "",
    mobile: "",
    paymentMethod: "cash",
  });
console.log('price',userInfo.totalPrice);

const find = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/auth/findBannerText`);
    if (response.data.data) {
      const bannerData = response.data.data;

      bannerData.map((v)=>{
          return setoffer({
              
              offer:v.offer||''
            });
      })
     
    }
  } catch (error) {
    toast.error("Failed to fetch banner text");
    console.error("Fetch error:", error);
  }
};


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/auth/findproductbyid/${id}`
        );
        const fetchedProduct = response.data.data;
        console.log('ff',fetchedProduct.price);
        
        setProduct(fetchedProduct);
        setTotalPrice(fetchedProduct.price * quantity)
      } catch (error) {
        console.error("Error fetching product:", error);
        if(error.response===409){
          toast.error(error.response.data.msg)
        }
      }
    };

    fetchProduct();
    find()
  }, [id]);

  const incDec = (val) => {
    setQuantity((prevQuantity) => {
      const newQuantity = val === "inc" ? prevQuantity + 1 : prevQuantity - 1;
      const validQuantity = newQuantity < 1 ? 1 : newQuantity; 

      if (loaction) {
        setTotalPrice(product.price * validQuantity); 
      }
      
      return validQuantity;
    });
  };

  // const [amount ,setAmount]=useState(0)
  

  const setlocal = (price) => {
    // const price = totalPrice-totalPrice*offer.offer/100
    localStorage.setItem("product_id", product._id);
    localStorage.setItem("user_address", userInfo.address);
    localStorage.setItem("user_name", userInfo.name);
    localStorage.setItem("user_mobile", userInfo.mobile);
    localStorage.setItem("product_quantity", quantity);
    localStorage.setItem("total_price", price);
  };
  
  // After ensuring `product` and `userInfo` are defined, call the function
  // const price = totalPrice-totalPrice*offer.offer/100
  const handlepayment = async (price) => {
    setlocal(price);
    const stripe = await loadStripe('pk_test_51QAFSxBU5ng3PRs8K1nwiozbe31lOqwxDphIuD9tBNI7lzkYLaHJ4uDME2RB0S1D11IhmNPUseW7im4uRRlD65pa00hoR84kXD');
    try {
      const { data } = await axios.post('http://localhost:8000/api/auth/create-payment', {
        totalPrice:price,
        quantity
      });
      const sessionId = data.sessionId;
  
      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId });
  
      if (result.error) {
        toast.error("Payment failed: " + result.error.message);
      }
    } catch (error) {
      console.error("Payment process error:", error);
      toast.error("Payment initialization failed");
    }
  };
  

    // useEffect(() => {
    //   console.log('isSuccess state updated:', isSuccess);
    //   if (isSuccess) {
    //     console.log("Payment success, calling buydetaile()");
    //     buydetaile();  // Trigger purchase after payment success
    //   }
    // }, [isSuccess]);




  
const buydetaile =async ()=>{

  console.log('prr',product._id);
  
  try {
        const response = await axios.post("http://localhost:8000/api/auth/purchaseproducts", {
          productId: product._id,
          userId: localStorage.getItem("userid"),
          address: userInfo.address,
          name: userInfo.name,
          mobile: userInfo.mobile,
          paymentMethod: userInfo.paymentMethod,
          quantity,
          price: totalPrice
        });
        toast.success(response.data.msg);
        navigate(-1)
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            toast.error(error.response.data.msg);
          }if (error.response.status === 404) {
            toast.error(error.response.data.msg);
          }if (error.response.status === 500) {
            toast.error(error.response.data.msg);
          } if(error.response.status === 409){
            toast.error(error.response.data.msg)
          }
          
        }
      }
}

  const handlePurchase = async (price) => {
    if (!product) return; 
    if(!localStorage.getItem('email')) return navigate('/login')


      if(userInfo.paymentMethod ==='online'){
      await  handlepayment(price)
      }else{
        buydetaile()
      }
  //   
  };
  
  
  if (!product) return <div>Loading...</div>; 




  


  return (
    <div className="buy-product-page">
      <div className="product-details">
        <h2>{product.name}</h2>
        <img
          src={`http://localhost:8000/public/ProductsImage/${product.image}`} 
          alt={product.name}
          style={{ width: "300px", height: "300px" }}
        />
        <p style={{fontWeight:'700'}}>Price: <FontAwesomeIcon icon={faIndianRupeeSign} /> {product.price}</p>
        <p>Available Stock: {product.available}</p>
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <div className="quantity-controls" style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'15px'}}>
            <FontAwesomeIcon icon={faMinus} onClick={() => incDec("dec")} />
            <span>{quantity}</span>
            <FontAwesomeIcon icon={faPlus} onClick={() => incDec("inc")} />
          </div>
          <label>{offer.offer?`Total Amount After ${offer.offer}% Discount`:'Total Amount:'}</label>
          
          <h1 style={{fontWeight:'700'}}><FontAwesomeIcon icon={faIndianRupeeSign} /> {totalPrice-totalPrice*offer.offer/100}</h1> 
        </div>
      </div>

      <div className="user-info">
        <h3>User Information</h3>
        <form>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={userInfo.name}
              onChange={(e) =>
                setUserInfo({ ...userInfo, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              value={userInfo.address}
              onChange={(e) =>
                setUserInfo({ ...userInfo, address: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="mobile">Mobile Number:</label>
            <input
              type="tel"
              id="mobile"
              value={userInfo.mobile}
              onChange={(e) =>
                setUserInfo({ ...userInfo, mobile: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Payment Method:</label>
            <div>
              <input
                type="radio"
                id="cash"
                name="paymentMethod"
                value="cash"
                checked={userInfo.paymentMethod === "cash"}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, paymentMethod: e.target.value })
                }
              />
              <label htmlFor="cash">Cash on Delivery</label>
            </div>
            <div>
              <input
                type="radio"
                id="online"
                name="paymentMethod"
                value="online"
                checked={userInfo.paymentMethod === "online"}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, paymentMethod: e.target.value })
                }
              />
              <label htmlFor="online">Online Payment</label>
            </div>
          </div>
        </form>
        <button onClick={()=>handlePurchase(totalPrice-totalPrice*offer.offer/100)}>Buy Now</button>
      </div>
    </div>
  );
};

export default BuyProducts;
