import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import Prismic from 'prismic-javascript'
import { Document } from 'prismic-javascript/types/documents'
import Link from 'next/link'
import PrismicDOM from 'prismic-dom'
import { client } from "../lib/Prismic"
import { Title } from "../styles/pages/Home"
interface SearchProps {
    searchResults: Document[];
}

export default function Search({searchResults}: SearchProps) {
    const [search, setSearch] = useState('')
    const router = useRouter()

    function handleSearch(e) {
        e.preventDefault()

        //pushes to the route with the query that the person typed
        router.push(`/search?q=${encodeURIComponent(search)}`)

        setSearch('')
    }

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
                <button type="submit">Search</button>
            </form>
            <section>
        <Title>Products</Title>
        <ul>
          {searchResults.map(product => {
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

//getting the props from the ss so google can index
export const getServerSideProps: GetServerSideProps<SearchProps> = async (context) => {
    //gets from the context the query param, if null there is no param
    const { q } = context.query

    if (!q) {
        return { props: { searchResults: [] } };
    }

    //searches only for the products and its title
    const searchResults = await client().query([
        Prismic.Predicates.at('document.type', 'product'),
        Prismic.Predicates.fulltext('my.product.title', String(q)),
        
        //if the following line is added it's going to search for a product that satisfies both conditions
        //Prismic.Predicates.fulltext('my.product.description', String(q))
    ])

    return {
        props: {
            searchResults: searchResults.results
        }
    }
}