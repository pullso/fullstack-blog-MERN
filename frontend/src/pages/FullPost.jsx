import React, {useEffect, useState} from "react";
import {Post} from "../components/Post";
import {Index} from "../components/AddComment";
import {CommentsBlock} from "../components/CommentsBlock";
import {useParams} from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import styles from "./AddPost/AddPost.module.scss";
import {getImage} from "../utils/getImage";

export const FullPost = () => {
  const [post, setPost] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const {id} = useParams()

  useEffect(() => {
    axios.get(`/posts/${id}`)
      .then(({data}) => {
        setPost(data)
      })
      .catch((e) => {
        console.warn('error of loading an article ', e)
      }).finally(() => {
      setIsLoading(false)
    })
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading}/>
  }


  return (
    <>
      <Post
        key={post._id}
        _id={post._id}
        title={post.title}
        imageUrl={getImage(post.imageUrl)}
        user={post.user}
        createdAt={new Date(post.createdAt).toLocaleString()}
        viewsCount={post.viewsCount}
        commentsCount={post.commentsCount}
        tags={post.tags}
        isFullPost
      >
        <ReactMarkdown children={post.text}/>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index/>
      </CommentsBlock>
    </>
  );
};
