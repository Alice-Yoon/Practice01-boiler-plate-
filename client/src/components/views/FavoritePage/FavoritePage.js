import React, {useEffect, useState} from 'react';
import './favorite.css';
import axios from 'axios';
import { Popover } from 'antd';
import {IMAGE_BASE_URL} from '../../../Config';

function FavoritePage() {

    const [FavoredMovies, setFavoredMovies] = useState([]);


    const fetchFavoredMovies = () => {

        axios.post('/api/favorite/getFavoredMovie', {userFrom: localStorage.getItem('userId')})
            .then(res => {
                console.log(res.data)
                if(res.data.success) {
                    setFavoredMovies(res.data.favoredMovies)
                } else {
                    alert('영화 정보를 가져오는 데 실패했습니다.')
                }
            })

    }


    useEffect(() => {
        
        fetchFavoredMovies();
        
    }, [])

    const onClickRemove = (movieId, userFrom) => {

        const variables = {
            movieId,
            userFrom
        }

        axios.post('/api/favorite/removeFromFavorite', variables)
            .then(res => {
                console.log(res.data)
                if(res.data.success) {
                    fetchFavoredMovies();
                }else {
                    alert('리스트에서 지우는 데 실패했습니다.')
                }
            
            })

    }


    const renderCards = FavoredMovies && FavoredMovies.map((movie, index) => {

        const content = (

            <div>
                {movie.moviePost ?                
                    <img src={`${IMAGE_BASE_URL}w500${movie.moviePost}`} /> : 'no image'           
                }
            </div>

        )


       return <tr key={index}>

            <Popover content={content} title={`${movie.movieTitle}`}>
                <td>{movie.movieTitle}</td>
            </Popover>
            <td>{movie.movieRunTime} mins</td>
            <td><button onClick={() => onClickRemove(movie.movieId, movie.userFrom)}>Remove</button></td>

        </tr>


    })


    return (
        <div style={{width: '85%', margin: '3rem auto'}}>

            <h2>Favorite Movies</h2>
            <hr />

            <table>
                <thead>
                    <tr>
                        <th>Movie Title</th>
                        <th>Movie RunTime</th>
                        <th>Remove from favorites</th>
                    </tr>
                </thead>
                <tbody>

                    {renderCards}
                
                </tbody>
            </table>

        </div>
    )
}

export default FavoritePage
