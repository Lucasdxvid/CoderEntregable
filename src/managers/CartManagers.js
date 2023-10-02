// Importamos el módulo 'fs' (file system) para realizar operaciones de lectura y escritura de archivos.
import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  // Obtener lista de carritos.
  getCart = async () => {
    try {
      // Verifica si el archivo especificado en 'this.path' existe.
      if (fs.existsSync(this.path)) {
        // Lee el contenido del archivo y lo convierte en una cadena de texto.
        const data = await fs.promises.readFile(this.path, "utf-8");
        // Convierte la cadena JSON en un objeto JavaScript.
        const cart = JSON.parse(data);
        return cart;
      } else {
        // Si el archivo no existe, devuelve un array vacío.
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Agregar un carrito nuevo.
  addCart = async () => {
    try {
      const allCarts = await this.getCart();
      let cart = {};
      // Estructura de un carrito
      cart.id =
        allCarts.length === 0 ? 1 : allCarts[allCarts.length - 1].id + 1;
      cart.products = [];

      // Agrego el carrito al array de carritos
      allCarts.push(cart);
      // Escribe la lista actualizada de carritos en el archivo JSON.
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(allCarts, null, "\t")
      );
      return cart;
    } catch (error) {
      console.log(error);
    }
  };

  // Encontrar carrito por ID.
  getCartById = async (id) => {
    try {
      const allCarts = await this.getCart();
      const cartById = allCarts.find((p) => p.id === id);

      if (!cartById) {
        throw new Error(`No existe un carrito con la ID = ${id}`);
      }
      return cartById;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Actualizar carrito.
  updateCart = async (idCart, idProduct) => {
    try {
      const allCarts = await this.getCart();
      const cartIndex = allCarts.findIndex((p) => p.id === idCart);

      if (cartIndex !== -1) {
        const productIndex = allCarts[cartIndex].products.findIndex(
          (product) => product.id === idProduct
        );

        if (productIndex !== -1) {
          allCarts[cartIndex].products[productIndex].quantity++;
        } else {
          allCarts[cartIndex].products.push({ id: idProduct, quantity: 1 });
        }

        // Escribe la lista actualizada de carritos en el archivo JSON.
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(allCarts, null, "\t")
        );
      } else {
        throw new Error("El carrito que estas buscando no existe");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
export default CartManager;
