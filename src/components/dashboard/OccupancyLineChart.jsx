// src/components/dashboard/OccupancyLineChart.jsx
import React, { useRef, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import Card from '../common/Card'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from 'chart.js'

// Registro dos elementos do Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip)

export default function OccupancyLineChart({ ocupacaoPorHora }) {
  // 1) Hooks (sempre executados)
  const chartRef = useRef(null)

  // 2) Debug: log dos dados recebidos
  console.log('OccupancyLineChart - ocupacaoPorHora recebido:', ocupacaoPorHora)

  // 3) Verificação se ocupacaoPorHora existe e é um objeto
  if (!ocupacaoPorHora || typeof ocupacaoPorHora !== 'object') {
    console.log('OccupancyLineChart - ocupacaoPorHora inválido ou não existe')
    return (
      <Card className="mb-4 text-center py-5">
        <div className="text-muted">Carregando dados de ocupação...</div>
      </Card>
    )
  }

  // 4) Prepara labels e valores de 05h a 23h (range mais amplo)
  const hours = Array.from({ length: 19 }, (_, i) => i + 5) // 5h até 23h
  const labels = hours.map(h => `${h}h`)
  const dataPoints = hours.map(h => ocupacaoPorHora[h] || 0)

  // 5) Debug: log dos dados processados
  console.log('OccupancyLineChart - dataPoints:', dataPoints)

  // 6) Verifica se há dados (pelo menos um valor > 0)
  const hasData = dataPoints.some(value => value > 0)
  console.log('OccupancyLineChart - hasData:', hasData)

  // 7) Efeito de desenhar os valores nos pontos — só acontece se houver dados
  useEffect(() => {
    if (!hasData) return // evita executar quando não há check-ins
    const chart = chartRef.current
    if (!chart) return

    const { ctx } = chart
    ctx.save()
    const meta = chart._metasets?.[0]
    if (meta) {
      dataPoints.forEach((val, i) => {
        if (val <= 0) return
        const { x, y } = meta.data[i].getProps(['x', 'y'], true)
        ctx.font = 'bold 13px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(`${val}p`, x, y - 15)
      })
    }
    ctx.restore()
  }, [dataPoints, hasData])

  // 8) Se não há check-ins, exibe mensagem amigável
  if (!hasData) {
    return (
      <Card className="mb-4 text-center py-5">
        <div className="text-muted">Nenhum check-in registrado hoje</div>
      </Card>
    )
  }

  // 9) Configura o gráfico normalmente
  const data = {
    labels,
    datasets: [
      {
        data: dataPoints,
        tension: 0.45,
        borderWidth: 2.5,
        pointRadius: dataPoints.map(v => (v > 0 ? 6 : 0)),
        pointHoverRadius: dataPoints.map(v => (v > 0 ? 8 : 0)),
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { weight: 'bold' } },
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { font: { weight: 'bold' }, stepSize: 2 },
        suggestedMax: Math.max(...dataPoints) + 2,
      },
    },
    elements: { line: { borderJoinStyle: 'round', fill: false } },
    animation: false,
    layout: { padding: { top: 30 } },
  }

  // 10) Renderização final
  return (
    <Card className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Ocupação da Academia</h5>
        <small className="text-muted">Por Horário</small>
      </div>
      <Line ref={chartRef} data={data} options={options} height={220} />
    </Card>
  )
}