import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';

import axios from './../redux/axios';
import instance from './../redux/axios';
export const Home = () => {
    React.useEffect(()=>{
    // instance.get('/posts')
    },[])
};
