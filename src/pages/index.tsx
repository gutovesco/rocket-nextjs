import { GetServerSideProps } from 'next'
import SEO from '../components/SEO'
import { Title } from '../styles/pages/Home'

interface IProduct {
  id: string;
  title: string;
}

interface HomeProps {
  recommendedProducts: IProduct[];
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
              <li key={product.id}>
                {product.title}
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
  const response = await fetch('http://localhost:3333/recommended')
  const recommendedProducts = await response.json();

  return {
    props: {
      recommendedProducts
    }
  }
}