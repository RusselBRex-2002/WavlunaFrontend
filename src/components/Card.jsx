import React, { useRef } from "react";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Offcanvas, Button, Toast } from "react-bootstrap";


function Card() {
  const [data, setData] = useState([]);
  const [cart, setCart] = useState([])
  const [categories, setCategories] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState(false);
  //Added variable requestBody
  const [requestBody, setRequestBody] = useState({
    foodItems: [],
    modeOfPayment: ""
  });
  const feedBack = useRef(null)
  const [modeOfPayment, setModeOfPayment] = useState("Cash");


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


    fetch(`https://wavlunabackend-render.onrender.com/purchase/add`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
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

  const getFormattedCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const requestHandler = () => {
    cart.map(cartmap => {
      data.map(datamap => {
        if (cartmap.id === datamap.id && requestBody.foodItems.findIndex(f => f.food === cartmap.foodItem) === -1) {

          requestBody.foodItems.push({ category: datamap.category, food: datamap.foodItem, quantity: cartmap.value, orderDate: getFormattedCurrentDate(), feedback: cartmap.feedback })
          requestBody.modeOfPayment = modeOfPayment
        }
      })
    })

  }

  const paymentModeHandler = (mode) => {

    setModeOfPayment(mode)
    requestBody.modeOfPayment = mode

  }

  const inputHandler = (id) => {
    return cart.filter((filter) => filter.id === id).map((each) => each.value)
  }

  const feedbackHandler = (dataid, value) => {
    cart.map(cartmap => {
      if (cartmap.id === dataid) {
        cartmap.feedback = value
      }
    })

  }


  function plusHandler(dataid, dataprice, datafoodItem) {

    if (!cart.find((f) => f.id === dataid)) {
      cart.push({ id: dataid, foodItem: datafoodItem, price: dataprice, value: 0, total: 0, feedback: "" })

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
                        <input className="form-control" placeholder="Feedback" ref={feedBack}
                          onChange={(e) => {
                            feedbackHandler(datas.id, e.target.value);
                          }}
                        />
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

      <Button variant="primary" className="col-sm-1" onClick={() => {
        setShow(true)
      }}>
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

            <div className="container gap-1 d-flex flex-row">
              <div className="form-check">

                <label className="form-check-label">
                  <input className="form-check-input" type="radio" checked={modeOfPayment === "Cash"} onClick={() => paymentModeHandler("Cash")} />
                  Cash
                </label>
              </div>

              <div className="form-check">

                <label className="form-check-label">
                  <input className="form-check-input" type="radio" checked={modeOfPayment === "UPI"} onClick={() => paymentModeHandler("UPI")} />
                  UPI
                </label>
              </div>
            </div>


            <button
              variant="contained"
              id="confirmQuantity"
              type="submit"
              className="btn btn-primary align-right"
              onClick={() => {
                requestHandler()
                ConfirmHandler()
              }}
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
