import React, {useState, useEffect, useMemo, useContext} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import './Panel.scss';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Slider from "@mui/material/Slider";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import TuneIcon from '@mui/icons-material/Tune';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, {
    toggleButtonGroupClasses,
} from '@mui/material/ToggleButtonGroup';
import {styled} from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import {AppContext} from "../../AppContext";

const Panel = ({ data, setData }) => {

    const navigate = useNavigate();
    const {setUrlParams} = useContext(AppContext);

    const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
        [`& .${toggleButtonGroupClasses.grouped}`]: {
          margin: theme.spacing(0.5),
          border: 0,
          borderRadius: theme.shape.borderRadius,
          [`&.${toggleButtonGroupClasses.disabled}`]: {
            border: 0,
          },
        },
        [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
          {
            marginLeft: -1,
            borderLeft: '1px solid transparent',
          },
    }));

    const [searchParams] = useSearchParams();

    const urlSearchWord = searchParams.get('searchWord') || '';
    const urlBrands = useMemo(() => searchParams.get('brand')?.split(',') || [], [searchParams]);
    const urlSupermarkets = useMemo(() => searchParams.get('supermarket')?.split(',') || [], [searchParams]);
    const urlMinPrice = parseFloat(searchParams.get('minPrice')) || 0;
    const urlMaxPrice = parseFloat(searchParams.get('maxPrice')) || 100;
    const urlMinPriceUnit = parseFloat(searchParams.get('minPriceUnit')) || 0;
    const urlMaxPriceUnit = parseFloat(searchParams.get('maxPriceUnit')) || 100;
    const urlSortBy = parseInt(searchParams.get('sortBy')) || 0;

    const [searchWord, setSearchWord] = useState(urlSearchWord || '');
    const [supermarkets, setSupermarkets] = useState(urlSupermarkets || []);
    const [brands, setBrands] = useState(urlBrands || []);
    const [minPrice, setMinPrice] = useState(urlMinPrice || 0);
    const [maxPrice, setMaxPrice] = useState(urlMaxPrice || 100);
    const [minPriceUnit, setMinPriceUnit] = useState(urlMinPriceUnit || 0);
    const [maxPriceUnit, setMaxPriceUnit] = useState(urlMaxPriceUnit || 100);
    const [sortBy, setSortBy] = useState(urlSortBy || 0);

    useEffect(() => {
        const fetchData = async () => {
            const sortData = (data, option) => {
                let sortedData;
                const results = [...(data?.results || [])];
                
                switch (option) {
                    case 0:
                        sortedData = results.sort((a, b) => (a.price || 0) - (b.price || 0));
                        break;
                    case 10:
                        sortedData = results.sort((a, b) => {
                            const aValue = a['price / unit (num)'] || Number.MAX_VALUE;
                            const bValue = b['price / unit (num)'] || Number.MAX_VALUE;
                            return aValue - bValue;
                        });
                        break;
                    case 20:
                        sortedData = results.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                        break;
                    default:
                        sortedData = results;
                }
            
                setData({ ...data, results: sortedData });
            }

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
                sortData(result, urlSortBy);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        setUrlParams({
            urlSearchWord: urlSearchWord,
            urlBrands: urlBrands,
            urlSupermarkets: urlSupermarkets,
            urlMinPrice: urlMinPrice,
            urlMaxPrice: urlMaxPrice,
            urlMinPriceUnit: urlMinPriceUnit,
            urlMaxPriceUnit: urlMaxPriceUnit,
            urlSortBy: urlSortBy,
        });
    }, [urlSearchWord, urlBrands, urlSupermarkets, urlMinPrice, urlMaxPrice, urlMinPriceUnit, urlMaxPriceUnit, urlSortBy, setData, setUrlParams]);

    const handleSearch = (updatedSupermarkets, updatedBrands, updatedSortBy) => {
        const finalSupermarkets = updatedSupermarkets ?? supermarkets;
        const finalBrands = updatedBrands ?? brands;
        const finalSortBy = updatedSortBy ?? sortBy;

        setSupermarkets(finalSupermarkets);
        setBrands(finalBrands);
        setSortBy(finalSortBy);
        
        const params = new URLSearchParams();
    
        if (finalBrands.length > 0) params.append('brand', finalBrands.join(','));
        if (finalSupermarkets.length > 0) params.append('supermarket', finalSupermarkets.join(','));
        params.append('searchWord', searchWord);
        params.append('minPrice', minPrice);
        params.append('maxPrice', maxPrice);
        params.append('minPriceUnit', minPriceUnit);
        params.append('maxPriceUnit', maxPriceUnit);
        params.append('sortBy', finalSortBy);

        navigate(`/products?${params.toString()}`);
    };

    const handleChangePrice = (event, newValue) => {
        const [newMinPrice, newMaxPrice] = newValue;
        setMinPrice(newMinPrice);
        setMaxPrice(newMaxPrice);
    };
    const handleChangePriceUnit = (event, newValue) => {
        const [newMinPriceUnit, newMaxPriceUnit] = newValue;
        setMinPriceUnit(newMinPriceUnit);
        setMaxPriceUnit(newMaxPriceUnit);
    };

    const handleResetPrice = () => {
        setMinPrice(0);
        setMaxPrice(100);
    };
    const handleResetPriceUnit = () => {
        setMinPriceUnit(0);
        setMaxPriceUnit(100);
    }

    return (
        <div className="panel">
            <div className="top">
                <div className="search">
                    <input type="text" value={searchWord} placeholder="Please enter the category or product" 
                    onChange={(e) => setSearchWord(e.target.value)} />
                    <Button sx={{ textTransform: 'none', boxShadow: 'none' }} variant="contained"
                    onClick={() => handleSearch(supermarkets, brands, sortBy)}>Search</Button>
                </div>
                <div className="row">
                    <div className="left">
                        <h1>Supermarket</h1>
                    </div>
                    <StyledToggleButtonGroup
                        size="small"
                        value={supermarkets}
                        onChange={(event, newValue) => {
                            handleSearch(newValue, brands, sortBy);
                        }}
                        className="right supermarket"
                    >
                        <ToggleButton value="Aldi" sx={{ textTransform: 'none', boxShadow: 'none' }} className="button">Aldi</ToggleButton>
                        <ToggleButton value="Auchan" sx={{ textTransform: 'none', boxShadow: 'none' }} className="button">Auchan</ToggleButton>
                        <ToggleButton value="Lidl" sx={{ textTransform: 'none', boxShadow: 'none' }} className="button">Lidl</ToggleButton>
                        <ToggleButton value="Franprix" sx={{ textTransform: 'none', boxShadow: 'none' }} className="button">Franprix</ToggleButton>
                        <ToggleButton value="Monoprix" sx={{ textTransform: 'none', boxShadow: 'none' }} className="button">Monoprix</ToggleButton>
                        <ToggleButton value="Carrefour" sx={{ textTransform: 'none', boxShadow: 'none' }} className="button">Carrefour</ToggleButton>
                        <ToggleButton value="Intermarché" sx={{ textTransform: 'none', boxShadow: 'none' }} className="button">Intermarché</ToggleButton>
                    </StyledToggleButtonGroup>
                </div>
                <div className="row">
                    <div className="left">
                        <h1>Brand</h1>
                    </div>
                    <StyledToggleButtonGroup
                        size="small"
                        value={brands}
                        onChange={(event, newValue) => {
                            handleSearch(supermarkets, newValue, sortBy);
                        }}
                        className="right brand"
                    >
                        <ToggleButton value="brand1" sx={{ textTransform: 'none', boxShadow: 'none' }} className="button">Brand 1</ToggleButton>
                        <ToggleButton value="brand2" sx={{ textTransform: 'none', boxShadow: 'none' }} className="button">Brand 2</ToggleButton>
                        <ToggleButton value="brand3" sx={{ textTransform: 'none', boxShadow: 'none' }} className="button">Brand 3</ToggleButton>
                        <ToggleButton value="brand4" sx={{ textTransform: 'none', boxShadow: 'none' }} className="button">Brand 4</ToggleButton>
                        <ToggleButton value="brand5" sx={{ textTransform: 'none', boxShadow: 'none' }} className="button">Brand 5</ToggleButton>
                        <ToggleButton value="brand6" sx={{ textTransform: 'none', boxShadow: 'none' }} className="button">Brand 6</ToggleButton>
                        <ToggleButton value="brand7" sx={{ textTransform: 'none', boxShadow: 'none' }} className="button">Brand 7</ToggleButton>
                        <ToggleButton value="brand8" sx={{ textTransform: 'none', boxShadow: 'none' }} className="button">Brand 8</ToggleButton>
                    </StyledToggleButtonGroup>
                    <KeyboardArrowDownIcon className="arrowDown" fontSize="large" />
                </div>
                <div className="row row-l">
                    <div className="col-left">
                        <div className="col left">
                            <h1>Price</h1>
                        </div>
                        <Slider
                            value={[minPrice, maxPrice]}
                            onChange={handleChangePrice}
                            valueLabelDisplay="auto"
                            className="col slider"
                        />
                        <div className="col forms">
                            <FormControl variant="outlined" className="form">
                                <OutlinedInput
                                    id="outlined-adornment-price"
                                    endAdornment={<InputAdornment position="end">€</InputAdornment>}
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                            </FormControl>
                            <hr />
                            <FormControl variant="outlined" className="form">
                                <OutlinedInput
                                    id="outlined-adornment-price"
                                    endAdornment={<InputAdornment position="end">€</InputAdornment>}
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </FormControl>
                        </div>
                        <div className="col buttons">
                            <Button sx={{ textTransform: 'none', boxShadow: 'none' }} variant="contained" onClick={handleResetPrice}>Reset</Button>
                            <Button sx={{ textTransform: 'none', boxShadow: 'none' }} variant="contained" onClick={() => handleSearch(supermarkets, brands, sortBy)}>Go</Button>
                        </div>
                    </div>
                    <div className="col-right">
                        <div className="col left">
                            <h1>Price / Unit</h1>
                        </div>
                        <Slider
                            value={[minPriceUnit, maxPriceUnit]}
                            onChange={handleChangePriceUnit}
                            valueLabelDisplay="auto"
                            className="col slider"
                        />
                        <div className="col forms">
                            <FormControl variant="outlined" className="form">
                                <OutlinedInput
                                    id="outlined-adornment-price"
                                    endAdornment={<InputAdornment position="end">€</InputAdornment>}
                                    value={minPriceUnit}
                                    onChange={(e) => setMinPriceUnit(e.target.value)}
                                />
                            </FormControl>
                            <hr />
                            <FormControl variant="outlined" className="form">
                                <OutlinedInput
                                    id="outlined-adornment-price"
                                    endAdornment={<InputAdornment position="end">€</InputAdornment>}
                                    value={maxPriceUnit}
                                    onChange={(e) => setMaxPriceUnit(e.target.value)}
                                />
                            </FormControl>
                            <div className="col buttons">
                                <Button sx={{ textTransform: 'none', boxShadow: 'none' }} variant="contained" onClick={handleResetPriceUnit}>Reset</Button>
                                <Button sx={{ textTransform: 'none', boxShadow: 'none' }} variant="contained" onClick={() => handleSearch(supermarkets, brands, sortBy)}>Go</Button>
                            </div>
                        </div>
                    </div>
                    <div className="col-more">
                        <span>More</span>
                        <TuneIcon />
                    </div>
                </div>
            </div>
            <div className="bottom">
                <div className="left">
                    <span>found { data?.count ?? 0 } results in XXXXXX seconds</span>
                </div>
                <div className="right">
                    <div className="info">
                        <span>Sorted by</span>
                    </div>
                    <div className="select">
                        <FormControl>
                            <Select
                            value={sortBy}
                            onChange={(e) => {
                                const newValue = e.target.value
                                handleSearch(supermarkets, brands, newValue);
                            }}
                            displayEmpty
                            className="box"
                            >
                                <MenuItem value={0}>Price</MenuItem>
                                <MenuItem value={10}>Price / Unit</MenuItem>
                                <MenuItem value={20}>Alphabet</MenuItem>
                            </Select>
                        </FormControl>
                        <UnfoldMoreIcon className="unfoldMore" fontSize="large" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Panel
