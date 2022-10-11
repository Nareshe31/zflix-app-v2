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
    const [data_type, setdata_type] = useState(
        loadData[data_types[0]] ? null : data_types[0].value
    );
    const [data, setdata] = useState(
        loadData[data_type] ? null : all_data[data_type]
    );
    const [alldata, setalldata] = useState(all_data ? all_data : {});
    const [loaddata, setloaddata] = useState(loadData ? loadData : {});
    const [containerview, setcontainerview] = useState(view ? view : "vertical");
    const posterSection = useRef(null);
    // const data=useMemo(() => , [data_type])
    // const data=data_type==="day"?data_day:data_week

    useEffect(() => {
        if (loaddata[data_type]) {
            getData();
        } else {
            setdata(alldata[data_type]);
        }
    }, [data_type]);

    const getData = async () => {
        setdata(null);
        const data = await get(meta_data[data_type]);
        setdata(data);
        setloaddata((prev) => ({ ...prev, [data_type]: false }));
        setalldata((prev) => ({ ...prev, [data_type]: data }));
    };

    return (
        <section className={`posters_section ${containerview}`}>
            <PosterHeader
                change_view={setcontainerview}
                posterSectionRef={posterSection}
                data_types={data_types}
                title={title}
                data_type={setdata_type}
                data={data_type}
                containerview={containerview}
            />
            {data ? (
                <>
                    {containerview === "horizontal" ? (
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
                            }}
                            nav={false}
                            autoplay={false}
                        >
                            {data?.results?.map((item) => (
                                <Poster media_type={media_type} key={item.id} item={item} />
                            ))}
                        </OwlCarousel>
                    ) : (
                        <div className="items" ref={posterSection}>
                            {data?.results?.map((item) => (
                                <Poster media_type={media_type} key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="load-container">
                    <div className="loader"></div>
                </div>
            )}
        </section>
    );
}
