export default function ActionCards({ onCheckinClick, onRenewSignatureClick, onUpdateStateClick }) {
    return (
        <div>
            <h5 className="mb-4">Ações rápidas</h5>
            <div className="d-flex gap-3 mb-4">
                <button type="button" className="col btn action-btn btn-lg btn-smooth" onClick={onCheckinClick}>
                    <i className="bi bi-door-open me-2"></i> Check-in
                </button>
                <button type="button" className="col btn action-btn btn-lg btn-smooth" onClick={onRenewSignatureClick}>
                    <i className="bi bi-arrow-repeat me-2"></i> Renovar Assinatura
                </button>
                <button type="button" className="col btn action-btn btn-lg btn-smooth" onClick={onUpdateStateClick}>
                    <i className="bi bi-sliders me-2"></i> Atualizar Estado
                </button>
            </div>
        </div>
    );
}
