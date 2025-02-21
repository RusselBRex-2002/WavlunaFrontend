import React from "react";
import data from "../data/menu.json";
import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import { Container } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";

import "bootstrap/dist/css/bootstrap.min.css";

import { imagelist } from "../assets/image";

function Dashboard() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [values, setValues] = useState(
    data.Soups.map((item) => ({ id: item.id, value: 0 }))
  );

  //api - value>=0 {value+ id} 

  const updateHandler = () => {
    console.log(values);
  };

  const additionHandler = (id, name) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.id === id ? { ...item, value: item.value + 1 } : item
      )
    );
  };
console.log(values)

  const subtractionHandler = (id) => {
    setValues((prevValues) =>
      prevValues.map((item) =>
        item.id === id ? { ...item, value: Math.max(item.value - 1, 0) } : item
      )
    );
  };

  const getValueById = (id) => {
    const found = values.find((item) => item.id === id);
    return found ? found.value : 0;
  };

  const renderData = data.Soups.map((datas) => {
    return (
      <div className="card">
        <div className="container">
          <img src={imagelist[datas.id - 1]} height="100px" />
          <text>{datas.name}</text>
          <span className="pricing">
            <span>{datas.price}</span>
          </span>
          <div className="cardvalue">
            <Button
              variant="success"
              onClick={() => additionHandler(datas.id, datas.name)}
            >
              +
            </Button>
            <input type="number" value={getValueById(datas.id) || 0} />{" "}
            <Button
              variant="danger"
              onClick={() => subtractionHandler(datas.id)}
            >
              -
            </Button>
          </div>
        </div>
      </div>
    );
  });
  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Navbar className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="#home">
              <img
                alt=""
                src="/img/logo.svg"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              Software
            </Navbar.Brand>
          </Container>
        </Navbar>
      </Navbar>

      <div className="dashboard">
        {renderData}
        {/* <button onClick={updateHandler()}></button> */}
       
      </div>
    </div>
  );
}

export default Dashboard;
