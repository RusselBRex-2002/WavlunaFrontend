import React from "react";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Offcanvas, Button,Toast } from "react-bootstrap";


function Card() {
  const [data, setData] = useState([]);
  const [cart, setCart] = useState([])
  const [categories, setCategories] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState(false)


  const categorize = () => {

    data.forEach((item) => {
      let index = -1;
      index = categories.findIndex((i) => i === item.category)
      if (index === -1) {
        setCategories([...categories, item.category])

      }
    })

  }

  function ConfirmHandler() {

    cart.forEach((item) => {
      fetch(
        `https://wavlunabackend-render.onrender.com/sale/quantity?id=${item.id}&quantity=${item.value}`,
        {
          method: "PUT",
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          return response.json();
        })
        .then((data) => {
          setData(data);
        });
    })

    setCart([])
    setTotal(0)
    setShow(false)

    setToast(true)
    setTimeout(() => setToast(false), 3000);

  



  }



  //https://wavlunabackend-render.onrender.com/sale/quantity?id=2&quantity=2
  //https://wavlunabackend-render.onrender.com/sale/quantityReset?id=2

  useEffect(() => {
    fetch(`https://wavlunabackend-render.onrender.com/sale`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setData(data);
      });
  }, []);

  const totalCalc = () => {
    let cost = 0;

    cart.forEach((each) => {
      cost += each.total
    })
    setTotal(cost)
  }

  const inputHandler = (id) => {
    return cart.filter((filter) => filter.id === id).map((each) => each.value)
  }

  function plusHandler(dataid, dataprice, datafoodItem) {

    if (!cart.find((f) => f.id === dataid)) {
      cart.push({ id: dataid, foodItem: datafoodItem, price: dataprice, value: 0, total: 0 })
    }

    cart.filter((item) => item.id === dataid ? item.value += 1 : item.value).map((map) => (map.total = map.price * map.value))

    totalCalc()
  }

  function minusHandler(dataid) {

    let index = -1;

    cart.map((item) => {
      if (item.id === dataid) {
        item.value -= 1
        item.total = item.price * item.value
      }
      index = cart.findIndex((ind) => ind.value <= 0)
      if (index > -1) {
        cart.splice(index, 1)
      }
    })


    totalCalc()
  }



  const renderItems = () => {
    return (
      <div>
        {
          categories.map((cat) => (
            <div>
              <h1>{cat}</h1>
              <div className="d-flex">
                {data.filter((f) => f.category === cat).map((datas) => (
                  <div>

                    <div className="container d-flex">
                      <div className="card p-3">
                        <img className="card-img-top" src={datas.foodImg} height="100px" />
                        {console.log(datas)}
                        <text className="card-title">{datas.foodItem}</text>
                        <text className="pricing h-5" >Price: {datas.price}</text>
                        <div className="cardvalue d-flex gap-2 m-2">
                          <input variant="outlined" className="form-control" placeholder="Quantity" type="number" id={datas.id} value={inputHandler(datas.id)} readOnly />
                          <Button
                            variant="success"
                            onClick={() => plusHandler(datas.id, datas.price, datas.foodItem)}
                          >
                            +
                          </Button>

                          <Button
                            variant="danger"
                            onClick={() => minusHandler(datas.id)}
                          >
                            -
                          </Button>
                        </div>
                        <input className="form-control" placeholder="Feedback"/>
                      </div>
                    </div>


                  </div>

                ))
                }
              </div>
            </div>
          ))
        }
      </div>
    );
  };



  const reviewItems = data.map((datum) => (
    <div>
      <span>{datum.foodItem}</span>
      <span>{datum.category}</span>
      <span>{datum.quantitySold}</span>

    </div>
  ));
  return (
    <div className="container-fluid d-flex flex-column">
      {categorize()}
      <div className="d-flex flex-row">
        {renderItems()}
      </div>

      <Toast show={toast} className="position-absolute top-50 start-50">
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        </Toast.Header>
        <Toast.Body>Order Completed</Toast.Body>
      </Toast>

      <Button variant="primary" className="col-sm-1" onClick={() => setShow(true)}>
        Add to Cart
      </Button>

      <Offcanvas placement="end" show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Checkout</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cart.map((item) => (
            <div className="card d-flex p-3">
              <text className="card-subtitle">{item.foodItem}</text>
              <text className="card-subtitle">Cost: {item.price}</text>
              <text className="card-subtitle">Qty: {item.value}</text>

            </div>
          ))
          }
          <div className="container">
            <div className="d-flex flex-row gap-2 card mt-5 p-3 align-items-center">
              <text className="card-title h3">Total</text>
              <input className="form-control fs-5" id="totalCost" value={total} readOnly />
            </div>

            <button
              variant="contained"
              id="confirmQuantity"
              type="submit"
              className="btn btn-primary align-right"
              onClick={
                ConfirmHandler
              }
            >
              Confirm
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* <div className="row">
        {reviewItems}
      </div> */}

    </div>
  );
}

export default Card;
