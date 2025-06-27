// src/components/dashboard/ChartOverview.jsx
import React from 'react'
import { Bar } from 'react-chartjs-2'
import Card from '../common/Card'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'

// Registra os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function ChartOverview({
  labels = [],
  novos = [],
  renovados = [],
}) {
  // Garante arrays de mesmo tamanho (preenche com zero se faltar)
  const length = Math.max(labels.length, novos.length, renovados.length)
  const safeLabels    = labels.length    ? labels    : Array.from({ length }, (_, i) => `Mês ${i+1}`)
  const safeNovos     = [...novos,     ...Array(length - novos.length).fill(0)]
  const safeRenovados = [...renovados, ...Array(length - renovados.length).fill(0)]

  // Se não houver nenhum dado, mostra mensagem amigável
  const total = safeNovos.concat(safeRenovados).reduce((sum, v) => sum + v, 0)
  if (total === 0) {
    return (
      <Card className="mb-4 text-center py-5">
        <div className="text-muted">Nenhuma assinatura nos últimos 6 meses</div>
      </Card>
    )
  }

  // Monta o dataset com cores do tema Bootstrap (primary / secondary)
  const data = {
    labels: safeLabels,
    datasets: [
      {
        label: 'Novos',
        data: safeNovos,
        backgroundColor: '#0b55d6',  // <— seu $primary
        borderColor:     '#0b55d6',
        borderWidth: 1,
      },
      {
        label: 'Renovados',
        data: safeRenovados,
        backgroundColor: '#c5d477',  // <— seu $secondary
        borderColor:     '#c5d477',
        borderWidth: 1,
      },
    ],
  }

  // Ajusta opções do gráfico para maior clareza
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { weight: 'bold' } },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { weight: 'bold' } },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#eee' },
        ticks: { font: { weight: 'bold' }, stepSize: 1 },
      },
    },
    layout: { padding: 16 },
  }

  return (
    <Card className="mb-4">
      <h5 className="mb-4">Visão Geral de Assinaturas (6 meses)</h5>
      <Bar data={data} options={options} />
    </Card>
  )
}
