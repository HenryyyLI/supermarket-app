import React, {useState} from 'react';
import './Home.scss';
import Button from '@mui/material/Button';
import {useNavigate} from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();
    const [searchWord, setSearchWord] = useState('');

    return (
        <div className="home">
            <div className="content">
                <div className="logo">
                    <img src="/img/logo.svg" alt="" />
                </div>
                <div className="title">
                    <h1>ShopSphere</h1>
                    <p>ShopSphere is your ultimate destination for all supermarket product information. We bring the aisles of your favorite stores to your fingertips, offering detailed insights, reviews, and up-to-date product availability. Whether you're planning your next grocery run or exploring new items, ShopSphere makes it easier for you to make informed choices with just a few clicks. Explore, compare, and shop smarter—welcome to the future of shopping!</p>
                </div>
            </div>
            <div className="search">
                <input type="text" placeholder="Please enter the category or product" 
                onChange={(e) => setSearchWord(e.target.value)} />
                <Button sx={{ textTransform: 'none', boxShadow: 'none' }} variant="contained"
                onClick={() => {
                    navigate(`/products?searchWord=${searchWord}`);
                }}>Search</Button>
            </div>
        </div>
    )
}

export default Home
