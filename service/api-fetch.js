export const TMDB_BASE_URL="https://api.themoviedb.org/3"

export const get = async ({url,type,params}) => {
    try {
        const query_params=params.map(item=>`${item.key}=${item.value}`).join('&')
        const fetch_url=type==="tmdb"?`${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/data-fetch`:`${url}?${query_params}`
        const response=await fetch(fetch_url,{method:"POST",body:JSON.stringify({url,type,params})})
        const data=await response.json()
        if (type!=="tmdb") return data
        if (data.success===false) return {success:false,error:{...data,type}}
        return data
    } catch (error) {
        console.log('====================================');
        console.log(error.message);
        console.log('====================================');
        throw Error(error)
        return {success:false,error:`${error.message}`}
    }
}