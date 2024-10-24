import React from "react";
import { useState, useEffect } from "react";
import "./VlogPage.css";
import axios from "axios";
import { toast } from "react-toastify";

const VlogPage = () => {
  const [vlog, setVlog] = useState([]);
  const [data, setdata] = useState([])

  const find = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/auth/findVlog"
      );
      if (response.status === 200) {
        setVlog(response.data.data);
        const filteredData = response.data.data.filter((v)=>v);
        setdata(filteredData[Math.floor(Math.random() * filteredData.length)]);

    console.log('filter',filteredData);
    
      }
    } catch (error) {
      toast.error("Failed To load Vlogs");
    }
  };

  useEffect(() => {
    find();
  }, []);
  return (
    <div className="vlog-page">
      <section className="featured-vlog">
        <img
          src={`http://localhost:8000/public/Vlog/${data.image}`}
          alt="Featured Vlog"
        />
        <div className="featured-info">
          <div
            style={{
                padding:'0px 50px 0px 50px',
              display: "flex",
              alignItems: "start",
              justifyContent: "start",
              flexDirection: "column",
              gap: "20px",
              textAlign:'left'
            }}
          >
            <h1 style={{ color: "#f18cb5", fontWeight: 600 }}>
             {data.title}
            </h1>
            <h4 style={{ fontWeight: 300 }}>
             {data.description}
            </h4>
            <p style={{ fontWeight: 600, color: "#65a077" }}>
            {new Date(data.date).toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      <section className="vlog-list">
        <h2>My Vlogs</h2>
        <div className="vlogs">
          {vlog.map((vlog) => (
            <div className="vlog-item" key={vlog.id} onClick={()=>setdata(vlog)}>
              <img
                src={`http://localhost:8000/public/Vlog/${vlog.image}`}
                alt={vlog.title}
              />
              <div className="vlog-content">
                <h3>{vlog.title}</h3>
                <p>{vlog.description}</p>
                <span className="vlog-date">
                  {new Date(vlog.date).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default VlogPage;
