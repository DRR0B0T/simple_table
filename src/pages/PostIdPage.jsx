import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom'
import PostService from "../API/PostService";
import {useFetching} from "../hooks/useFetching";
import Loader from "../components/UI/Loader/Loader";

const PostIdPage = () => {
  const params = useParams()
  const [post, setPost] = React.useState({});
  const [comments, setComments] = React.useState([]);

  const [fetchPostById, isLoading, error] = useFetching(async (id) => {
    const response = await PostService.getById(id)
    setPost(response.data)
  })

  const [fetchComments, isComLoading, comError] = useFetching(async (id) => {
    const response = await PostService.getCommentById(id)
    setComments(response.data)
  })

  useEffect(() => {
    fetchPostById(params.id)
    fetchComments(params.id)
  }, []);
  
  return (
    <div>
      <h1>Вы открыли страницу с постом {params.id}</h1>
      {
        isLoading
        ? <Loader />
        : <div>{post.id}. {post.title}</div>
      }
      <h1>
        Комментарии
      </h1>
      {
        isComLoading
        ? <Loader/>
        : <div>
            {
              comments.map((comm)=>
              <div key={comm.id} style={{marginTop:25}}>
                <h4>{comm.email}</h4>
                <p>{comm.body}</p>
              </div>)
            }
          </div>
      }
    </div>
  );
};

export default PostIdPage;
