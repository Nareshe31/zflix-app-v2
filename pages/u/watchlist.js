import { useEffect, useState } from "react";
import PageHead from "../../molecules/PageHead";
import PosterContainer from "../../molecules/PosterContainer";
import { overview } from "../../utils/functions";

export default function Watchlist() {

    const [data, setdata] = useState(null)
    useEffect(() => {
        const watchlist=localStorage.getItem('watchlist')?JSON.parse(localStorage.getItem('watchlist')):[]
        setdata(watchlist)
      return () => {
      }
    }, [])
    
    return(
        <>
            <PageHead
                title={"Watchlist / ZFlix"}
                overview={overview}
                image_path="/icons/apple-touch-icon.png"
            />
            {data===null?
                <div>
                    <h3>Watchlist</h3>
                    <span>Loading...</span>
                </div>
            :
                <PosterContainer
                    title={"Your watchlist"}
                    data_types={[{name:"Watchlist",value:"watchlist"}]}
                    loadData={{watchlist:false}}
                    show_change_view={false}
                    all_data={{watchlist:{results:data}}}
                    show_media_type={true}
            />
            }
            
        </>
    )
}