import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { __dirname } from "./utils.js";

const app = express();

// Habilitar el manejo de solicitudes JSON y datos codificados en URL.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar la ruta para servir archivos estáticos desde la carpeta 'public'.
app.use("/static-files", express.static(`${__dirname}/public`));

// Configurar las rutas para la API de productos y carritos.
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Iniciar el servidor y escuchar en el puerto 8080.
app.listen(8080, () => console.log("Listening on port 8080"));
