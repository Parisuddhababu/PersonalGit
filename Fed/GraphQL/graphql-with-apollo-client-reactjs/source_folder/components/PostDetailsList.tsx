import Link from "next/link";

export default function PostDetailsList(props:any){
    return(<>   
            <div className="post-content">
                <div className='post-details-title'>{props.posts.props.data.post.title}</div>
                <div className="post-list">
                    <div className='post-list-id'>
                        <p><b>Post no.</b> {props.posts.props.data.post.id}</p>
                    </div>
                    <p>
                        {props.posts.props.data.post.body}
                    </p>
                    <div className='post-user-detils'>
                        <p><b>User:</b> {props.posts.props.data.post.user.name}</p>
                        <div><b>Username:</b> {props.posts.props.data.post.user.username}</div>
                    </div>
                    <div style={{float:'right',color:'blue'}}><Link href='/post'><a>Read All Post</a></Link></div>
                </div>
            </div>
        </>
    );
}