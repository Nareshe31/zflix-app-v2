import Link from "next/link";
import { useRouter } from "next/router";

export default function Genres({ data,type}) {
    const router = useRouter();
    const { language} = router.query;    
    return (
        <div className="genres text-sm">
            {data.map((genre) => (
                <Link
                    key={genre.id}
                    href={{
                        pathname: `/[language]/genre/${type}/[name]`,
                        query: {
                            language: language,
                            id: genre.id,
                            name: `${String(genre.name).toLowerCase()}`,
                        },
                    }}
                >
                    <a>
                        <span className="genre">{genre.name}</span>
                    </a>
                </Link>
            ))}
        </div>
    );
}
