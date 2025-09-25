import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/SimpleContext'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes/Clientes'
import ClienteForm from './pages/Clientes/ClienteForm'
import ClienteDetail from './pages/Clientes/ClienteDetail'
import Orcamentos from './pages/Orcamentos/Orcamentos'
import OrcamentoForm from './pages/Orcamentos/OrcamentoForm'
import OrcamentoDetail from './pages/Orcamentos/OrcamentoDetail'
import Relatorios from './pages/Relatorios'

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/novo" element={<ClienteForm />} />
            <Route path="/clientes/:id" element={<ClienteDetail />} />
            <Route path="/clientes/:id/editar" element={<ClienteForm />} />
            <Route path="/orcamentos" element={<Orcamentos />} />
            <Route path="/orcamentos/novo" element={<OrcamentoForm />} />
            <Route path="/orcamentos/:id" element={<OrcamentoDetail />} />
            <Route path="/orcamentos/:id/editar" element={<OrcamentoForm />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  )
}

export default App