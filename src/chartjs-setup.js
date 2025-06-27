// src/chartjs-setup.js
import { Chart, BarElement, CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
);
