import CustomImage from "@components/CustomImage/CustomImage"
import { IMAGE_PATH } from "@constant/imagepath"
import SafeHtml from "@lib/SafeHTML"
import { IHomeBlogData } from "@type/Pages/home"
import { TextTruncate, converDateMMDDYYYY } from "@util/common"
import Cookies from "js-cookie"
import Link from "next/link"
import Router from "next/router";

const BlogHomeBox = ({
    ele,
    key
}: {
    ele: IHomeBlogData,
    key: number
}) => {
    const baseTemplate = parseInt(Cookies.get("baseTemplate") ?? '');
    return (
        baseTemplate == 1 ?
            <div key={key} className="d-col d-col-3">
                <div className="post-card">
                    <div className="post-image">
                        <CustomImage
                            src={
                                ele?.image?.path
                                    ? ele?.image?.path
                                    : IMAGE_PATH.blogPostSevenJpg
                            }
                            alt="Blog Image"
                            title="Blog Image"
                            width="480px"
                            height="320px"
                        />
                    </div>

                    <div className="post-card-body">
                        <h4 className="post-card-title h4">
                            <Link href={`blog/${ele?._id}`}>
                                <a>{ele.title}</a>
                            </Link>
                        </h4>
                        <div className="date-category-info">
                            <div className="date">
                                <i className="jkm-calendar mr-10" />
                                {converDateMMDDYYYY(ele?.created_at)}
                            </div>
                            <div className="category">
                                <i className="jkm-folder mr-10" />
                                {ele?.tag?.map((ta, ind) => {
                                    return `${ta}${ele?.tag?.length - 1 > ind ? ", " : ""
                                        }`;
                                })}
                            </div>
                        </div>
                        {/* <p> */}
                        <SafeHtml
                            html={TextTruncate(ele?.description, 500)}
                            removeAllTags={true}
                        />
                        {/* </p> */}
                        <button
                            onClick={() => Router.push("/blog")}
                            type="button"
                            className="btn btn-secondary btn-small"
                        >
                            Read More
                        </button>
                    </div>
                </div>
            </div>
            :
            <div className="d-col d-col-3" key={key}>
                <div className="post-card">
                    <div className="post-image">
                        <CustomImage
                            src={ele?.image.path}
                            height="300px"
                            width="480px"
                        />
                    </div>

                    <div className="post-card-body">
                        <div className="date-category-info">
                            <div className="date">
                                {converDateMMDDYYYY(ele?.created_at)}
                            </div>
                            {/* <div className="border-right">|</div> */}
                        </div>
                        <h4 className="post-card-title">
                            <Link href={`/blog/${ele?._id}`}>
                                <a>{ele?.title}</a>
                            </Link>
                        </h4>
                        {/* <p> */}
                        <SafeHtml
                            html={TextTruncate(ele?.description, 500)}
                            removeAllTags={true}
                        />
                        {/* </p> */}
                        <button
                            onClick={() => Router.push("/blog")}
                            type="button"
                            className="btn btn-secondary btn-small"
                        >
                            Read More
                        </button>
                    </div>
                </div>
            </div>
    )
}

export default BlogHomeBox;