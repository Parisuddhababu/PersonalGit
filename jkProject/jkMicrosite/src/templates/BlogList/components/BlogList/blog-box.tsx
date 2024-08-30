import CustomImage from "@components/CustomImage/CustomImage"
import { IMAGE_PATH } from "@constant/imagepath"
import SafeHtml from "@lib/SafeHTML"
import { TextTruncate, converDateMMDDYYYY } from "@util/common"
import Cookies from "js-cookie"
import Link from "next/link"

const BlogBox = ({
    ele,
    key
}: {
    ele: any,
    key: number
}) => {
    const baseTemplate = parseInt(Cookies.get("baseTemplate") ?? '');
    return (
        baseTemplate == 1 ?
            <div className="d-col d-col-2">
                <div className="post-card">
                    <div className="post-image">
                        <CustomImage
                            src={
                                ele?.image?.path
                                    ? ele?.image?.path
                                    : IMAGE_PATH.blogPostEightJpg
                            }
                            alt="Blog Image"
                            width="480px"
                            height="320px"
                        />
                    </div>

                    <div className="post-card-body">
                        <h4 className="post-card-title">
                            <Link href={`/blog/${ele?._id}`}>
                                <a>{ele?.title} </a>
                            </Link>
                        </h4>
                        <div className="date-category-info">
                            <div className="date">
                                <i className="jkm-calendar mr-10"></i>
                                {converDateMMDDYYYY(ele?.created_at)}
                            </div>
                            <div className="category">
                                <i className="jkm-folder mr-10" />
                                {ele?.tag?.map((ta: string, ind: number) => {
                                    return `${ta}${ele?.tag?.length - 1 > ind ? ", " : ""}`;
                                })}
                            </div>
                            {/* <div className="category">
                <i className="jkm-folder mr-10"></i>Necklace Sets
              </div> */}
                        </div>
                        <SafeHtml html={TextTruncate(ele?.description, 500)} />
                        <Link href={`/blog/${ele?._id}`}>
                            <a className="btn btn-secondary btn-small">Read More</a>
                        </Link>
                    </div>
                </div>
            </div>
            :
            <div key={key} className="d-col d-col-2">
                <div className="post-card">
                    <div className="post-image">
                        <CustomImage
                            src={
                                ele?.image?.path
                                    ? ele?.image?.path
                                    : IMAGE_PATH.blogPostEightJpg
                            }
                            alt="Blog Image"
                            width="480px"
                            height="300px"
                        />
                    </div>

                    <div className="post-card-body">
                        <div className="date-category-info">
                            <div className="date">{converDateMMDDYYYY(ele?.created_at)}</div>
                            <div className="border-right">|</div>
                            <div className="category">{ele?.tag?.[0] || ""}</div>
                        </div>

                        <h4 className="post-card-title">
                            <Link href={`/blog/${ele?._id}`}>
                                <a>{ele?.title}</a>
                            </Link>
                        </h4>

                        <SafeHtml html={TextTruncate(ele?.description, 500)} />
                        <Link href={`/blog/${ele?._id}`}>
                            <a className="btn btn-secondary btn-small">Read More</a>
                        </Link>
                    </div>
                </div>
            </div>
    )
}

export default BlogBox;