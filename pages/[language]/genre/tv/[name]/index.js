import PageHead from "../../../../../molecules/PageHead";
import PosterContainer from "../../../../../molecules/PosterContainer";
import { useRouter } from "next/router";
import { getCookie, setCookie } from 'cookies-next';
import { get } from "../../../../../service/api-fetch";
import { overview } from "../../../../../utils/functions";

export default function MovieGenre({data}) {
     
    const router=useRouter()
    const {language,id,page=1,include_adult="no",name}=router.query


    function generateLink() {
        const link=`/${language}/genre/tv/${name}?id=${id}`
        return link
    }
    const genre_name=String(name)[0].toUpperCase()+String(name).slice(1)
    return(
        <>
            <PageHead
                title={`${genre_name} shows / ZFlix`}
                overview={overview}
                image_path="/icons/apple-touch-icon.png"
            />
            <PosterContainer
                title={`${genre_name} shows`}
                media_type={"tv"}
                data_types={[{name:"Search",value:"search"}]}
                loadData={{search:false}}
                show_change_view={false}
                key={id+language+page+include_adult+name}
                show_pagination={true}
                current_page={page}
                link={generateLink()}
                all_data={{search:data}}
            />
        </>
    )
}

export async function getServerSideProps({ query,req,res }) {
    try {
        const forwarded = req.headers["x-forwarded-for"];
        const ip = forwarded
            ? forwarded.split(/, /)[0]
            : req.connection.remoteAddress;
       
        const {language,page=1,name,id,include_adult="no"}=query
        const isregion=getCookie('region',{req,res})
        var region={}
        if (isregion) {
            region=JSON.parse(getCookie('region',{req,res}))
        }
        else{
            const response=await fetch(`http://ip-api.com/json/${ip}`)
            const data=await response.json()
            region={"name": data.country,
            "alpha-2": data.countryCode,
            "country-code": ""}
            setCookie('region',region,{req,res})
        }
        const genre_data = await get({
            url: `/discover/tv`,
            type: "tmdb",
            params: [
                { key: "language", value: language },
                { key: "with_genres", value: id },
                { key: "page", value: page },
                { key: "include_adult", value: include_adult==="Yes"?true:false },
                // {key:"region",value:region["alpha-2"]}
            ],
        });
        return {
            props: {
                data:genre_data,
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
}