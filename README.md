# León XIV vuelve al Perú

> Especial editorial de RPP sobre la visita del papa León XIV al Perú.

Este proyecto es una experiencia web estática, responsive y accesible para presentar la agenda, las noticias, las fotogalerías, el reportaje audiovisual y la cobertura especial de RPP.

## Demo local

No requiere Node.js ni un proceso de compilación. Desde la raíz del proyecto, ejecuta:

```bash
python3 -m http.server 8080
```

Después abre [http://localhost:8080](http://localhost:8080) en el navegador.

También puedes abrir `index.html` directamente, aunque un servidor local ofrece una experiencia más fiel para recursos multimedia y rutas externas.

## Contenido

- Hero editorial con fechas y ciudades del recorrido.
- Portada de noticias y enlaces a la cobertura de RPP.
- Fotogalerías y módulo para dejar mensajes.
- Reportaje especial con modal de YouTube y momentos destacados.
- Crónicas, más noticias, videos y resumen de agenda.
- Navegación responsive con menú móvil.
- Animaciones de entrada con `IntersectionObserver`.
- Soporte para `prefers-reduced-motion` y navegación por teclado.

## Estructura

```text
.
├── index.html       # Estructura y contenido de la página
├── styles.css       # Sistema visual, layout y responsive design
├── app.js           # Menú móvil, modal de video y animaciones
├── assets/          # Imágenes, logotipos e iconografía del especial
└── README.md
```

## Tecnologías

- HTML5 semántico
- CSS moderno sin framework
- JavaScript vanilla
- Google Fonts: Inter, Manrope y Newsreader
- YouTube IFrame API para el reportaje audiovisual

## Consideraciones de contenido

La página funciona como una pieza editorial enlazada a RPP. Las noticias, fotografías, logotipos y videos pertenecen a sus respectivos titulares; este repositorio contiene la implementación de la interfaz y los recursos incluidos en el proyecto. Los enlaces externos pueden cambiar según la publicación original.

## Personalización

- Edita el contenido y los enlaces en `index.html`.
- Ajusta colores, tipografías y breakpoints en `styles.css`.
- Cambia el video y sus capítulos en `app.js` y en el bloque del modal dentro de `index.html`.
- Reemplaza los recursos visuales manteniendo las rutas relativas dentro de `assets/`.

## Accesibilidad

La interfaz incluye enlace para saltar al contenido, landmarks semánticos, estados `aria-expanded` y `aria-current`, foco visible, texto alternativo en imágenes relevantes, cierre del modal con `Escape` y una alternativa de movimiento reducido.

## Estado del proyecto

Proyecto estático listo para publicación en GitHub Pages, Netlify o cualquier hosting que sirva archivos estáticos. No necesita variables de entorno ni backend.

