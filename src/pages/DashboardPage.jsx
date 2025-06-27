import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

import Topbar from '@components/dashboard/Topbar'
import HeaderBanner from '@components/dashboard/HeaderBanner'
import ActionCards from '@components/dashboard/ActionCards'
import StatsPanel from '@components/dashboard/StatsPanel'
import CheckinTable from '@components/dashboard/CheckinTable'
import OccupancyLineChart from '@components/dashboard/OccupancyLineChart'
import ChartOverview from '@components/dashboard/ChartOverview'
import KPISection from '@components/dashboard/KPISection'

import { useAuth } from '@hooks/useAuth'
import { useDashboard } from '@hooks/useDashboard'

// **Certifique-se de importar o CSS do Bootstrap no seu projeto (normalmente em index.js):**
// import 'bootstrap/dist/css/bootstrap.min.css'

export default function DashboardPage() {
  const { onCheckinClick, onRenewSignatureClick, onUpdateStateClick } = useOutletContext()
  const { admin, loading: loadingAdmin, error: errorAuth, logout } = useAuth()
  const { overview, loading: loadingOv, error: errorOv } = useDashboard()
  const [screenSize, setScreenSize] = useState('desktop')

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      if (w <= 768) setScreenSize('mobile')
      else if (w <= 1024) setScreenSize('tablet')
      else setScreenSize('desktop')
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (loadingAdmin || loadingOv) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status" />
      </div>
    )
  }

  if (errorAuth || errorOv) {
    const msg = errorAuth?.message || errorOv?.message || 'Erro desconhecido'
    return (
      <div className="alert alert-danger text-center my-4">
        Erro ao carregar dashboard: {msg}
      </div>
    )
  }

  // **Mobile**
  if (screenSize === 'mobile') {
    return (
      <div className="dashboard-mobile">
        <div className="container-fluid px-2">
          {/* Header */}
          <div className="row g-2 mb-3">
            <div className="col-12"><Topbar /></div>
            <div className="col-12"><HeaderBanner nome={admin.nome} /></div>
          </div>

          {/* Ações rápidas */}
          <div className="row g-2 mb-3">
            <div className="col-12">
              <ActionCards
                onCheckinClick={onCheckinClick}
                onRenewSignatureClick={onRenewSignatureClick}
                onUpdateStateClick={onUpdateStateClick}
                layout="mobile"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="row g-2 mb-3">
            <div className="col-12">
              <StatsPanel
                receitaSemana={overview.stats.receitaSemana}
                novasAssinaturasSemana={overview.stats.novasAssinaturasSemana}
                layout="mobile"
              />
            </div>
          </div>

          {/* KPI */}
          <div className="row g-2 mb-3">
            <div className="col-12">
              <KPISection stats={overview.stats} />
            </div>
          </div>

          {/* Charts & Tables */}
          <div className="row g-2">
            <div className="col-12 mb-3">
              <CheckinTable rows={overview.recentCheckins} layout="mobile" />
            </div>
            <div className="col-12 mb-3">
              <OccupancyLineChart ocupacaoPorHora={overview.ocupacaoPorHora} layout="mobile" />
            </div>
            <div className="col-12 mb-3">
              <ChartOverview
                labels={overview.chart.labels}
                novos={overview.chart.novos}
                renovados={overview.chart.renovados}
                layout="mobile"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // **Tablet**
  if (screenSize === 'tablet') {
    return (
      <div className="dashboard-tablet">
        <div className="container-fluid px-3">
          {/* Header */}
          <div className="row g-3 mb-4">
            <div className="col-12"><Topbar /></div>
            <div className="col-12"><HeaderBanner nome={admin.nome} /></div>
          </div>

          {/* Ações rápidas */}
          <div className="row g-3 mb-4">
            <div className="col-12">
              <ActionCards
                onCheckinClick={onCheckinClick}
                onRenewSignatureClick={onRenewSignatureClick}
                onUpdateStateClick={onUpdateStateClick}
                layout="tablet"
              />
            </div>
          </div>

          {/* Stats panel em largura total */}
          <div className="row g-3 mb-4">
            <div className="col-12">
              <StatsPanel
                receitaSemana={overview.stats.receitaSemana}
                novasAssinaturasSemana={overview.stats.novasAssinaturasSemana}
                layout="tablet"
              />
            </div>
          </div>

          {/* KPISection em largura total — grid interno cuida do 2-por-linha */}
          <div className="row g-3 mb-4">
            <div className="col-12">
              <KPISection stats={overview.stats} />
            </div>
          </div>

          {/* Charts & Tables */}
          <div className="row g-3">
            <div className="col-12 mb-3">
              <CheckinTable rows={overview.recentCheckins} layout="tablet" />
            </div>
            <div className="col-12 col-lg-6 mb-3">
              <OccupancyLineChart ocupacaoPorHora={overview.ocupacaoPorHora} layout="tablet" />
            </div>
            <div className="col-12 col-lg-6 mb-3">
              <ChartOverview
                labels={overview.chart.labels}
                novos={overview.chart.novos}
                renovados={overview.chart.renovados}
                layout="tablet"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // **Desktop**
  return (
    <div className="d-flex min-vh-100 bg-white dashboard-desktop">
      <main className="flex-grow-1 d-flex flex-column" style={{ minHeight: '100vh' }}>
        <div className="row flex-grow-1" style={{ minHeight: 0 }}>
          {/* Coluna esquerda */}
          <div className="col-12 col-lg-6 d-flex flex-column gap-3 px-4">
            <Topbar />
            <HeaderBanner nome={admin.nome} />
            <ActionCards
              onCheckinClick={onCheckinClick}
              onRenewSignatureClick={onRenewSignatureClick}
              onUpdateStateClick={onUpdateStateClick}
              layout="desktop"
            />
            <KPISection stats={overview.stats} />
          </div>

          {/* Coluna direita */}
          <div
            className="col-12 col-lg-6 d-flex flex-column gap-3 px-4"
            style={{ maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto', minHeight: 0 }}
          >
            <StatsPanel
              receitaSemana={overview.stats.receitaSemana}
              novasAssinaturasSemana={overview.stats.novasAssinaturasSemana}
              layout="desktop"
            />
            <CheckinTable rows={overview.recentCheckins} layout="desktop" />
            <OccupancyLineChart ocupacaoPorHora={overview.ocupacaoPorHora} layout="desktop" />
            <ChartOverview
              labels={overview.chart.labels}
              novos={overview.chart.novos}
              renovados={overview.chart.renovados}
              layout="desktop"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
