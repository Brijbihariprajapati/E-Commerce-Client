import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/esm/Button";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

function SearchProducts({ fetchCartCount }) {
  const navigate = useNavigate();
  const [userid, setuserid] = useState(localStorage.getItem("userid") || "");
  const location = useLocation();
  const { searchQuery } = location.state || {};
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    }
  }, [searchQuery]);

  const fetchSearchResults = async (query) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/auth/search?query=${query}`
      );
      setSearchResults(response.data.searchResult || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const addCart = async (productid) => {
    try {
      const cartdat = { userid, productid };
      const val = await axios.post(
        "http://localhost:8000/api/auth/addcart",
        cartdat
      );

      if (val) {
        toast.success(val.data.msg, {
          position: "top-center",
        });
        fetchCartCount();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.msg || "Server error", {
        position: "top-center",
      });
    }
  };

  return (
    <div>
      {searchResults && searchResults.length > 0 ? (
        <div className="container mt-2">
          <div className="row">
            {searchResults.map((val, i) => (
              <div
                className="col-md-3"
                key={i}
                style={{ marginBottom: "20px" }}
              >
                <Card style={{ width: "18rem" }}>
                  <Card.Img
                    style={{ height: "300px" }}
                    variant="top"
                    src={`http://localhost:8000/public/ProductsImage/${val.image}`}
                  />
                  <Card.Body style={{ fontWeight: "400" }}>
                    <Card.Title
                      style={{ fontWeight: "700", fontSize: "20px" }}
                    >
                      {val.name}
                    </Card.Title>
                    <Card.Title
                      style={{ fontWeight: "600", fontSize: "15px" }}
                    >
                      Price: ${val.price}
                    </Card.Title>
                    <Card.Title
                      style={{ fontWeight: "600", fontSize: "15px" }}
                    >
                      Color: {val.color}
                    </Card.Title>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "75px",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/buyproduct/${val._id}`)}
                      >
                        Buy Now
                      </Button>
                      <Button
                        variant="warning"
                        onClick={() => addCart(val._id)}
                      >
                        Add Cart
                      </Button>
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
  );
}

export default SearchProducts;
