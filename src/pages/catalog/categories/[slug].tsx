import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from "next";
import { Title } from '../../../styles/pages/Home';

interface CategoryProps {
    products: IProduct[]
}

interface IProduct {
    id: string;
    title: string;
}

export default function Category({products}: CategoryProps) {
    const router = useRouter();

    //must have if the route is dinamic with static props
    if(router.isFallback){
        return <div>Loading...</div>
    }

    return (
        <div>
            <Title>{router.query.slug}</Title>
            <ul>
                {products.map(product => {
                    return (
                        <li key={product.id}>
                            {product.title}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}


//when you want to have static props in a dinamic route you need to use static paths
export const getStaticPaths: GetStaticPaths = async () => {
    const response = await fetch(`http://localhost:3333/categories`)
    const categories = await response.json();

    const paths = categories.map(category => {
        return {
            params: { slug: category.id }
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
    const response = await fetch(`http://localhost:3333/products?category_id=${slug}`)
    const products = await response.json();

    return {
        props: {
            products
        },
        revalidate: 60,
    }
}