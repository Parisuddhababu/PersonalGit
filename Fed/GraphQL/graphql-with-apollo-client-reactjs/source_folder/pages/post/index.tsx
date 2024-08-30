import Post from "../../components/Post";
import getAllPost from "../api/oprations/post/getAllPost";

export async function getStaticProps(activeStep:any) {
    const posts = await getAllPost(1,10); 
    return {
      props: {
        posts
      },
    }
  }
  
  function PostList(props:any){
      return(
          <>
            <Post {...props} />
          </>
      );
  }


export default PostList;