import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import App from './App.jsx'
import './index.css'
import Layout from './routes/Layout';
import DetailView from './routes/DetailView';

createRoot(document.getElementById('root')).render(
  // Layout will have functionalities such as back buttons that should show on all related pages
  // App is a child route that has the same path
  // DetailView is a page that shows additional information based on the symbol variable
  // * takes care of unidentifiable routes, Not found page essentially
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index={true} element={<App />} />
          <Route index={false} path = "/recipeDetails/:id" element={<DetailView />} />
        </Route>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
              <Link style={{ color: "white" }} to="/">
                Back to Home
              </Link>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
