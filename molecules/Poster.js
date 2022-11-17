import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { getLink, getYear, TMDB_BASE_IMAGE_PATH } from "../utils/functions";

export default function Poster({ item, media_type }) {
    const router = useRouter();
    let { language } = router.query;

    const title = media_type === "movie" ? item.title : item.name;
    const year =
        media_type === "movie"
            ? getYear(item.release_date)
            : getYear(item.first_air_date);
    const link = getLink(item, media_type, language);
    const imageURL = `${TMDB_BASE_IMAGE_PATH("w342")}${item.poster_path ? item.poster_path : "/wZwxopzmqOBmS44Y2q4LUsOiFTC.jpg"
        }`;
    return (
        <article key={item.id} id={`post-${item.id}`} className="item movies">
            <div className="poster">
                <div className="poster-image">
                    <Image
                        placeholder="blur"
                        blurDataURL={imageURL}
                        src={imageURL}
                        alt={title}
                        layout="responsive"
                        width={140}
                        height={200}
                    />
                </div>
                {/* <img loading="lazy" data-perfmatters-preload="" src={"https://image.tmdb.org/t/p/w342"+item.poster_path} alt={title}/> */}
                <div className="rating">
                    <i className="fa-solid fa-star"></i>
                    {Number(item.vote_average).toFixed(1)}
                </div>
                <div className="bookmark" onClick={(e) => e.preventDefault()}>
                    <i className="fa-regular fa-bookmark"></i>
                </div>
                {/* <div className="featu">Featured</div> */}
                <Link href={link} passHref>
                    <a title={title}>
                        <div className="see play4"></div>
                    </a>
                </Link>
            </div>
            <div className="data dfeatur">
                <h3 title={title}>
                    {/* <Link href={link} passHref={true}> */}
                        <a href={link}>{title}</a>
                    {/* </Link> */}
                </h3>
                <span>{year}</span>
            </div>
        </article>
    );
}
