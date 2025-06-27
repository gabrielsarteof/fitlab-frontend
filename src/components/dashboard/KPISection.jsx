import React from 'react'
import Card from '../common/Card'

export default function KPISection({ stats, layout = 'desktop' }) {
  const items = [
    { label: 'Total de Clientes',    value: stats.totalClientes },
    { label: 'Assinaturas Ativas',   value: stats.assinaturasAtivas },
    { label: 'Vencendo em 10 dias',  value: stats.assinaturasVencendoEm10Dias },
    { label: 'Check-ins Hoje',       value: stats.checkinsHoje }
  ]

  // Determina as classes baseado no layout
  let colClasses = 'col-12 col-sm-6 col-lg-3' // padrão
  
  if (layout === 'mobile') {
    colClasses = 'col-12' // 1 por linha
  } else if (layout === 'tablet') {
    colClasses = 'col-6' // forçar 2 por linha
  } else if (layout === 'desktop') {
    colClasses = 'col-12 col-sm-6 col-lg-3' // responsivo
  }

  return (
    <div className="row g-3">
      {items.map((item, idx) => (
        <div key={idx} className={colClasses}>
          <Card className="h-100 shadow-sm border-0">
            <div className="text-center">
              <div className="fs-2 fw-bold mb-1">
                {item.value}
              </div>
              <div className="fw-semibold text-muted small">
                {item.label}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}