import Link from "next/link";
import { useEffect, useState } from "react";
import getAllPost from "../pages/api/oprations/post/getAllPost";

function Post(props:any){
    const[postData,setPostData] = useState<any>([]);
    const [activeStep] = useState(0);
    const [page, setPage] = useState(0);    
    const [isFetching, setIsFetching] = useState(false);
    useEffect(()=>{
        setPostData(props.posts.props.data.posts.data);
        setPage(perPage=> perPage + 1);
    },[]);
       
    useEffect(() => {
        if (!isFetching) return;
        showMore();
      }, [isFetching]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);
      async function handleScroll() {
      
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        setIsFetching(true);
      }
    
    async function showMore(){
        setPage(perPage=> perPage + 1);
        const posts = await getAllPost(page,activeStep); 
        setPostData(postData.concat(posts.props.data.posts.data));
        setIsFetching(false);
        // posts.concat(res.data.hits)
    }
    return(
    <>
    <div className='post-content'>  
    <div className='post-title'>POST LIST</div> 
     {
        postData?.map((post:any)=>{
            return(
                <div key={post?.id} className='post-list'>
                    {post.id}. {post.title}
                    <div className="read-more-link"><span><Link href={`/postdetails/${post.id}`}><a>Read More...</a></Link></span></div>
                </div>
            );
        })
    }
    {/* <button className='show-more' onClick={showMore}>Show More</button> */}
    </div>
    {isFetching && 
            <div className="loader">
                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
    }
    </>);

}
export default Post