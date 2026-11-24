# CYN IMPORT – catálogo estático para GitHub Pages

Sitio sin servidor: muestra productos y cada botón abre tu WhatsApp con el mensaje armado.

- `index.html` → tienda (la ven los clientes)
- `admin.html` → panel para cargar/editar/borrar productos
- `products.json` → los productos (es la "base de datos")
- `config.js` → nombre, WhatsApp, email, textos, beneficios y preguntas frecuentes (**cambialo**)
- `css/styles.css` → diseño de la tienda · `css/admin.css` → diseño del panel

## 1. Configurar
Abrí `config.js` y poné tu número: código de país + área + número, sin `+` ni espacios (ej. `5491122334455`).

## 2. Subir a GitHub Pages
1. Creá un repositorio en GitHub y subí todos estos archivos a la raíz.
2. Settings → Pages → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
3. En ~1 minuto queda en `https://TU-USUARIO.github.io/NOMBRE-REPO/`.
   El panel está en `.../admin.html`.

## 3. Cargar productos
Entrá a `admin.html`, agregá o editá productos y tocá **Publicar en GitHub**.
Alternativa sin token: **Descargar products.json** y reemplazarlo en el repo (Add file → Upload files).

### Token (para "Publicar")
GitHub → Settings → Developer settings → Personal access tokens → *Fine-grained tokens* → Generate:
- Repository access: solo este repositorio
- Permissions → **Contents: Read and write**

Guardalo en un lugar seguro. Nunca lo subas al repo ni lo compartas.

## Seguridad: qué esperar
`admin.html` es una página pública, pero **no puede cambiar nada sin tu token**: la tienda solo se modifica
si publicás con él. Cualquiera que entre al panel verá solo borradores en su propio navegador.
Si querés que ni siquiera se vea la URL, renombrá `admin.html` a algo difícil de adivinar (ej. `panel-x7k2.html`).
