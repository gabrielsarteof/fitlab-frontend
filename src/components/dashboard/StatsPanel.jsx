// src/components/dashboard/StatsPanel.jsx
import Card from '../common/Card'

export default function StatsPanel({
  receitaSemana = 0,
  novasAssinaturasSemana = 0
}) {
  // Formata em moeda brasileira com fallback para 0
  const formatCurrency = (value) => {
    const safeValue = value ?? 0
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(safeValue)
  }

  return (
    <div className="d-flex gap-3">
      <Card className="flex-fill p-4 text-center">
        <h2 className="mb-1">{formatCurrency(receitaSemana)}</h2>
        <small>Receita Semana (7 dias)</small>
      </Card>
      <Card className="flex-fill p-4 text-center">
        <h2 className="mb-1">{novasAssinaturasSemana}</h2>
        <small>Novas Assinaturas (7 dias)</small>
      </Card>
    </div>
  )
}
