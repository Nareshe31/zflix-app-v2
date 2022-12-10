export const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const get = async ({ url, type, params }) => {
    try {
        const query_params = params
            .map((item) => `${item.key}=${item.value}`)
            .join("&");
        const fetch_url =
            type === "tmdb_client"
                ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/data-fetch`
                : type === "tmdb_server"
                    ? `${TMDB_BASE_URL}${url}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&${query_params}`
                    : `${url}${query_params}`;
        const fetch_type = (type === "tmdb_client" || type === "tmdb_server")?"tmdb":type
        console.log(fetch_url);
        var response={}
        if (type==="tmdb_server") {
            response = await fetch(fetch_url);
        }
        else{
            response = await fetch(fetch_url, {
                method:"POST",
                body: JSON.stringify({ url,type:fetch_type , params }),
            });
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
