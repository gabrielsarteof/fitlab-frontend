export default function HeaderBanner({ nome }) {
  return (
    <section
      className="d-flex bg-light rounded-3 justify-start align-items-center mb-4 position-relative"
      style={{ minHeight: 120 }}
    >
      <div className="text-primary p-4" style={{ zIndex: 1 }}>
        <h3 className="mb-1 fw-bold">Olá, {nome}!</h3>
        <div className="text-muted mb-1">Acompanhe sua academia.</div>
      </div>
      <img
        src={`${import.meta.env.BASE_URL}fitlab-logo-primary.svg`}
        alt="avatar"
        className="avatar-absolute img-fluid"
        style={{
          position: 'absolute',
          right: 10,
          bottom: 0,
          zIndex: 2,
          maxWidth: 130,      // tamanho máximo padrão
          height: 'auto',     // mantém proporção
        }}
      />
    </section>
  )
}
