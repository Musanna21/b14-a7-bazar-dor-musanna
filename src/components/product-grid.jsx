import ProductCard from './product-card'

export const GRID_CLASS =
  'grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

export default function ProductGrid ({ products }) {
  return (
    <div className={GRID_CLASS}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
