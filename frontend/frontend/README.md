# ✂️ Brayan Barber

## Requisitos
1. Visual Studio 2022
2. .NET Framework 8.x
3. NPM 11.9.0
4. NodeJS v24.14.0

## Paso a Paso para Descargar NodeJS y Componentes del Frontend VS 2022

[React Project in Visual Studio 2022](https://www.youtube.com/watch?v=qBSFHEra5P0)

## Tecnologías
- React 18
- Vite
- React Router DOM v6
- Axios
- TailwindCSS v3
- Lucide React
- .NET Framework (C#)


## Instalación Librerías Frontend

```
Paso 1. Abrir PowerShell como Admin
Paso 2. Ubicarte en la carpeta del frontend
Paso 3. Lanzar el comando: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

Paso 4. Instalación de librerías:
npm install react-router-dom axios lucide-react
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

## Estructura Frontend
```
src
 ├── assets
 ├── components
 │    ├── Navbar
 │    ├── Footer
 │    ├── AppointmentCard
 │    ├── FormInput
 │    └── ProtectedRoute
 ├── pages
 │    ├── public
 │    │    ├── Home
 │    │    ├── BookAppointment
 │    │    ├── MyAppointment
 │    ├── auth
 │    │    └── Login
 │    ├── barber
 │    │    ├── BarberDashboard
 │    │    ├── BarberAppointments
 │    │    └── BarberProfile
 │    ├── admin
 │    │    ├── AdminDashboard
 │    │    ├── AdminAppointments
 │    │    ├── Employees
 │    │    └── Clients
 │
 ├── services
 │    └── api.js
 ├── context
 │    └── AuthContext.jsx
 ├── routes
 │    └── AppRoutes.jsx
 └── App.jsx
 ```