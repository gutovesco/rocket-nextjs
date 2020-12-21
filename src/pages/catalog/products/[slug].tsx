import { useRouter } from 'next/router'

export default function Products() {
    const router = useRouter();

    return (
        <div>{router.query.slug}</div>
    )
}