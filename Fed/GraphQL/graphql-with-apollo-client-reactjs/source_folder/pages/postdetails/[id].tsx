import PostDetailsList from "../../components/PostDetailsList";
import getPost from "../api/oprations/post/getPost";

export async function getServerSideProps(context: any) {
  const cid = context.query;
  const sid = JSON.stringify(cid.id);
  const did = JSON.parse(sid);
  const posts = await getPost(did);
  return {
    props: {
      posts,
    },
  };
}

function PostDetails(props: any) {
  return (
    <>
      <PostDetailsList {...props} />
    </>
  );
}

export default PostDetails;
