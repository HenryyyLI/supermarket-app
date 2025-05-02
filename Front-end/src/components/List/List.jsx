import React from 'react';
import './List.scss';
import Card from '../../components/Card/Card';

const List = ({ data, setData }) => {

    const results = data?.results ?? [];

    return (
        <div className="list">{results?.map(item => (
            <Card item={item} key={item.id} />
        ))}</div>
    )
}

export default List
