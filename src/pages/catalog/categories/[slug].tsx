import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from "next";
import { Title } from '../../../styles/pages/Home';
import { client } from '../../../lib/Prismic';
import Prismic from 'prismic-javascript'
import { Document } from 'prismic-javascript/types/documents'
import Link from 'next/link'
import PrismicDOM from 'prismic-dom'

interface CategoryProps {
    category: Document;
    products: Document[]
}

export default function Category({ products, category }: CategoryProps) {
    const router = useRouter();

    //must have if the route is dinamic with static props
    if (router.isFallback) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <Title>{PrismicDOM.RichText.asText(category.data.title)}</Title>
            <ul>
                {products.map(product => {
                    return (
                        <li style={{ cursor: 'pointer' }} key={product.id}>
                            <Link href={`/catalog/products/${product.uid}`}>
                                <a style={{ outline: 'none', textDecoration: 'none', color: 'whitesmoke' }}>
                                    {PrismicDOM.RichText.asText(product.data.title)}
                                </a>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}


//when you want to have static props in a dinamic route you need to use static paths
export const getStaticPaths: GetStaticPaths = async () => {
    const categories = await client().query([
        Prismic.Predicates.at('document.type', 'category'),
    ])

    const paths = categories.results.map(category => {
        return {
            params: { slug: category.uid }
        }
    })
    return {
        paths: paths,
        fallback: true
    }
}

//getting the static props from the api
export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
    const { slug } = context.params;

    const category = await client().getByUID('category', String(slug), {});

    const products = await client().query([
        Prismic.Predicates.at('document.type', 'product'),
        Prismic.Predicates.at('my.product.category', category.id)
    ])

    return {
        props: {
            category,
            products: products.results
        },
        revalidate: 60,
    }
}