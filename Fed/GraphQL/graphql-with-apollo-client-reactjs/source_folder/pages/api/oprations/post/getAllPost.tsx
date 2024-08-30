import { gql } from "@apollo/client";
import client from "../../apollo-client";
import { GET_ALL_POST } from "../../query/post/Post";


const getAllPost= async (page:number,limit:number)=>{
    const data  = await client.query({
        query: gql`${GET_ALL_POST}`,
        variables:{
            "options": {
                "paginate": 
                {
                  "page": page,
                  "limit": limit
                }
            }
        }
      });
      return {
        props: data
     };
}

export default getAllPost;