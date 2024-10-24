import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Table } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faTrashCan,faPlus,faMinus,faIndianRupeeSign
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

function Cart({ fetchCartCount }) {

  const Navigate = useNavigate()
  const [product, setProducts] = useState([]);
  const userid = localStorage.getItem('userid') || '';
  console.log('products',product);
  

  const find = () => {
    axios.get(`http://localhost:8000/api/auth/findcartproduct/${userid}`)
      .then((response) => {
        setProducts(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  };

  useEffect(() => {
    find();
  }, [fetchCartCount]); 

  const deletecart = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/auth/deletecartitem/${id}`);
      if (res) {
        toast.success(res.data.msg, {
          position: "top-center",
        });
        find();
        fetchCartCount();
      }
    } catch (error) {
      toast.error('Server error', {
        position: "top-center",
      });
    }
  };

  const incDec = async(id,val)=>{

    try {
      console.log(id,val);
      
    const data = await axios.put(`http://localhost:8000/api/auth/incDec/${id}`,{val})
     toast.success(data.data.msg,{position:'top-right'})
     find();

    } catch (error) {
      toast.error(`failed to ${val==='dec'?'Remove':'Add'}`,{position:'top-right'})
    }
  }

  return (
    <div>
      <Table striped bordered hover style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {product.map((product, index) => (
            <tr key={product.id}>
              <td style={{ width: '50px',fontWeight:"600" }}>{index + 1}</td>
              <td style={{ width: "50px" }}>
                <img
                  style={{ height: "50px", width: "63px", margin: "-7px" }}
                  alt={product.name}
                  src={`http://localhost:8000/public/ProductsImage/${product.image}`}
                />
              </td>
              <td style={{fontWeight:"600"}}>{product.name}</td>
              <td style={{fontWeight:"600"}}><FontAwesomeIcon icon={faIndianRupeeSign} /> {product.price}</td>
              <td ><div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'20px', fontWeight:'700'}}><FontAwesomeIcon icon={faMinus} onClick={()=>incDec(product._id,'dec')} />{product.count}<FontAwesomeIcon onClick={()=>incDec(product._id,'inc')} icon={faPlus} /> </div></td>
              <td style={{fontWeight:"600"}}>{product.price*product.count}</td>
              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "left",
                    gap: "20px",
                  }}
                >
                  <FontAwesomeIcon icon={faBagShopping}                    
                    color="green"
                    className="me-2"
                    size="2x"
                    onClick={()=>Navigate(`/buyproduct/${product._id}`,{state:{product}})}
                  />
                  <FontAwesomeIcon
                    onClick={() => deletecart(product._id)} // Add delete function here
                    icon={faTrashCan}
                    color="red"
                    size="2x"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Cart;
