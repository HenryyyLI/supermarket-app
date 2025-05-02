import React from 'react';
import './Card.scss';
import {Link} from 'react-router-dom';

const Card = ({item}) => {
    return (
        <Link className="link" to={`/product/${item._id}`}>
            <div className="card">
                <div className="image">
                    <img src={item.image[0]} alt="" className="img" />
                </div>
                <h2>{item.name}</h2>
                <div className="price">
                    <p>{item.price} €</p>
                </div>
                <div className="priceUnit">
                    <p>{item['price / unit (num)']} {item['price / unit (unit)']}</p>
                </div>
                <div className="supermarket">
                    <h3>{item.supermarket}</h3>
                </div>
            </div>
        </Link>
    )
}

export default Card
