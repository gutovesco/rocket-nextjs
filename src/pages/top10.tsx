import { GetStaticProps } from "next";
import { Title } from "../styles/pages/Home";

interface IProduct {
    id: string;
    title: string;
}

interface Top10Props {
    products: IProduct[]
}

export default function Top10({ products }: Top10Props) {
    return (
        <div>
            <Title>Top 10</Title>
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

//getting the static props
//use this when the content that you need to show isn't dynamic (doesn't change constantly)
//revalidate is used to defined how many seconds it'll take for the function to update the props
export const getStaticProps: GetStaticProps<Top10Props> = async (context) => {
    const response = await fetch('http://localhost:3333/products')
    const products = await response.json();

    return {
        props: {
            products
        },
        revalidate: 5
    }
}