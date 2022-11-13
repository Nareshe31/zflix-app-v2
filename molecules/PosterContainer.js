import PosterHeader from "./PosterHeader";
import Poster from "./Poster";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { get } from "../service/api-fetch";

const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

export default function PosterContainer({
    title,
    all_data,
    data_types,
    media_type,
    loadData,
    meta_data,
    view,
}) {
    const datatype = loadData[data_types[0]] ? null : data_types[0].value;
    const [data, setdata] = useState({
        data_type: datatype,
        loading: loadData[datatype] ? true : false,
        all_data: all_data ? all_data : {},
        loadData: loadData ? loadData : {},
        view: view ? view : "vertical",
        title,
    });
    const posterSection = useRef(null);
    // const data=useMemo(() => , [data_type])
    // const data=data_type==="day"?data_day:data_week
    const obj = {
        title,
        all_data,
        data_types,
        media_type,
        loadData,
        meta_data,
        view,
    };
    const renderCounter = useRef(0);

    useEffect(() => {
        if (data.loadData[data.data_type]) {
            getData();
        }
        else{
            setdata(prev=>({...prev,loading:false}))
        }
    }, [data.data_type]);

    const getData = async () => {
        setdata((prev) => ({ ...prev, loading: true }));
        const responsedata = await get(meta_data[data.data_type]);
        setdata((prev) => ({
            ...prev,
            loading: false,
            loadData: { ...prev.loadData, [prev.data_type]: false },
            all_data: { ...prev.all_data, [prev.data_type]: responsedata },
        }));
    };

    const change_data_type = (datatype) => {
        setdata((prev) => ({ ...prev, data_type: datatype,loading:true }));
    };

    const change_view = () => {
        setdata((prev) => ({
            ...prev,
            view: prev.view === "vertical" ? "horizontal" : "vertical",
        }));
    };
    return (
        <section className={`posters_section ${data.view}`}>
            <PosterHeader
                change_view={change_view}
                posterSectionRef={posterSection}
                data_types={data_types}
                title={title}
                data_type={change_data_type}
                data={data.data_type}
                containerview={data.view}
            />
            {data.view === "horizontal" ? (
                <OwlCarouselSlider
                    data={data.all_data[data.data_type]}
                    loading={data.loading}
                    meta_data={meta_data}
                    key={"owl "+data.view+" " + JSON.stringify(data.all_data)}
                    media_type={media_type}
                />
            ) : (
                <VerticalPosterContainer
                    data={data.all_data[data.data_type]}
                    loading={data.loading}
                    media_type={media_type}
                    key={"default "+data.view+" " + JSON.stringify(data.all_data)}
                    posterSection={posterSection}
                />
            )}
        </section>
    );
}

function VerticalPosterContainer({
    data,
    media_type,
    loading,
    meta_data,
    posterSection,
}) {
    if (loading) {
        return (
            <div className="items">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,15,16,17,18,19,20].map((item) => (
                    <article key={item+" " + JSON.stringify(meta_data)} className="item-load">
                        <div className="poster-load"></div>
                        <div className="data-load">
                            <h3></h3>
                            <span></span>
                        </div>
                    </article>
                ))}
            </div>
        );
    }
    return (
        <div className="items" ref={posterSection}>
            {data?.results?.map((item) => (
                <Poster media_type={media_type} key={item.id} item={item} />
            ))}
        </div>
    );
}
function OwlCarouselSlider({ data, media_type, loading, meta_data }) {
    if (loading) {
        return (
            <OwlCarousel
                responsive={{
                    0: {
                        items: 3,
                    },
                    640: {
                        items: 4,
                    },
                    760: {
                        items: 5,
                    },
                    880: {
                        items: 6,
                    },
                    1000: {
                        items: 7,
                    },
                    1120: {
                        items: 8,
                    },
                }}
                autoplay={false}
                dots={false}
                slideBy="page"
            >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,15,16,17,18,19,20].map((item) => (
                    <article key={item + JSON.stringify(meta_data)} className="item-load">
                        <div className="poster-load"></div>
                        <div className="data-load">
                            <h3></h3>
                            <span></span>
                        </div>
                    </article>
                ))}
            </OwlCarousel>
        );
    }
    return (
        <OwlCarousel
            responsive={{
                0: {
                    items: 3,
                },
                640: {
                    items: 4,
                },
                760: {
                    items: 5,
                },
                880: {
                    items: 6,
                },
                1000: {
                    items: 7,
                },
                1120: {
                    items: 8,
                },
            }}
            autoplay={false}
            dots={false}
            slideBy="page"
        >
            {data?.results?.map((item) => (
                <Poster media_type={media_type} key={item.id} item={item} />
            ))}
        </OwlCarousel>
    );
}
