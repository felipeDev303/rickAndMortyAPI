# Rick and Morty API con PHP

## Arquitectura y Conceptos de Backend

1. **Separación Frontend/Backend:**

   - **Frontend (`index.html`, `style.css`, `script.js`):** Se ejecuta en el navegador del usuario. Es responsable de la presentación visual (HTML/CSS) y la interacción del usuario (JS). Inicia la solicitud de datos.
   - **Backend (`getCharacter.php`):** Se ejecuta en el servidor. Es responsable de la lógica del lado del servidor, interactuar con otras APIs o bases de datos, y preparar la respuesta para el frontend.

2. **API Local (Backend como Intermediario):**

   - El archivo `getCharacter.php` actúa como un **endpoint de API simple** para nuestro frontend. El JavaScript no llama directamente a `rickandmortyapi.com`, sino a nuestro propio script PHP.
   - **¿Por qué?** En aplicaciones más complejas, esto permite:
     - **Ocultar Claves de API:** Si la API externa requiriera una clave secreta, el script PHP la usaría sin exponerla al navegador del usuario.
     - **Evitar Problemas de CORS:** El navegador impone restricciones de seguridad (CORS) que pueden impedir que JavaScript llame directamente a APIs en dominios diferentes. Una llamada del servidor (PHP) a la API externa no tiene estas restricciones.
     - **Procesamiento/Agregación de Datos:** El backend podría obtener datos de _múltiples_ fuentes, combinarlos o procesarlos antes de enviar una única respuesta simplificada al frontend.
     - **Caching:** El backend podría cachear respuestas de la API externa para mejorar el rendimiento y reducir el número de llamadas a la API.

3. **Flujo de la Solicitud:**

   - Usuario hace clic en el botón.
   - `script.js` genera un `characterID` aleatorio.
   - `script.js` usa `fetch` para enviar una petición GET a `getCharacter.php?id=X`.
   - El servidor web ejecuta `getCharacter.php`.
   - `getCharacter.php` recibe el `id` a través de `$_GET`.
   - `getCharacter.php` **valida** que el `id` sea numérico y positivo.
   - `getCharacter.php` construye la URL de la API externa (`https://rickandmortyapi.com/api/character/X`).
   - `getCharacter.php` usa `file_get_contents` (o idealmente cURL) para realizar una petición GET **desde el servidor** a la API externa.
   - La API externa responde a `getCharacter.php` con datos JSON.
   - `getCharacter.php` establece la cabecera `Content-Type: application/json`.
   - `getCharacter.php` hace `echo` de la respuesta JSON recibida.
   - `script.js` recibe la respuesta JSON de `getCharacter.php`.
   - `script.js` procesa el JSON y actualiza el `innerHTML` del `div#result` para mostrar los datos.

4. **Conceptos Específicos del Backend Ilustrados:**
   - **Endpoint:** `getCharacter.php` funciona como un punto de acceso definido para una funcionalidad específica.
   - **Método HTTP (GET):** Recibe datos a través de parámetros en la URL (`$_GET`).
   - **Validación de Entrada:** La comprobación `is_numeric($id) || $id < 1` es una forma básica pero crucial de validación para evitar errores o comportamientos inesperados.
   - **Consumo de API Externa:** El uso de `file_get_contents` para obtener datos de otra URL desde el servidor.
   - **Respuesta JSON:** Establecer la cabecera `Content-Type` y devolver datos en formato JSON, que es el estándar de facto para la comunicación entre APIs web y JavaScript.

## Posibles Mejoras Técnicas (Versiones Futuras)

Este proyecto es una base. Para una aplicación más robusta, se podrían implementar las siguientes mejoras:

- **Backend (PHP):**
  - **Usar cURL:** Reemplazar `file_get_contents` con la extensión cURL de PHP. Ofrece mucho más control sobre la petición HTTP (timeouts, cabeceras, manejo de errores, verificación de certificados SSL, etc.).
  - **Manejo de Errores Robusto:** Verificar explícitamente el código de estado HTTP devuelto por la API externa (ej. 404 si el personaje no existe) y devolver errores JSON significativos al frontend. Implementar bloques `try...catch` si se usan librerías que lanzan excepciones.
  - **Logging:** Registrar errores (fallos al llamar a la API externa, IDs inválidos) en un archivo de log en el servidor para facilitar la depuración.
  - **Caching del Lado del Servidor:** Almacenar temporalmente las respuestas de la API externa (ej. usando Memcached, Redis, o incluso archivos temporales) para reducir la carga en la API de Rick & Morty y acelerar las respuestas para IDs solicitados recientemente.
  - **Estructura/Framework:** Para aplicaciones más grandes, usar un micro-framework (como Slim) o un framework completo (como Laravel o Symfony) para gestionar el enrutamiento, las peticiones/respuestas y organizar mejor el código.
- **Frontend (JavaScript):**
  - **Manejo de Errores Mejorado:** Mostrar mensajes más específicos al usuario basados en el error recibido del backend (ej. "Personaje no encontrado" vs. "No se pudo contactar al servidor"). Usar la clase `.error` de CSS.
  - **Indicador de Carga:** Mostrar un spinner o mensaje "Cargando..." mientras se espera la respuesta del `fetch`.
  - **Prevenir Clics Múltiples:** Deshabilitar el botón mientras una petición está en curso.
  - **Sanitización de Salida:** Aunque la API de Rick & Morty es confiable, en general es más seguro usar `textContent` en lugar de `innerHTML` cuando sea posible, o escapar el HTML para prevenir ataques XSS si los datos provinieran de fuentes menos fiables.
  - **Accesibilidad:** Asegurar que la imagen tenga un atributo `alt` descriptivo.
- **General:**
  - **Variables de Entorno:** Para configuraciones como URLs de API o claves (si fueran necesarias), usar variables de entorno en lugar de codificarlas directamente.
  - **Pruebas:** Añadir pruebas unitarias (PHPUnit para el backend) y quizás pruebas de integración o E2E.
  - **Despliegue:** Considerar el uso de contenedores (Docker) para facilitar el despliegue y la consistencia del entorno.
