import React, {useState} from 'react';
import './Products.scss';
import Navbar from '../../components/Navbar/Navbar';
import Panel from '../../components/Panel/Panel';
import List from '../../components/List/List';

const Products = () => {

    const [data, setData] = useState(null);

    return (
        <div className="products">
            <Navbar />
            <Panel data={data} setData={setData} />
            <List data={data} setData={setData} />
        </div>
    )
}

export default Products
