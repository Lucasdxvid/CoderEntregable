// Importamos el módulo 'fs' (file system) para realizar operaciones de lectura y escritura de archivos.

import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // Obtener todos los productos desde el archivo JSON.
  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const products = JSON.parse(data);
        return products;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Añadir un nuevo producto al archivo JSON.
  addProduct = async (product) => {
    try {
      const allProducts = await this.getProducts();

      // Verificar si el código del producto ya existe.
      if (allProducts.some((p) => p.code === product.code)) {
        throw new Error(
          "El código ya está en uso por otro producto (Intenta ingresar otro código)."
        );
      }

      // Verificar que todos los campos obligatorios estén presentes.
      if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.status ||
        !product.code ||
        !product.stock ||
        !product.category
      ) {
        throw new Error(
          "Todos los campos son obligatorios para añadir un nuevo producto."
        );
      }

      // Asignar un ID único al nuevo producto.
      product.id =
        allProducts.length === 0
          ? 1
          : allProducts[allProducts.length - 1].id + 1;

      // Agregar el producto a la lista y guardarla en el archivo JSON.
      allProducts.push(product);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(allProducts, null, "\t")
      );
      return product;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Obtener un producto por su ID.
  getProductById = async (id) => {
    try {
      const allProducts = await this.getProducts();
      const productById = allProducts.find((p) => p.id === id);

      // Verificar si el producto con la ID especificada existe.
      if (!productById) {
        throw new Error("No existe un producto con la ID ingresada.");
      }
      return productById;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Actualizar un producto por su ID.
  updateProduct = async (id, product) => {
    try {
      const allProducts = await this.getProducts();
      const productIndex = allProducts.findIndex((p) => p.id === id);

      // Verificar si la ID del producto a actualizar existe.
      if (productIndex != -1) {
        // Verificar si el código del producto a actualizar ya existe en otro producto.
        if (allProducts.some((p) => p.code === product.code)) {
          throw new Error(
            "No se puede actualizar un código de producto con uno existente."
          );
        } else {
          // Actualizar los campos del producto y guardar la lista actualizada en el archivo JSON.
          allProducts[productIndex] = {
            title: product.title || allProducts[productIndex].title,
            description:
              product.description || allProducts[productIndex].description,
            price: product.price || allProducts[productIndex].price,
            thumbnail: product.thumbnail || allProducts[productIndex].thumbnail,
            code: product.code || allProducts[productIndex].code,
            stock: product.stock || allProducts[productIndex].stock,
            status: product.status || allProducts[productIndex].status,
            category: product.category || allProducts[productIndex].category,
            id: id,
          };

          await fs.promises.writeFile(
            this.path,
            JSON.stringify(allProducts, null, "\t")
          );
        }
      } else {
        throw new Error(
          "El ID del producto que estás intentando actualizar no existe (Intenta colocar un ID existente)."
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Eliminar un producto por su ID.
  deleteProduct = async (id) => {
    try {
      const allProducts = await this.getProducts();
      const productIndex = allProducts.findIndex((p) => p.id === id);

      // Verificar si la ID del producto a eliminar existe.
      if (productIndex != -1) {
        // Eliminar el producto de la lista y guardar la lista actualizada en el archivo JSON.
        allProducts.splice(productIndex, 1);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(allProducts, null, "\t")
        );
      } else {
        throw new Error(
          "La ID del producto que quieres eliminar no existe o ya fue borrado (Intenta probar con un producto existente)."
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default ProductManager;
