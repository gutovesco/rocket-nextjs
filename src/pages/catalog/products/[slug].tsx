import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useState } from 'react';

//lazy loading
//use ssr false when you need to use resources from the browser, for example document and window
const AddToCartModal = dynamic(
    () => import('../../../components/Modal'),
    { loading: () => <div>Loading...</div>, ssr: true }
)

export default function Products() {
    const [showModal, setShowModal] = useState(false)
    const router = useRouter();

    function handleAddToCart() {
        setShowModal(!showModal)
    }

    return (
        <>
            <div>{router.query.slug}</div>

            <button onClick={handleAddToCart}>Add to cart</button>
            {showModal && <AddToCartModal/>}
        </>
    )
}