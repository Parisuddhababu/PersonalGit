import { CSS_NAME_PATH } from "@constant/cssNamePath.constant"
import { getTypeBasedCSSPath } from "@util/common"
import Head from "next/head"
import Link from "next/link"
import { Fragment } from "react"

type BreadCrumbsProps = {
    item: {
        slug: string
        title: string
        isClickable?: boolean
    }[]
}

const BreadCrumbs = ({ item }: BreadCrumbsProps) => {
    return (
        <Fragment>
            <Head>
                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath(null, CSS_NAME_PATH.breadcrumbBar)}
                />
            </Head>
            <section className="breadcrumb-bar-section">
                <div className="container">
                    <ul className="breadcrumb">
                        <li>
                            <Link href={'/'}>
                                <a aria-label="home-page-link">
                                    <em className="osicon-home"></em>
                                </a>
                            </Link>
                        </li>
                        {
                            item?.map((i) => (
                                i?.isClickable ?
                                    <li key={i?.slug}>
                                        <Link href={i.slug}>
                                            <a>{i?.title}</a>
                                        </Link>
                                    </li>
                                    : <li key={i?.slug}>
                                        <a>{i?.title}</a>
                                    </li>
                            ))
                        }
                    </ul>
                </div>
            </section>
        </Fragment>
    )
}

export default BreadCrumbs