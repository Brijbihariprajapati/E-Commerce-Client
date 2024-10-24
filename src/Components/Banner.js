import React, { useEffect, useState } from 'react';
import './Banner.css'; 
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {useNavigate} from 'react-router-dom'
import axios from "axios";
import { toast } from 'react-toastify';



const Banner = ({fetchCartCount}) => {
    const Navigate = useNavigate()
    const [userid, setuserid] = useState(localStorage.getItem('userid') || '');
    const [banner,setBannerName] = useState([])
    console.log('bann',banner);
    

    const findbannerdata = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/auth/findBannerText`);
        if (response.data.data) {
          const bannerData = response.data.data;
  
          bannerData.map((v)=>{
              setBannerName({
                  name: v.name || "",
                  description: v.description || "",
                  offerText: v.offerText || "",
                });
          })
         
        }
      } catch (error) {
        toast.error("Failed to fetch banner text");
        console.error("Fetch error:", error);
      }
    };
  

    const [product,setProducts] = useState([])
    const find = () => {
        axios.get("http://localhost:8000/api/auth/randomproducts")
          .then((response) => {
            setProducts(response.data.data);
            console.log(response.data.data);
          })
          .catch((error) => {
            console.error("There was an error fetching the products!", error);
          });
      };
      useEffect(() => {
        findbannerdata()
        find();

      }, []);
      const addCart = async (productid) => {
        try {
            const cartdat = { userid, productid };
            const val = await axios.post('http://localhost:8000/api/auth/addcart', cartdat);

            if (val) {
                toast.success(val.data.msg,{
                  position: "top-center",  
              });
                fetchCartCount();  
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error(error.response?.data?.msg || 'Server error',{
              position: "top-center",  
          });
        }
    };
  return (
        <div>

      <section className="banner">
      <div className="banner-content">
      <h2>{banner.description}</h2>

        <h1>{banner.offerText}</h1>
        <button className="shop-now-btn" onClick={()=>{Navigate('/shop')}}>Shop Now</button>
      </div>
      {/* You can use an image for the model */}
      <img 
        src="http://pluspng.com/img-png/girl-with-shopping-bags-png-happy-girl-png-image-590.png" 
        alt="Model" 
        className="banner-image"
        />
    </section>
    <div>
      {product && product.length > 0 ? (
      
            <div className="container mt-2" >
            <div className="row">
              {product.map((val, i) => (
                <div className="col-md-3" key={i} style={{ marginBottom: '20px' }}>
                  <Card style={{ width: '18rem' }}>
                    <Card.Img style={{height:'300px'}} variant="top" src={`http://localhost:8000/public/ProductsImage/${val.image}`} />
                    <Card.Body style={{ fontWeight: '400' }}>
                      <Card.Title style={{ fontWeight: '700', fontSize: '20px' }}>{val.name}</Card.Title>
                      <Card.Title style={{ fontWeight: '600', fontSize: '15px' }}>Price: ${val.price}</Card.Title>
                      {/* <Card.Text>
                        <h4>About:</h4>
                        Some quick example text to build on the card title and make up the bulk of the card's content.
                      </Card.Text> */}
                     <div style={{ display: 'flex', alignItems: 'center', gap: '75px', justifyContent: 'center' }}>
                                            <Button variant="primary"onClick={()=>Navigate(`/buyproduct/${val._id}`)}>Buy Now</Button>
                                            <Button variant="warning" onClick={() => addCart(val._id)}>Add Cart</Button>
                                        </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
        
      ) : (
        <p>No products available.</p>
      )}
    </div>
        </div>
    
  );
};

export default Banner;
