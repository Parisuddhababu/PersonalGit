import { gql } from "@apollo/client";
import client from "../../apollo-client";
import { GET_POST_DETAILS } from "../../query/post/Post";


const getPost= async (id:any)=>{
    const data  = await client.query({
        query: gql`${GET_POST_DETAILS}`,
        variables:{
           "id": id
        }
      });
      return {
        props: data
     };
}

export default getPost;