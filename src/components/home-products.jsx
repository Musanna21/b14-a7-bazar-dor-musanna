import { getProducts } from '../lib/bazardor'
import AllProducts from './all-products'
import ProductGrid from './product-grid'
import SectionHeading from './section-heading'

function EmptyNote ({ children }) {
  return (
    <p className='rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-8 text-center text-sm text-gray-500'>
      {children}
    </p>
  )
}

export default async function HomeProducts () {
  // If the API is down this throws and the app's error page (with a retry
  // button) is shown.
  const products = await getProducts()

  const risers = products
    .filter(product => product.trend === 'up')
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 6)

  const fallers = products
    .filter(product => product.trend === 'down')
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 6)

  return (
    <>
      {/* Section A: biggest price rises */}
      <section className='bazar-container py-10 sm:py-12'>
        <SectionHeading
          title='আজ দাম বেড়েছে ▲'
          subtitle='গতকালের তুলনায় যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে।'
          tone='up'
        />

        {risers.length > 0
          ? (
            <ProductGrid products={risers} />
            )
          : (
            <EmptyNote>আজ কোনো পণ্যের দাম বাড়েনি।</EmptyNote>
            )}
      </section>

      {/* Section B: biggest price falls */}
      <section className='border-y border-green-100 bg-white py-10 sm:py-12'>
        <div className='bazar-container'>
          <SectionHeading
            title='আজ দাম কমেছে ▼'
            subtitle='গতকালের তুলনায় যেসব পণ্যের দাম সবচেয়ে বেশি কমেছে।'
            tone='down'
          />

          {fallers.length > 0
            ? (
              <ProductGrid products={fallers} />
              )
            : (
              <EmptyNote>আজ কোনো পণ্যের দাম কমেনি।</EmptyNote>
              )}
        </div>
      </section>

      {/* Section C: all products */}
      <section id='সব-পণ্য' className='section-anchor bazar-container py-10 sm:py-12'>
        <SectionHeading
          title='সব পণ্য'
          subtitle='নিত্যপ্রয়োজনীয় সব পণ্যের আজকের দাম ও গতকালের তুলনায় পরিবর্তন।'
        />

        <AllProducts products={products} />
      </section>
    </>
  )
}
