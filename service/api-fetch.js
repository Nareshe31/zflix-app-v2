export const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const get = async ({ url, type, params }) => {
    try {
        const query_params = params
            .map((item) => `${item.key}=${item.value}`)
            .join("&");
        let fetch_url;
        switch (type) {
            case "tmdb_client":
                fetch_url=`${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/data-fetch`
                break;
            case "tmdb_server":
                fetch_url= `${TMDB_BASE_URL}${url}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&${query_params}`
                break;
            case "server":
                fetch_url=`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${url}`
                break;
            default:
                fetch_url=url;
                break;
        }
        const fetch_type = (type === "tmdb_client" || type === "tmdb_server")?"tmdb":type
        var response={}
        if(type === "tmdb_client"){
            response = await fetch(fetch_url, {
                method:"POST",
                body: JSON.stringify({ url,type:fetch_type , params }),
            });
        }
        else {
            response = await fetch(fetch_url);
        }
        const data = await response.json();
        if (type !== "tmdb_client" || type !== "tmdb_server") return data;
        if (data.success === false)
            return { success: false, error: { ...data, type } };
        return data;
    } catch (error) {
        console.log("hello get ",error.message);
        throw Error(error);
        return { success: false, error: `${error.message}` };
    }
};
