export const TMDB_BASE_URL="https://api.themoviedb.org/3"

export const get = async ({url,type,params}) => {
    try {
        const query_params=params.map(item=>`${item.key}=${item.value}`).join('&')
        const fetch_url=type==="tmdb"?`${TMDB_BASE_URL}${url}?api_key=${process.env.TMDB_API_KEY}&${query_params}`:`${url}&${query_params}`
        const response=await fetch(fetch_url)
        const data=await response.json()
        if (type!=="tmdb") return data
        if (data.success===false) return {success:false,error:{...data,type}}
        return data
    } catch (error) {
        throw error
        return {success:false,error:`${error.message}`}
    }
}