
const TMDB_BASE_URL="https://api.themoviedb.org/3"

export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') return res.status(400).json({error:"There has been an error with the service. Please try again"})
        const body = JSON.parse(req.body)
        const {params,type,url}=body
        const query_params=params.map(item=>`${item.key}=${item.value}`).join('&')
        const fetch_url=type==="tmdb"?`${TMDB_BASE_URL}${url}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&${query_params}`:`${url}&${query_params}`
        const response=await fetch(fetch_url)
        const data=await response.json()
        res.status(200).json(data)
    } catch (error) {
        console.log("server ",error.message);
        res.status(400).json({error:"There has been an error with the service. Please try again",success:false})
    }
  }
  