// src/pages/PageNotFound.jsx

export default function PageNotFound() {
  return (
    <div
      className="d-flex justify-content-center align-items-center px-5"
      style={{ minHeight: '100vh' }}
    >
      <div className="text-center">
        <h1 className="display-5">
          <strong>Página Não Encontrada</strong>
        </h1>
        <hr />
        <p className="lead">
          A página buscada não existe ou foi comida pelo totó. O endereço da página pode estar
          expirado, incorreto ou a página pode ter sido removida.
        </p>
        <img
          src="src/static/img/404.png"
          alt="Totó comendo uma página."
          height="300px"
        />
      </div>
    </div>
  );
}
