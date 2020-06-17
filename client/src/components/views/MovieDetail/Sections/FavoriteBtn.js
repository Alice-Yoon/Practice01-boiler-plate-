import React, {useEffect, useState} from 'react';
import axios from 'axios';

function FavoriteBtn({movieInfo, movieId, userFrom}) {

    const [FavoriteNumber, setFavoriteNumber] = useState(0);
    const [Favorited, setFavorited] = useState(false);

    const movieTitle = movieInfo.title;
    const moviePost = movieInfo.backdrop_path;
    const movieRunTime = movieInfo.runtime;

    useEffect(() => {

        console.log(userFrom)
        
        let variables = {
            userFrom,
            movieId
        }

        // (1) Favorite 등록한 사람 숫자 가져오기
        axios.get('/api/favorite/favoriteNumber', variables)
            .then(res => {
                console.log(res.data)
                if(res.data.success) {
                    setFavoriteNumber(res.data.favoriteNumber)
                } else {
                    alert('숫자 정보를 가져오는데 실패 했습니다.')
                }
            })

        // (2) 내가 이 영화를 favorite 추가 했는지 안 했는지 가져오기
        axios.get('/api/favorite/favorited', variables)
            .then(res => {
                console.log(res.data)
                if(res.data.success) {
                    setFavorited(res.data.favorited)
                } else {
                    alert('정보를 가져오는데 실패 했습니다.')
                }
            })

    }, [])

    const onClickHandleFavorite = () => {

        const variables = {
            userFrom,
            movieId,
            movieTitle,
            moviePost,
            movieRunTime
        }

        if(!Favorited) {

            axios.post('/api/favorite/addFavorite', variables)
                .then(res => {
                    console.log(res.data)
                    if(res.data.success) {
                        setFavoriteNumber(FavoriteNumber + 1)
                        setFavorited(!Favorited)
                    } else {
                        alert('Favorite 리스트에 추가하는 걸 실패했습니다.')
                    }
                })

            

        } else {

            axios.post('/api/favorite/removeFromFavorite', variables)
                .then(res => {
                    console.log(res.data)
                    if(res.data.success) {
                        setFavoriteNumber(FavoriteNumber - 1)
                        setFavorited(!Favorited)
                    } else {
                        alert('Favorite 리스트에서 지우는 걸 실패했습니다.')
                    }
                })
        }
    }

    return (
        <div style={{display:'flex', justifyContent: 'flex-end'}}>
                    <button
                        onClick={onClickHandleFavorite}
                    >{Favorited ? "Not Favorite" : "Add to Favorite"} {FavoriteNumber}</button>
        </div>
    )
}

export default FavoriteBtn
