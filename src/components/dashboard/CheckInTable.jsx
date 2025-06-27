// src/components/dashboard/CheckInTable.jsx
import Card from '../common/Card'

export default function CheckinTable({ rows }) {
  return (
    <Card>
      <h5 className="mb-4">Check-ins Recentes</h5>
      <div className="table-responsive">
        <table className="table table-borderless align-middle">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Data</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const date = new Date(r.hora);
              return (
                <tr key={i}>
                  <td>{r.cliente}</td>
                  <td>{date.toLocaleDateString('pt-BR')}</td>
                  <td>{date.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
