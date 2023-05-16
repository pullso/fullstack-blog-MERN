import React, {useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate} from "react-router-dom";
import axios from "../../axios";

export const AddPost = () => {
  const isAuth = useSelector(selectIsAuth)
  const [text, setText] = React.useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const inputFileRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate()

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData()
      formData.append('image', event.target.files[0])
      const {data} = await axios.post('/upload', formData)
      setImageUrl(data.url)
    } catch (e) {
      console.warn(e)
      alert('error in file upload process')
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('')
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      const fields = {
        title,
        imageUrl,
        tags: tags.split(','),
        text
      }

      const {data} = await axios.post('/posts', fields)
      const id = data?._id
      navigate(`/posts/${id}`)
    } catch (e) {
      console.warn(e)
      alert('error in upload post')
    }
  }

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Write text...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/"/>
  }

  return (
    <Paper style={{padding: 30}}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Upload preview
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden/>
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Remove
          </Button>
          <img className={styles.image} src={`http://localhost:4444/${imageUrl}`} alt="Uploaded"/>
        </>
      )}
      <br/>
      <br/>
      <TextField
        classes={{root: styles.title}}
        variant="standard"
        placeholder="Header of arcticle..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}/>
      <TextField
        classes={{root: styles.tags}} variant="standard" placeholder="Tags" fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options}/>
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          Publish
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
