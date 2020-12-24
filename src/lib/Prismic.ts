import Prismic from 'prismic-javascript';

export const apiEndpoint = 'https://nextdevcomerce.cdn.prismic.io/api/v2';

export function client(req = null){
    const option = req ? {req} : null;
    return Prismic.client(apiEndpoint, option)
}