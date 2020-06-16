import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {API_URL, API_KEY, IMAGE_BASE_URL} from '../../../Config';

import MainImage from '../commons/MainImage';
import GridCards from '../commons/GridCards';

import {Row} from 'antd';




function LandingPage() {

    const [Movies, setMovies] = useState([]);
    const [MainMovie, setMainMovie] = useState([]);

    const [CurrentPage, setCurrentPage] = useState(0);

    const fetchMovies = (endpoint) => {

        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setMovies(Movies.concat(data.results))
                setMainMovie(data.results[0])
                setCurrentPage(data.page)
            })

    }

    useEffect(() => {
        
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

        fetchMovies(endpoint)

    }, [])  
    
    const loadMoreItems = () => {

        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;

        fetchMovies(endpoint);

    }

    // const fetchToMovePages = (endpoint) => {

    //     fetch(endpoint)
    //         .then(res => res.json())
    //         .then(data => {
    //             setMovies(data.results)
    //             setCurrentPage(data.page)
    //         })
    // }

    // const moveToPrev = () => {

    //     const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage - 1}`;

    //     fetchToMovePages(endpoint)
    // }

    // const moveToNext = () => {

    //     const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;

    //     fetchToMovePages(endpoint)
    // }

    return (
        <div style={{border: '1px solid black', width: '100%', margin: '0'}}>

            {/* Main Image Component */}
            {MainMovie &&
            
                <MainImage 
                    image={`${IMAGE_BASE_URL}w1280${MainMovie.backdrop_path}`}
                    title={MainMovie.title}
                    description={MainMovie.overview}
                />
            }

            <div style={{border: '1px solid blue', width: '85%', margin: '1rem auto'}}>
                
                <h2>Movies by latest</h2>
                <hr />

                {/* Movie Grid Cards */}
                <Row gutter={[16, 16]}>

                    {Movies && Movies.map((movie, index) => (
                        <GridCards 
                            key={movie.id}
                            image={movie.poster_path ? 
                                `${IMAGE_BASE_URL}w500${movie.poster_path}` : null}
                            movieId={movie.id}
                            movieName={movie.title}
                        />
                    ))}

                </Row>

            </div>

            <div style={{border: '1px solid green', display: 'flex', justifyContent: 'center'}}>
                <button onClick={loadMoreItems}>Load More</button>
                {/* <button onClick={moveToPrev} style={{marginRight:'15px'}}>Prev</button>
                <button onClick={moveToNext}>Next</button> */}
            </div>
            
        </div>
    )
}

export default LandingPage
