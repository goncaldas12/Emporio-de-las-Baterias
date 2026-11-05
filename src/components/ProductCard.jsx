export function ProductCard({ product, hidden }) {
  return (
    <article
      className="product-card"
      data-brand={product.brand}
      data-type={product.type}
      data-search={product.search}
      hidden={hidden}
    >
      <div className="product-img">
        <img loading="lazy" src={product.image} alt={product.alt} />
      </div>
      <div className="product-body">
        <span className="product-brand">{product.brand.toUpperCase()}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <a href={product.href} className="card-link">
          Consultar precio <span>→</span>
        </a>
      </div>
    </article>
  );
}
