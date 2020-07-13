"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { stock, customers } = require("./data/promo");

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .post("/order", (req, res) => {
    let newCustomer = true;
    console.log(req.body);
    for (let i = 0; i < customers.length; i++) {
      if (customers[i].givenName === req.body.givenName) {
        res.json({
          status: "error",
          error: "repeat-customer",
        });
        return;
      } else if (customers[i].email === req.body.email) {
        res.json({
          status: "error",
          error: "repeat-customer",
        });
        return;
      } else if (customers[i].address === req.body.address) {
        res.json({
          status: "error",
          error: "repeat-customer",
        });
        return;
      }
    }
    if (req.body.country !== "Canada") {
      res.json({
        status: "error",
        error: "undeliverable",
      });
      return;
    }

    let quantity = "0";
    if (req.body.order == "shirt") {
      quantity = stock[req.body.order][req.body.size];
    } else {
      quantity = stock[req.body.order];
    }

    if (quantity === "0") {
      res.json({
        status: "error",
        error: "unavailable",
      });
      return;
    }

    res.json({
      status: "success",
    });
  })
  .get("/order-confirmed", (req, res) => res.send("Order Placed! (:"))
  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(8000, () => console.log(`Listening on port 8000`));
