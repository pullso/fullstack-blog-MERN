import React, {useEffect, useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import {Post} from '../components/Post';
import {TagsBlock} from '../components/TagsBlock';
import {CommentsBlock} from '../components/CommentsBlock';
import {fetchPosts, fetchTags} from "../redux/slices/posts";
import {useDispatch, useSelector} from "react-redux";
import {getImage} from "../utils/getImage";
import {useParams} from "react-router-dom";


export const Home = () => {
  const dispatch = useDispatch()
  const {posts, tags} = useSelector((state) => state.posts)
  const isPostsLoading = posts.status === 'loading'
  const isTagsLoading = tags.status === 'loading'
  const userData = useSelector((state) => state.auth.data)
  const [tab, setTab] = useState(0);
  const {tag} = useParams();

  useEffect(() => {
    dispatch(fetchPosts({tag, tab}))
    dispatch(fetchTags())
  }, [tag, tab]);

  const handleTabClick = async (event, newValue) => {
    await setTab(newValue);
    dispatch(fetchPosts({tab: newValue}))
  };


  return (
    <>
      {!tag &&
        <Tabs style={{marginBottom: 15}} value={tab} onChange={handleTabClick} aria-label="basic tabs example">
          <Tab label="New"/>
          <Tab label="Popular"/>
        </Tabs>
      }
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items)
            .map((post, idx) =>
              isPostsLoading ? (<Post key={idx} isLoading={true}/>) :
                (<Post
                    key={post._id}
                    _id={post._id}
                    title={post.title}
                    imageUrl={getImage(post.imageUrl)}
                    user={post.user}
                    createdAt={new Date(post.createdAt).toLocaleString()}
                    viewsCount={post.viewsCount}
                    commentsCount={post.commentsCount}
                    tags={post.tags}
                    isEditable={userData && userData._id === post.user._id}
                  />
                ))
          }
        </Grid>
        {!tag &&
          <Grid xs={4} item>
            <TagsBlock items={tags.items} isLoading={isTagsLoading}/>
            <CommentsBlock
              items={[
                {
                  user: {
                    fullName: 'Вася Пупкин',
                    avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                  },
                  text: 'Это тестовый комментарий',
                },
                {
                  user: {
                    fullName: 'Иван Иванов',
                    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                  },
                  text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                },
              ]}
              isLoading={false}
            />
          </Grid>}
      </Grid>
    </>
  );
};
