import React, { useEffect, useState } from "react";
import "../Components/Header.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { debounce } from "lodash";

const Header = ({ fetchCartCount, cartCount }) => {
  const [email, setEmail] = useState(null);
  const [banner, setBanner] = useState({
    name: "",
    description: "",
    offerText: "",
  });
  const [query, setQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  console.log("suggestions:", searchSuggestions);

  const findbannerdata = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/auth/findBannerText`
      );
      if (response.data.data && response.data.data.length > 0) {
        const bannerData = response.data.data[0];
        setBanner({
          name: bannerData.name || "",
          description: bannerData.description || "",
          offerText: bannerData.offerText || "",
        });
      }
    } catch (error) {
      toast.error("Failed to fetch banner text");
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
    findbannerdata();
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [fetchCartCount, navigate]);

  const loginaction = () => {
    if (email) {
      localStorage.removeItem("email");
      localStorage.removeItem("userid");
      setEmail(null);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const fetchSearchSuggestions = async (searchTerm) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/auth/search?query=${searchTerm}`
      );
      setSearchSuggestions(response.data.searchResult || []);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    }
  };

  const debouncedFetchSuggestions = debounce((searchTerm) => {
    fetchSearchSuggestions(searchTerm);
  }, 300);

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setQuery(searchTerm);

    if (searchTerm) {
      debouncedFetchSuggestions(searchTerm);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setShowDropdown(false);
    navigate("/SearchProducts", { state: { searchQuery: suggestion.name } });
  };

  const handleSearchSubmit = () => {
    if (query) {
      navigate("/SearchProducts", { state: { searchQuery: query } });
    }
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <header className="header">
      <div className="logo">
        <h1>{banner.name}</h1>
      </div>
      <nav className="nav-links">
        <p className={isActive("/")} onClick={() => navigate("/")}>
          Home
        </p>
        <p className={isActive("/shop")} onClick={() => navigate("/shop")}>
          Shop
        </p>
        <p className={isActive("/Vlog")} onClick={() => navigate("/Vlog")}>
          Blog
        </p>
        <p className={isActive("/contact")} onClick={() => navigate("/contact")}>
          Contact
        </p>
      </nav>
      <div className="nav-icons">
        <div
          className="nav-icon cart-icon"
          onClick={() => navigate("/cart")}
          style={{ position: "relative" }}
        >
          🛒
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-22px",
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                padding: "1px 6px",
                fontSize: "10px",
                fontWeight: "bold",
                marginRight:'15px'
              }}
            >
              {cartCount}
            </span>
          )}
        </div>

        <div className="search-container" style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={handleSearch}
            className="search-input"
            onBlur={() => {
              // Only hide dropdown if input is empty
              if (!query) {
                setShowDropdown(false);
              }
            }}
            onFocus={() => {
              if (query) {
                setShowDropdown(true);
              }
            }}
          />
          <span
            style={{ cursor: "pointer" }}
            className="search-icon"
            onClick={handleSearchSubmit}
          >
            🔍
          </span>

          {showDropdown && searchSuggestions.length > 0 && (
            <ul className="search-dropdown" style={{ padding: "0px" }}>
              {searchSuggestions.map((suggestion, index) => (
                <li
                  style={{ listStyleType: "none", cursor: "pointer" }}
                  key={index}
                  onMouseDown={() => handleSuggestionClick(suggestion)} 
                  className="search-suggestion-item"
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="nav-icon user-icon" onClick={() => loginaction()}>
          <div>👤</div>
          <div style={{ marginLeft: "5px" }}>
            {email ? "Logout" : "Login"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
