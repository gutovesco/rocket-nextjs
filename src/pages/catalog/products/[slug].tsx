import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import React, { useState } from 'react';
import Prismic from 'prismic-javascript'
import { Document } from 'prismic-javascript/types/documents'
import Link from 'next/link'
import PrismicDOM from 'prismic-dom'
import { GetStaticPaths, GetStaticProps } from "next";
import { client } from '../../../lib/Prismic';
import { Title } from '../../../styles/pages/Home';

interface ProductProps {
    product: Document;
}

//lazy loading
//use ssr false when you need to use resources from the browser, for example document and window
const AddToCartModal = dynamic(
    () => import('../../../components/Modal'),
    { loading: () => <div>Loading...</div>, ssr: true }
)

export default function Products({ product }: ProductProps) {
    const [showModal, setShowModal] = useState(false)
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>
    }

    function handleAddToCart() {
        setShowModal(!showModal)
    }

    return (
        <>
            <Title>{PrismicDOM.RichText.asText(product.data.title)}</Title>

            <img src={product.data.thumbnail.url} alt={product.data.title} width="400" />

            <div dangerouslySetInnerHTML={{ __html: PrismicDOM.RichText.asHtml(product.data.description) }} />

            <div>Price: ${product.data.price}</div>

            <button onClick={handleAddToCart}>Add to cart</button>
            {showModal && <AddToCartModal />}
        </>
    )
}

//when you want to have static props in a dinamic route you need to use static paths
//fallback searches in the api a product if none can be found
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true
    }
}

//getting the static props from the api
export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
    const { slug } = context.params;

    const product = await client().getByUID('product', String(slug), {});

    return {
        props: {
            product
        },
        revalidate: 10,
    }
}