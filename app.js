const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const productos = require("./productos.json");
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("hola");
});

app.get("/productos", function (req, res) {
  console.log(req.query.page);

  let page = productos.slice(0, 10);
  if (req.query.page) {
    if (req.query.page > 0) {
      const start = req.query.page * 10;
      const end = start + 9;
      page = productos.slice(start, end);
    }
  }
  res.status(200).json(page);
});
app.get("/productos/:id", function (req, res) {
  const productoId = Number(req.params.id);
  let result = productos.find(function (producto) {
    return producto.id === productoId;
  });
  if (result) {
    res.status(200).json({
      result,
      msj: "Devolviendo producto por id",
    });
  } else {
    res.status(400).json({
      result,
      msj: "No se ha podido encontrar el producto",
    });
  }
});
app.post("/productos", function (req, res) {
  if (req.body) {
    const newProducto = {
      id: Date.now(),
      stock: Math.floor(Math.random(1) * 10),
      isVisible: false,
      ...req.body,
    };

    const file = fs.readFileSync("./productos.json", { encoding: "utf8" });
    let array = JSON.parse(file);

    array.push(newProducto);

    const newFile = JSON.stringify(array);

    const uploadingFile = fs.writeFileSync("./productos.json", newFile);

    res.status(200).json({
      newProducto,
      msj: "Producto creado correctamente.",
    });
  } else {
    res.status(400).json({
      msj: "No sea ha podido crear el producto correctamente.",
    });
  }
});
app.patch("/productos/:id", function (req, res) {
  const file = fs.readFileSync("./productos.json", { encoding: "utf8" });
  let array = JSON.parse(file);

  const productoId = Number(req.params.id);
  let result = array.find(function (producto) {
    return producto.id === productoId;
  });

  const productoActualizado = { ...result, ...req.body };

  let newArray = array.filter(function (producto) {
    return producto.id != productoId;
  });
  newArray.push(productoActualizado);
  const newFile = JSON.stringify(newArray);
  const uploadingFile = fs.writeFileSync("./productos.json", newFile);
  res
    .status(200)
    .json({ productoActualizado, msj: "Producto actualizado correctamente." });
});
app.delete("/productos/:id", function (req, res) {
  const file = fs.readFileSync("./productos.json", { encoding: "utf8" });
  let array = JSON.parse(file);

  const productoId = Number(req.params.id);
  let result = array.find(function (producto) {
    return producto.id === productoId;
  });
  if (result) {
    let newArray = array.filter(function (producto) {
      return producto.id != productoId;
    });
    if (newArray) {
      const newFile = JSON.stringify(newArray);
      const uploadingFile = fs.writeFileSync("./productos.json", newFile);
      res.status(200).json({ msj: "Producto eliminado correctamente." });
    }
  }
});

app.listen(3000);
