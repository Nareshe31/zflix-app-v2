import Link from "next/link";

export default function Pagination({ loading, data, show, link }) {
    if (!show || loading || data.total_pages===1) return null;
    const {page,total_results}=data
    const total_pages=data.total_pages>500?500:data.total_pages
    const GeneratePages=()=>{
        let a=[],i=page>1 && page<=total_pages-1 ?page-1:(page<=1?1:page-2)
        for (let j = i; j < i+3 && j<=total_pages; j++) {
            const element = <Link key={j} href={`${link}&page=${j}`}><a><span className={page==j?"page active":"page"}>{j}</span></a></Link>
            a.push(element)
        }
        // a.push(<div><span>{total_pages}</span></div>)
        return a
    }
    return( 
        <div className="page-container">
            {loading ? 
                <h4>Loading...</h4> : 
                <>
                    {page>2?
                        <Link href={`${link}&page=${parseInt(1)}`}>
                            <a>
                                <span className={"page-arrow page"}>
                                    <i className="fa fa-angles-left"></i>
                                </span>
                            </a>
                        </Link>
                        :null
                    }
                    <GeneratePages  />
                    {page<(total_pages>500?499:total_pages-1)?
                        <Link href={`${link}&page=${parseInt(total_pages>500?500:total_pages)}`}>
                            <a>
                                <span className={"page-arrow page"}>
                                    <i className="fa fa-angles-right"></i>
                                </span>
                            </a>
                        </Link>
                        :null
                    }
                    </>
            }
        </div>
    )
}