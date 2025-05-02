import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import './Product.scss';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BalanceIcon from '@mui/icons-material/Balance';

const Product = () => {
    const [data, setData] = useState(null);
    const {_id} = useParams();
    const [selectedImg, setSelectedImg] = useState(0);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams();
                if (_id) {
                    params.append("_id", _id);
                }
                const response = await fetch(`http://127.0.0.1:5000/?${params.toString()}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [_id]);
    
    const results = data?.results ?? [];
    const item = results[0];

    return (
        <div className="product">
            {item ? (
                <>
                    <div className="left">
                        <div className="images">
                            {item.image?.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt=""
                                    onClick={() => setSelectedImg(index)}
                                />
                            ))}
                        </div>
                        <div className="mainImg">
                            <img src={item.image[selectedImg]} alt="" />
                        </div>
                    </div>
                    <div className="right">
                        <h1>{item.name}</h1>
                        <span className="price">{item.price} €</span>
                        <p>{item.description}</p>
                        <div className="info">
                            <span>Specification: {item.specification_num} {item.specification_unit}</span>
                            <span>Price / Unit: {item['price / unit (num)']} {item['price / unit (unit)']}</span>
                            <span>Available Date: {item.available_start_date} — {item.available_end_date}</span>
                            <span>Promotion: {item.promotion ? 'Yes' : 'No'}{item.promotion_description ? ' | ' + item.promotion_description : ''}</span>
                        </div>
                        <button className="add">
                            <AddShoppingCartIcon />ADD TO CART
                        </button>
                        <div className="links">
                            <div className="item">
                                <FavoriteBorderIcon />ADD TO WISH LIST
                            </div>
                            <div className="item">
                                <BalanceIcon />ADD TO COMPARE
                            </div>
                        </div>
                        <hr />
                        <div className="info">
                            <span>Supermarché: {item.supermarket}</span>
                            <hr />
                            <span>URL: {item.url}</span>
                            <hr />
                            <span>Réf.: {item.id}</span>
                            <hr />
                        </div>
                    </div>
                </>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default Product


