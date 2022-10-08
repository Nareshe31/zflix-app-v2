import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { getLink, getYear } from "../utils/functions";

export default function Poster({ item, type }) {
    const router = useRouter();
    let { language } = router.query;

    const title = type === "movie" ? item.title : item.name;
    const year =
        type === "movie"
            ? getYear(item.release_date)
            : getYear(item.first_air_date);
    const link = getLink(item, type,language);
    return (
        <article key={item.id} id={`post-${item.id}`} className="item movies">
            <div className="poster">
                <div className="poster-image">
                    <Image
                        placeholder="blur"
                        blurDataURL={"https://image.tmdb.org/t/p/w342" + item.poster_path}
                        src={"https://image.tmdb.org/t/p/w342" + item.poster_path}
                        alt={title}
                        layout="responsive"
                        width={160}
                        height={220}
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
                <Link href={link}>
                    <a  title={title}>
                        <div className="see play4"></div>
                    </a>
                </Link>
            </div>
            <div className="data dfeatur">
                <h3 title={title}>
                    <Link href={link}>
                        <a>{title}</a>
                    </Link>
                </h3>
                <span>{year}</span>
            </div>
        </article>
    );
}
