import { Router } from "express";
import ProductManager from "../managers/ProductManagers.js";
import { __dirname } from "../utils.js";
import path from "node:path";

const router = Router();

// Ruta del archivo de productos.
const productsFilePath = path.join(__dirname, "./files/products.json");
const productManager = new ProductManager(productsFilePath);

// Obtener todos los productos o un número limitado de productos.
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const cant = req.query.limit;

    if (!cant) return res.send(products);

    if (isNaN(cant))
      return res.status(400).send({ error: "Ingrese un número válido" });

    const filteredProducts = products.slice(0, cant);
    res.send(filteredProducts);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Obtener un producto por su ID.
router.get("/:pid", async (req, res) => {
  try {
    const id = Number(req.params.pid);
    const product = await productManager.getProductById(id);
    res.send(product);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Agregar un nuevo producto.
router.post("/", async (req, res) => {
  try {
    const product = req.body;
    await productManager.addProduct(product);
    res.status(201).send({ status: "success", payload: product });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Actualizar un producto por su ID.
router.put("/:pid", async (req, res) => {
  try {
    const product = req.body;
    const id = Number(req.params.pid);
    await productManager.updateProduct(id, product);

    res.send({
      status: "success",
      payload: await productManager.getProductById(id),
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Eliminar un producto por su ID.
router.delete("/:pid", async (req, res) => {
  try {
    const id = Number(req.params.pid);
    await productManager.deleteProduct(id);

    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export default router;
