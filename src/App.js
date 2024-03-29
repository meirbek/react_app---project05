import React, {useEffect, useMemo, useState} from 'react';
import ClassCounter from './components/ClassCounter';
import Counter from "./components/Counter";
import PostItem from './components/PostItem';
import PostList from './components/PostList';
import './styles/App.css';
import MyButton from './components/UI/button/MyButton';
import MyInput from './components/UI/input/MyInput';
import PostForm from './components/PostForm';
import MySelect from "./components/UI/select/MySelect";
import PostFilter from "./components/PostFilter";
import MyModal from "./components/UI/modal/MyModal";
import {usePosts} from "./components/hooks/usePost";
import axios from "axios";
import PostService from "./API/PostService";
import Loader from "./components/UI/loader/Loader";
import {useFetching} from "./components/hooks/useFetching";

function App() { 
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({sort:'', query: ''});
  const [modal, setModal] = useState(false);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
  const [fetchPosts,isPostsLoading, postError] = useFetching(async () => {
      const posts = await PostService.getAll();
      setPosts(posts);
  });

  useEffect(() => {
      fetchPosts();
  },[]);

  const createPost = (newPost) => {
    setPosts([...posts,newPost])
    setModal(false)
  }



  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id))
  }


  return (
    <div className="App">
        <MyButton onClick={fetchPosts}>GET POSTS</MyButton>
      <MyButton style={{marginTop:'25px'}} onClick={() => setModal(true)}>
          Создать пост
      </MyButton>
      <MyModal
        visible={modal}
        setVisible={setModal}
      >
          <PostForm create={createPost}/>

      </MyModal>
      <hr style={{margin:'15px 0'}}/>
      <PostFilter
          filter={filter}
          setFilter={setFilter}
      />
        {postError &&
            <h1>Произошла ошибка</h1>
        }
        {isPostsLoading
            ? <div style={{display:'flex', justifyContent:'center', marginTop:'50px'}}> <Loader/></div>
            : <PostList remove={removePost} posts={sortedAndSearchedPosts} title="Список постов JS"/>

        }

    </div>
    
  );
}

export default App;
