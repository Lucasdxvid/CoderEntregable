import { Router } from "express";
import CartManager from "../managers/CartManagers.js";
import ProductManager from "../managers/ProductManagers.js";
import { __dirname } from "../utils.js";
import path from "node:path";

const router = Router();

// Rutas de archivos para carritos y productos.
const productsFilePath = path.join(__dirname, "./files/carts.json");
const cartManager = new CartManager(productsFilePath);

const productsFilePath2 = path.join(__dirname, "./files/products.json");
const productManager = new ProductManager(productsFilePath2);

// Obtener todos los carritos.
router.get("/", async (req, res) => {
  const carts = await cartManager.getCart();
  res.send(carts);
});

// Agregar un carrito nuevo.
router.post('/', async (req, res) => {
    await cartManager.addCart();
    res.send({ status: 'success'});
});

// Obtener un carrito por su ID.
router.get("/:cid", async (req, res) => {
  try {
    const id = Number(req.params.cid);
    const cart = await cartManager.getCartById(id);
    res.send({ status: "success", payload: cart.products });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Agregar un producto a un carrito.
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const idCart = Number(req.params.cid);
    const idProduct = Number(req.params.pid);

    // Verificar si el producto existe antes de actualizar el carrito.
    await productManager.getProductById(idProduct);

    await cartManager.updateCart(idCart, idProduct);
    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export default router;
