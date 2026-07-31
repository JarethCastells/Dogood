# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deploy En Vercel

### 1) Variables de entorno

Este frontend usa `VITE_API_URL` para llamar al backend.

Ejemplo local (`.env`):

```env
VITE_API_URL=http://localhost/dogood-v4/api
```

En Vercel, configura:

- `VITE_API_URL=https://tu-backend.com/api`

### 2) Importar el repo en Vercel

Config recomendada:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

### 3) Nota importante

Vercel solo desplega este frontend.  
Tu API PHP (XAMPP) debe estar en otro hosting (VPS/cPanel/servicio PHP) y con CORS habilitado para tu dominio de Vercel.
