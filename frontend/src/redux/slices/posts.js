import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../axios";

export const
  fetchPosts = createAsyncThunk('posts/fetchPosts', async ({tab, tag}) => {
    let url = tab !== 1 ? '/posts' : '/popular'
    if (tag) url = `/tags/${tag}`
    const {data} = await axios.get(url)
    return data
  })

export const
  fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const {data} = await axios.get('/tags')
    return data
  })

export const
  fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => await axios.delete(`/posts/${id}`)
  )

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  }
}

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPosts.pending]: (state) => {
      state.posts.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload
      state.posts.status = 'loaded';
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = []
      state.posts.status = 'error';
    },

    [fetchTags.pending]: (state) => {
      state.tags.status = 'loading';
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload
      state.tags.status = 'loaded';
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = []
      state.tags.status = 'error';
    },

    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(p => p._id !== action.meta.arg);
    },
  }
})

export const postReducer = postSlice.reducer
