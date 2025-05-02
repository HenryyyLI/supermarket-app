import React, {useState, useEffect, useMemo} from 'react';
import {useSearchParams} from "react-router-dom";
import Plot from 'react-plotly.js';
import './DataArea.scss';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const DataArea = ({ data, setData }) => {

    const gaussianKDE = (data, xValues, bandwidth = 1) => {
        const kernel = (x, xi) => Math.exp(-0.5 * ((x - xi) / bandwidth) ** 2) / (Math.sqrt(2 * Math.PI) * bandwidth);
    
        return xValues.map(x =>
            data.reduce((sum, xi) => sum + kernel(x, xi), 0) / data.length
        );
    };

    const productSummary = useMemo(() => {
        if (!data || !data.results || data.results.length === 0) return { counts: [], averages: [], priceUnits: [] };

        const groupedData = data.results.reduce((acc, item) => {
            if (!item.supermarket) return acc;

            if (!acc[item.supermarket]) {
                acc[item.supermarket] = { totalPrice: 0, count: 0, priceUnits: [] };
            }
            acc[item.supermarket].totalPrice += item.price || 0;
            acc[item.supermarket].count += 1;
            acc[item.supermarket].priceUnits.push(item['price / unit (num)'] || 0);
            return acc;
        }, {});

        const counts = Object.entries(groupedData).map(([supermarket, values]) => ({
            supermarket,
            count: values.count,
        }));

        const averages = Object.entries(groupedData).map(([supermarket, values]) => ({
            supermarket,
            avgPrice: values.totalPrice / values.count,
        }));

        const priceUnits = Object.entries(groupedData).map(([supermarket, values]) => ({
            supermarket,
            priceUnits: values.priceUnits,
        }));

        return { counts, averages, priceUnits };
    }, [data]);

    const [groupBy, setGroupBy] = useState(0);
    const [sortAccording, setSortAccording] = useState(0);

    const [searchParams] = useSearchParams();

    const urlSearchWord = searchParams.get('searchWord') || '';
    const urlBrands = useMemo(() => searchParams.get('brand')?.split(',') || [], [searchParams]);
    const urlSupermarkets = useMemo(() => searchParams.get('supermarket')?.split(',') || [], [searchParams]);
    const urlMinPrice = parseFloat(searchParams.get('minPrice')) || 0;
    const urlMaxPrice = parseFloat(searchParams.get('maxPrice')) || 100;
    const urlMinPriceUnit = parseFloat(searchParams.get('minPriceUnit')) || 0;
    const urlMaxPriceUnit = parseFloat(searchParams.get('maxPriceUnit')) || 100;

    const priceData = data?.results?.map((item) => item.price) || [];

    const generateKDEData = (sourceData) => {
        const xValues = Array.from({ length: 100 }, (_, i) => Math.min(...sourceData) + i * (Math.max(...sourceData) - Math.min(...sourceData)) / 199);
        const yValues = gaussianKDE(sourceData, xValues, 0.5);
        return { xValues, yValues };
    };

    const priceKDEData = useMemo(() => {
        return productSummary.averages.map(item => {
            const { xValues, yValues } = generateKDEData(data.results.filter(d => d.supermarket === item.supermarket).map(d => d.price));
            return { x: xValues, y: yValues, name: item.supermarket };
        });
    }, [productSummary]);

    const priceUnitKDEData = useMemo(() => {
        return productSummary.priceUnits.map(item => {
            const { xValues, yValues } = generateKDEData(item.priceUnits);
            return { x: xValues, y: yValues, name: item.supermarket };
        });
    }, [productSummary]);

    const top5Brands = useMemo(() => {
        if (!data || !data.results || data.results.length === 0) return [];

        const brandCounts = data.results.reduce((acc, item) => {
            if (!item.brand) return acc;
            acc[item.brand] = (acc[item.brand] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(brandCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([brand, count]) => ({ brand, count }));
    }, [data]);

    const top5Products = useMemo(() => {
        if (!data || !data.results || data.results.length === 0) return [];

        return [...data.results]
            .sort((a, b) => {
                if (sortAccording === 0) return b.price - a.price;
                if (sortAccording === 10) return b['price / unit (num)'] - a['price / unit (num)']; // 按单位价格排序
                return 0;
            })
            .slice(0, 5);
    }, [data, sortAccording]);

    useEffect(() => {
        const fetchData = async () => {
            setData(null);
            try {
                const params = new URLSearchParams();
                urlBrands.forEach(brand => params.append('brand', brand));
                urlSupermarkets.forEach(supermarket => params.append('supermarket', supermarket));
                params.append('minPrice', urlMinPrice);
                params.append('maxPrice', urlMaxPrice);
                params.append('minPriceUnit', urlMinPriceUnit);
                params.append('maxPriceUnit', urlMaxPriceUnit);

                const response = await fetch(`http://127.0.0.1:5000/${urlSearchWord}?${params.toString()}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();

                setData(result);
                console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [urlSearchWord, urlBrands, urlSupermarkets, urlMinPrice, urlMaxPrice, urlMinPriceUnit, urlMaxPriceUnit, setData]);

    return (
        <div className="data-area">
            <div className="top">
                <h1 className="title">OVERALL Information</h1>
                <div className="plot-area">
                    <div className="left plot">
                        <div className="title-bar">
                            <div className="bar"></div>
                            <div className="plot-title">Ovaeall Price Distribution</div>
                        </div>
                        <Plot
                            data={[
                                {
                                    x: generateKDEData(priceData).xValues,
                                    y: generateKDEData(priceData).yValues,
                                    type: 'scatter',
                                    mode: 'lines',
                                    line: { shape: 'spline', color: 'red' },
                                },
                            ]}
                            layout={{
                                title: 'KDE Plot for Prices',
                                xaxis: { title: 'Price (€)' },
                                yaxis: { title: 'Density' },
                                height: 400,
                                width: 700,
                            }}
                            className="graph"
                        />
                    </div>
                    <div className="right plot">
                        <div className="title-bar">
                            <div className="bar"></div>
                            <div className="plot-title">Product Number / Average Price by Supermarket</div>
                        </div>
                        <Plot
                            data={[
                                {
                                    x: productSummary.counts.map(item => item.supermarket),
                                    y: productSummary.counts.map(item => item.count),
                                    type: 'bar',
                                    name: 'Product Count',
                                    marker: { color: 'blue' },
                                },
                                {
                                    x: productSummary.averages.map(item => item.supermarket),
                                    y: productSummary.averages.map(item => item.avgPrice),
                                    type: 'bar',
                                    name: 'Average Price (€)',
                                    marker: { color: 'orange' },
                                },
                            ]}
                            layout={{
                                title: 'Bar Plot for Product Numbers and Average Prices',
                                barmode: 'group',
                                xaxis: { title: 'Supermarket' },
                                yaxis: { title: 'Value' },
                                height: 400,
                                width: 700,
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="middle">
                <div className="title-area">
                    <h1 className="title">Supermarket / Brand Information</h1>
                    <div className="select">
                        <div className="select-title">Group by</div>
                        <FormControl>
                            <Select
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value)}
                            displayEmpty
                            className="box"
                            >
                                <MenuItem value={0}>Supermarket</MenuItem>
                                <MenuItem value={10}>Brand</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div className="plot-area">
                    <div className="left plot">
                        <div className="title-bar">
                            <div className="bar"></div>
                            <div className="plot-title">Product Number</div>
                        </div>
                        <Plot
                            data={[
                                {
                                    type: 'pie',
                                    labels: productSummary.counts.map(item => item.supermarket),
                                    values: productSummary.counts.map(item => item.count),
                                },
                            ]}
                            layout={{ title: {
                                text: 'Pie Chart by Supermarkets',
                                x: 0.55,
                            }, height: 400, width: 400 }}
                            className="graph"
                        />
                    </div>
                    <div className="center plot">
                        <div className="title-bar">
                            <div className="bar"></div>
                            <div className="plot-title">Price</div>
                        </div>
                        <Plot
                            data={priceKDEData.map(plot => ({
                                x: plot.x,
                                y: plot.y,
                                type: 'scatter',
                                mode: 'lines',
                                name: plot.name,
                            }))}
                            layout={{
                                title: 'KDE Plot by Supermarkets',
                                xaxis: { title: 'Price (€)' },
                                yaxis: { title: 'Density' },
                                height: 400,
                                width: 500,
                            }}
                            className="graph"
                        />
                    </div>
                    <div className="right plot">
                        <div className="title-bar">
                            <div className="bar"></div>
                            <div className="plot-title">Price / Unit</div>
                        </div>
                        <Plot
                            data={priceUnitKDEData.map(plot => ({
                                x: plot.x,
                                y: plot.y,
                                type: 'scatter',
                                mode: 'lines',
                                name: plot.name,
                            }))}
                            layout={{
                                title: 'KDE Plot by Supermarkets',
                                xaxis: { title: 'Price / Unit (€)' },
                                yaxis: { title: 'Density' },
                                height: 400,
                                width: 500,
                            }}
                            className="graph"
                        />
                    </div>
                </div>
            </div>
            <div className="bottom">
                <h1 className="title">TOP 5 Information</h1>
                <div className="plot-area">
                    <div className="left plot">
                        <div className="title-bar">
                            <div className="bar"></div>
                            <div className="plot-title">TOP 5 Brand</div>
                        </div>
                        <Plot
                            data={[
                                {
                                    labels: top5Brands.map(item => item.brand),
                                    values: top5Brands.map(item => item.count),
                                    type: 'pie',
                                },
                            ]}
                            layout={{
                                title: 'Pie Chart for Top 5 Brands',
                                autosize: true,
                                height: 400,
                                width: 400,
                            }}
                            className="graph"
                        />
                    </div>
                    <div className="right plot">
                        <div className="title-group">
                            <div className="title-bar-bottom-right title-left">
                                <div className="bar"></div>
                                <div className="plot-title">TOP 5 Products</div>
                            </div>
                            <div className="select-bottom-right title-right">
                                <div className="select-title">Sort according</div>
                                <FormControl>
                                    <Select
                                    value={sortAccording}
                                    onChange={(e) => setSortAccording(e.target.value)}
                                    displayEmpty
                                    className="box"
                                    >
                                        <MenuItem value={0}>Price</MenuItem>
                                        <MenuItem value={10}>Price / Unit</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <TableContainer component={Paper} sx={{
                            margin: '0 auto',
                            width: 900, 
                            height: 350, 
                            overflow: 'auto'
                        }} className="table">
                            <Table sx={{ tableLayout: 'fixed' }} aria-label="Top 5 Products Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: '5%', fontWeight: 'bold' }}></TableCell>
                                        <TableCell sx={{ width: '20%', fontWeight: 'bold' }}>Name</TableCell>
                                        <TableCell sx={{ width: '15%', fontWeight: 'bold' }}>Price (€)</TableCell>
                                        <TableCell sx={{ width: '15%', fontWeight: 'bold' }}>Price / Unit (€)</TableCell>
                                        <TableCell sx={{ width: '45%', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {top5Products.map((product, index) => (
                                        <TableRow
                                            key={product.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{product.name || 'N/A'}</TableCell>
                                            <TableCell align="right">{product.price?.toFixed(2) || 'N/A'}</TableCell>
                                            <TableCell align="right">{product['price / unit (num)']?.toFixed(2) || 'N/A'}</TableCell>
                                            <TableCell>{product.description || 'N/A'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DataArea
