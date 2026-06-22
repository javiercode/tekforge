# TekForge - Plataforma Todo en Uno para Enlaces y QR 🚀

**TekForge** es una potente e intuitiva plataforma web diseñada para optimizar tu presencia digital y la forma en que compartes información. Permite acortar enlaces, crear alias personalizados de marca, generar códigos QR profesionales y diseñar elegantes páginas móviles multipropósito ("Link-in-Bio") en cuestión de segundos. 

---

## ✨ Funcionalidades Principales

### 1. 🔗 Acortador de Enlaces (Requiere Sesión)
* **Enlaces Cortos Seguros:** Transforma URLs largas y complejas en enlaces cortos limpios e idóneos para redes sociales.
* **Historial e Indicadores:** Accede a un panel con todos tus enlaces creados y el número de visitas recibidas en tiempo real.
* **Códigos QR Integrados:** Cada enlace acortado genera de forma automática un código QR de alta calidad listo para descargar.

### 2. 📛 Enlaces Personalizados con Alias (Requiere Sesión)
* **Control Total del Alias:** Elige palabras clave específicas en lugar de códigos aleatorios (ej. `tu-dominio/mi-portafolio` o `tu-dominio/promocion2026`).
* **Verificación de Disponibilidad:** Sistema dinámico que verifica que el alias personalizado no esté ya registrado antes de guardarlo.
* **Refuerzo de Marca:** Perfecto para campañas de marketing digital, incrementando el CTR (porcentaje de clics) de tus enlaces.

### 3. 🎨 Generador Avanzado de Códigos QR (Acceso Libre)
* **Personalización Estética:** Cambia el color del código QR (Negro tradicional, Navy Blue o Naranja corporativo).
* **Tamaño Flexible:** Selecciona las dimensiones del archivo descargado en píxeles (128px, 256px, 512px) de acuerdo con tus necesidades.
* **Logotipos Centrales:** Incrusta logotipos vectoriales de marca en el centro del código QR (por ejemplo, logos de Enlaces, Google o React) de manera limpia y sin corromper la lectura del QR.
* **Descarga PNG Segura:** Descarga directa de archivos sin bloqueos de seguridad del navegador (CORS de origen cruzado adaptado).

### 4. 📇 Páginas Móviles "Link-in-Bio" (Requiere Sesión)
* **Constructor Visual:** Diseña tu propia tarjeta de presentación digital o portafolio móvil editable en tiempo real.
* **Estilos Únicos:** Elige entre múltiples temas visuales preconfigurados (Sunset, Forest, Ocean, etc.) con tipografías y paletas de colores profesionales.
* **Secciones e Integraciones:** Añade título, biografía, enlaces a redes sociales y un feed con todos tus accesos importantes.
* **Métricas de Rendimiento:** Lleva un registro del total de visitas únicas recibidas en tu página pública.

---

## 🛠️ Tecnologías y Arquitectura

* **Frontend:** [React (TypeScript)](https://reactjs.org/) & [MUI (Material-UI)](https://mui.com/) para una interfaz estética, rápida y 100% responsiva (adaptada a dispositivos móviles, tablets y ordenadores).
* **Base de Datos y Seguridad:** [Firebase Firestore](https://firebase.google.com/docs/firestore) y [Firebase Auth (Google Sign-In)](https://firebase.google.com/docs/auth).
* **Visualización de QR:** [qrcode.react](https://github.com/zpao/qrcode.react) para renderizado rápido sobre elementos HTML5 Canvas con soporte de CORS no intrusivo.
* **Despliegue Continuo (CI/CD):** [GitHub Actions](https://github.com/features/actions) integrado para pruebas automáticas y despliegue rápido en [GitHub Pages](https://pages.github.com/).

---

## 📦 Scripts Disponibles

En el directorio del proyecto, puedes ejecutar los siguientes comandos:

### `npm start`
Inicia el entorno de desarrollo local.\
Abre [http://localhost:3000](http://localhost:3000) para verlo en tu navegador.

### `npm test`
Ejecuta la suite de pruebas unitarias en modo no interactivo.\
*(Nota: Corre bajo entorno `CI=true` para garantizar un cierre automático rápido).*

### `npm run build`
Compila y optimiza la aplicación para producción en la carpeta `build`.\
Genera minificación de código y prepara el despliegue automático de GitHub Pages.

---

## 📱 Diseño y Adaptabilidad Móvil

La plataforma cuenta con un diseño fluido y adaptable para pantallas de teléfonos móviles gracias a:
* **Pestañas Desplazables:** Sistema de pestañas de navegación (`Tabs`) con soporte táctil y scroll horizontal en dispositivos pequeños.
* **Cuadrículas Elásticas (`Grid`):** Reducción automática de columnas en el historial de enlaces y tarjetas de visualización.
* **Componentes Auto-Escalables:** Los botones de descargas y campos de texto ajustan su tipografía y espaciado de manera proporcional al tamaño de la pantalla del usuario.
