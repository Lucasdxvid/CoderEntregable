import { fileURLToPath } from "url";
import { dirname } from "path";

// Convierte la URL actual del módulo en una ruta de archivo y obtiene el nombre de archivo actual.
const __filename = fileURLToPath(import.meta.url);

// Obtiene el directorio de la ruta del archivo actual (__filename).
const __dirname = dirname(__filename);

// Exporta el directorio (__dirname) para que esté disponible en otros módulos.
export { __dirname };
