import React, {useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AppContext} from '../../AppContext';
import './Navbar.scss';
import Button from '@mui/material/Button';

const Navbar = () => {

    const navigate = useNavigate();
    const {urlParams} = useContext(AppContext);

    const params = new URLSearchParams();
    
    if (urlParams['urlBrands']?.length > 0) params.append('brand', urlParams['urlBrands'].join(','));
    if (urlParams['urlSupermarkets']?.length > 0) params.append('supermarket', urlParams['urlSupermarkets'].join(','));
    params.append('searchWord', urlParams['urlSearchWord']);
    params.append('minPrice', urlParams['urlMinPrice']);
    params.append('maxPrice', urlParams['urlMaxPrice']);
    params.append('minPriceUnit', urlParams['urlMinPriceUnit']);
    params.append('maxPriceUnit', urlParams['urlMaxPriceUnit']);
    params.append('sortBy', urlParams['urlSortBy']);

    return (
        <div className="navbar">
            <div className="left">
                <Link className='link' to='/'>
                    <div className="logo">
                        <img src="/img/logo.svg" alt="" />
                    </div>
                </Link>
                <div className="tags">
                    <Button sx={{ textTransform: 'none', boxShadow: 'none' }} variant="text" onClick={() => {
                        navigate(`/data?${params.toString()}`);
                    }} className="link">Data</Button>
                    <Button sx={{ textTransform: 'none', boxShadow: 'none' }} variant="text" onClick={() => {
                        navigate(`/products?${params.toString()}`);
                    }} className="link">Products</Button>
                </div>
            </div>
            <div className="right">
                <Link className='link' to='/'>
                    <div className="title">
                        <h1>ShopSphere</h1>
                        <p>Where convenience meets choice.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Navbar
