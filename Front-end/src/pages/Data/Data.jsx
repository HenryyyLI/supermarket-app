import React, {useState} from 'react';
import './Data.scss';
import Navbar from '../../components/Navbar/Navbar';
import DataArea from '../../components/DataArea/DataArea';

const Data = () => {

    const [data, setData] = useState(null);

    return (
        <div className="data">
            <Navbar />
            <DataArea data={data} setData={setData} />
        </div>
    )
}

export default Data
