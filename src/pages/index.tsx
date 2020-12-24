import { GetServerSideProps } from 'next'
import SEO from '../components/SEO'
import { client } from '../lib/Prismic'
import { Title } from '../styles/pages/Home'
import Prismic from 'prismic-javascript'
import { Document } from 'prismic-javascript/types/documents'
import Link from 'next/link'
import PrismicDOM from 'prismic-dom'

interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: HomeProps) {

  return (
    <div>

      <SEO
        image="logo.jpg"
        title="DevCommerce, fullfiling your deepest desires!"
        shouldExcludeTitleSuffix />

      <section>
        <Title>Products</Title>
        <ul>
          {recommendedProducts.map(product => {
            return (
              <li style={{cursor: 'pointer'}} key={product.id}>
                <Link href={`/catalog/products/${product.uid}`}>
                  <a>
                    {PrismicDOM.RichText.asText(product.data.title)}
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>

  )
}

//get the ssr props
//use this when the content of the screen changes constantly (each time the user is looking at this page
//and refreshes it, the recommended products are reloaded to bring in different products)

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ])

  return {
    props: {
      recommendedProducts: recommendedProducts.results
    }
  }
}