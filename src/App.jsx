import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LoginPage from '@pages/auth/LoginPage';
import Layout from '@layout/Layout';
import ProtectedRoute from '@components/ProtectedRoute';
import DashboardPage from '@pages/DashboardPage';
import ClientesPage from '@pages/ClientesPage';
import PersonalPage from '@pages/PersonalPage'
import NutricionistasPage from '@pages/NutricionistasPage';
import DietasPage from '@pages/DietasPage';
import TreinosPage from '@pages/TreinosPage';
import PlanosPage from '@pages/PlanosPage';
import EstadosPage from '@pages/EstadosPage';
import AdministradoresPage from '@pages/AdministradoresPage';
import AssinaturasPage from '@pages/AssinaturasPage';
import CheckinsPage from '@pages/CheckinsPage';
import PageNotFound from '@pages/PageNotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          //Gabriel Sarte
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="administradores" element={<AdministradoresPage />}/>
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="assinaturas" element={<AssinaturasPage />} />
          //Matheus Cardoso
          <Route path="dietas" element={<DietasPage />} />
          <Route path="treinos" element={<TreinosPage />} />
          <Route path="avaliacoes-fisicas" element={<EstadosPage />} />
          //Extra 
          <Route path="planos" element={<PlanosPage />} />
          <Route path="personal-trainers" element={<PersonalPage />} />
          <Route path="nutricionistas" element={<NutricionistasPage />} />
          <Route path="check-ins" element={<CheckinsPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>

      <Toaster position="top-right" />
    </BrowserRouter>
  );
}