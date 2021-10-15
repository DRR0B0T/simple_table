import React, {useEffect, useRef} from 'react'
import '../styles/App.css'
import {useFetching} from "../hooks/useFetching";
import {usePosts} from "../hooks/usePosts";
import {getPagesCount} from "../utils/pages";
import MyButton from "../components/UI/button/MyButton";
import MyModal from "../components/UI/Modal/MyModal";
import PostFilter from "../components/PostFilter";
import PostList from "../components/PostList";
import Pagination from "../components/UI/pagination/Pagination";
import PostForm from "../components/PostForm";
import PostService from "../API/PostService";
import Loader from "../components/UI/Loader/Loader";
import {useObserver} from "../hooks/useObserver";
import MySelect from "../components/UI/select/MySelect";


function Posts() {
  const [posts, setPosts] = React.useState([]);
  const [filter, setFilter] = React.useState({sort: '', query: ''});
  const [modal, setModal] = React.useState(false);
  const [totalPages, setTotalPages] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
  const lastElement = useRef()

  const [fetchPosts, isPostsLoading, postError] = useFetching(async (limit, page) => {
    const response = await PostService.getAll(limit, page)
    setPosts([...posts, ...response.data])
    const totalCount = response.headers['x-total-count']
    setTotalPages(getPagesCount(totalCount, limit))
  })

  useObserver(lastElement, page < totalPages, isPostsLoading, () => {
    setPage(page + 1)
  })

  React.useEffect(() => {
    fetchPosts(limit, page)
  }, [page, limit])


  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    setModal(false)
  }

  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id))
  }

  const changePage = (page) => {
    setPage(page)
    fetchPosts(limit, page)
  }

  return (
    <div className='App'>
      <MyButton
        style={{marginTop: 30}}
        onClick={() => setModal(true)}
      >
        Создать пользователя
      </MyButton>
      <MyModal
        visible={modal}
        setVisible={setModal}
      >
        <PostForm
          create={createPost}
        />
      </MyModal>
      <hr style={{margin: '15px 0'}}/>
      <PostFilter
        filter={filter}
        setFilter={setFilter}
      />
      <MySelect
        value={limit}
        onChange={value=> setLimit(value)}
        defaultValue='Количество элементов на странице'
        options={[
          {value: 5, name: '5'},
          {value: 10, name: '10'},
          {value: 25, name: '25'},
          {value: -1, name: 'Показать всё'},
        ]}
      />
      {
        postError &&
        <h1>Произошла ошибка ${postError}</h1>
      }
      <PostList
        remove={removePost}
        posts={sortedAndSearchedPosts}
        title='Список постов'/>
        <div ref={lastElement} />
      {
        isPostsLoading &&
           <div style={{display: 'flex', justifyContent: 'center', marginTop: 150}}><Loader/></div>
      }

      <Pagination
        page={page}
        changePage={changePage}
        totalPages={totalPages}/>
    </div>
  );
}

export default Posts;
