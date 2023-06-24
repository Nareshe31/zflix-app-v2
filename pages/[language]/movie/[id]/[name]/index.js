// import PageHead from "../../../../../molecules/PageHead"
import { getCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Genres from "../../../../../molecules/Genres";
import PageHead from "../../../../../molecules/PageHead";
import PosterContainer from "../../../../../molecules/PosterContainer";
import { get } from "../../../../../service/api-fetch";
import {
  getDate,
  getYear,
  TMDB_BASE_IMAGE_PATH,
} from "../../../../../utils/functions";

export default function MoviePage({ data }) {
  // console.log(data);
  const router = useRouter();
  const { language } = router.query;
  const poster_path = `${TMDB_BASE_IMAGE_PATH("w342")}${data.poster_path}`;
  const showWatchContainer = new Date() >= new Date(data?.release_date);
  const region = getCookie("region")
    ? JSON.parse(getCookie("region"))
    : { name: "India", "alpha-2": "IN", "country-code": "" };
  const [watchRegion, setwatchRegion] = useState(region["alpha-2"]);
  const [isAddedToWatchlist, setisAddedToWatchlist] = useState(
    checkIfAddedInBookmark()
  );

  function getAddItem(media_type) {
    const {
      name,
      title,
      release_date,
      first_air_date,
      poster_path,
      id,
      vote_average,
    } = data;
    switch (media_type) {
      case "movie":
        return {
          id,
          title,
          release_date,
          poster_path,
          media_type,
          vote_average,
          added_at: Date.now(),
        };
        break;
      case "tv":
        return {
          id,
          name,
          first_air_date,
          poster_path,
          media_type,
          vote_average,
          added_at: Date.now(),
        };
        break;
      default:
        break;
    }
  }

  function handleBookmark(event) {
    event.preventDefault();
    const watchlist = localStorage.getItem("watchlist")
      ? JSON.parse(localStorage.getItem("watchlist"))
      : [];
    var newWatchlist = [];
    if (!checkIfAddedInBookmark()) {
      const addItem = getAddItem("movie");
      newWatchlist = [...watchlist, addItem];
      setisAddedToWatchlist(true);
    } else {
      newWatchlist = watchlist.filter((item) => item.id !== data.id);
      setisAddedToWatchlist(false);
    }

    localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
  }

  function checkIfAddedInBookmark() {
    if (typeof window === "undefined") {
      return false;
    }
    const watchlist = localStorage.getItem("watchlist")
      ? JSON.parse(localStorage.getItem("watchlist"))
      : [];
    return watchlist.filter((item) => item.id === data.id).length > 0;
  }

  useEffect(() => {
    setisAddedToWatchlist(checkIfAddedInBookmark());
  }, [data]);

  const { isLoading, data: torrents } = useQuery(
    ["movie-torrents", data.imdb_id],
    () => {
      return get({
        url: `/api/v2/torrent/movie/${data.imdb_id}`,
        type: "server",
        params: [],
      });
    },
    { refetchOnMount: false, refetchOnWindowFocus: false }
  );

  return (
    <>
      <PageHead
        title={`Watch ${data.title} (${getYear(data.release_date)}) / ZFlix`}
        image_path={TMDB_BASE_IMAGE_PATH("w342") + data.poster_path}
        overview={data.overview}
      />
      <header className="bread-crumbs">
        <span>
          <Link href={`/${language}`}>Home</Link>
        </span>
        <span className="separator">/</span>

        <span>
          <Link href={`/${language}/movies`}>Movies</Link>
        </span>

        <span className="separator">/</span>
        <span className="title">{data.title}</span>
      </header>
      {showWatchContainer ? (
        <section className="watch-container">
          <iframe
            id="watch-frame"
            key={data.id}
            webkitallowfullscreen=""
            mozallowfullscreen=""
            allowfullscreen=""
            frameBorder={0}
            src={`https://embed.smashystream.com/playere.php?tmdb=${data.id}`}
            title={data.id}
          ></iframe>
        </section>
      ) : null}
      <section className="movie-details">
        <div className="poster-container">
          <Image
            src={poster_path}
            blurDataURL={poster_path}
            layout="fill"
            alt={data.title}
            objectFit="cover"
          />
        </div>
        <div className="info">
          <h3 className="tex-lg">{data.title}</h3>
          <p className="text-sm">{data.tagline}</p>
          <p className="text-sm year-runtime">
            <span>{getDate(data.release_date)}</span>
            <span className="dot"></span> <span>{data.runtime}mins</span>
          </p>
          <Genres data={data.genres} type="movie" />
          <p className="text-sm">
            TMDB Rating {Number(data.vote_average).toFixed(1)}/10
          </p>
          {/* <button onClick={handleBookmark}>
                        {isAddedToWatchlist?
                            <>
                                <i className="fa-solid fa-bookmark"></i>
                                Remove from wishlist
                                </>
                            :
                            <>
                                <i className="fa-regular fa-bookmark"></i>
                                Add to wishlist
                            </>
                        }
                    </button> */}
        </div>
      </section>
      <section className="other-details">
        {Object.keys(data["watch/providers"]?.results)?.length ? (
          <div>
            <label htmlFor="">Streaming: </label>
            <select
              value={watchRegion}
              onChange={(e) => setwatchRegion(e.target.value)}
            >
              {Object.keys(data["watch/providers"]?.results).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <div>
              {data["watch/providers"]?.results[watchRegion] ? (
                <>
                  {data["watch/providers"]?.results[watchRegion]?.flatrate?.map(
                    (item) => (
                      <span
                        style={{ margin: "4px 3px", display: "inline-block" }}
                        key={item.provider_id}
                      >
                        <img
                          width={40}
                          height={40}
                          src={TMDB_BASE_IMAGE_PATH("w342") + item.logo_path}
                        />
                      </span>
                    )
                  )}
                </>
              ) : (
                <>
                  {data["watch/providers"]?.results[
                    Object.keys(data["watch/providers"]?.results)[0]
                  ]?.flatrate?.map((item) => (
                    <span
                      style={{ margin: "4px 3px", display: "inline-block" }}
                      key={item.provider_id}
                    >
                      <img
                        width={40}
                        height={40}
                        src={TMDB_BASE_IMAGE_PATH("w342") + item.logo_path}
                      />
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
        ) : null}
        <div className="torrents-section">
          <h3>Torrents</h3>
          {isLoading ? (
            <p>Loading...</p>
          ) : torrents?.result?.length === 0 ? (
            <p>No torrents found</p>
          ) : (
            <div className="table">
              <table>
                <thead>
                  {["Title", "Size", "Seeds", "Peers", "Download"].map(
                    (item) => (
                      <th key={item}>{item}</th>
                    )
                  )}
                </thead>
                {torrents &&
                  torrents?.result?.map((torrent) => {
                    let hash = torrent.link.split("/")[5];
                    let name = String(torrent.title).split(" ");
                    return (
                      <tr key={torrent}>
                        <td>{torrent.title}</td>
                        <td>{torrent.size}</td>
                        <td>{torrent.seeds}</td>
                        <td>{torrent.peers}</td>
                        <td>
                          <a
                            // onClick={() => addTorrentMagnet(item.title)}
                            title={torrent.title}
                            className="magnet-file"
                            href={
                              "magnet:?xt=urn:btih:" +
                              hash +
                              "&amp;dn=" +
                              torrent.title +
                              "&amp;tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&amp;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&amp;tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337&amp;tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337"
                            }
                          >
                            <i className="fa-solid fa-magnet"></i>
                          </a>
                          <a
                            // onClick={() => addTorrentFile(item.title)}
                            title={torrent.title}
                            className="torrent-file"
                            href={
                              "https://torrents.yts.hn/torrent/download/" + hash
                            }
                          >
                            <i class="fa-solid fa-download"></i>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
              </table>
            </div>
          )}
        </div>
      </section>

      <PosterContainer
        title={"More like this"}
        loadData={{ recommendations: true }}
        media_type="movie"
        data_types={[{ name: "Recommendations", value: "recommendations" }]}
        view="horizontal"
        key={"recommendations " + data.id}
        show_change_view={true}
        meta_data={{
          recommendations: {
            url: `/movie/${data.id}/recommendations`,
            type: "tmdb_client",
            params: [{ key: "language", value: language }],
          },
        }}
      />
      <PosterContainer
        title={"You may also like"}
        loadData={{ similar: true }}
        media_type="movie"
        data_types={[{ name: "Similar", value: "similar" }]}
        view="horizontal"
        key={"similar " + data.id}
        show_change_view={true}
        meta_data={{
          similar: {
            url: `/movie/${data.id}/similar`,
            type: "tmdb_client",
            params: [{ key: "language", value: language }],
          },
        }}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const { id, language } = context.query;
    const data = await get({
      url: `/movie/${id}`,
      type: "tmdb_server",
      params: [
        { key: "language", value: language },
        {
          key: "append_to_response",
          value: "videos,images,credits,watch/providers",
        },
      ],
    });
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
