import Head from "next/head";
import { useRouter } from "next/router";

export default function PageHead({title,image_path,overview}) {
    const router = useRouter();
    return(
        <Head>
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={overview} />
            <meta
                name="keywords"
                content="Movies, TV Shows, Streaming, Reviews, Actors, Actresses, Photos, User Ratings, Synopsis, Trailers, Teasers, Credits, Cast"
            />

            <meta property="og:type" content="website" />
            <meta property="og:url" content={process.env.NEXT_PUBLIC_BASE_URL+router.asPath} />
            <meta property="og:site_name" content="ZFlix" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={overview} />
            <meta property="og:image" content={image_path} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={process.env.NEXT_PUBLIC_BASE_URL+router.asPath} />
            <meta
                property="twitter:title"
                content={title}
            />
            <meta property="twitter:description" content={overview} />
            <meta
                property="twitter:image"
                content={image_path}
            ></meta>
        </Head>
    )
}