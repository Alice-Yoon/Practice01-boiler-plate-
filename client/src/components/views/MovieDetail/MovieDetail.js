import React, {useEffect, useState} from 'react';
import { API_URL, API_KEY, IMAGE_BASE_URL } from '../../../Config';
import MainImage from '../commons/MainImage';
import GridCards from '../commons/GridCards';
import MovieInfo from './Sections/MovieInfo';
import FavoriteBtn from './Sections/FavoriteBtn';
import {Row} from 'antd';

function MovieDetail({match}) {

    const movieId = match.params.movieId;

    const [Movie, setMovie] = useState([]);
    const [Casts, setCasts] = useState([]);
    const [ToggleCasts, setToggleCasts] = useState(false);

    useEffect(() => {
        
        const endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}`
        const endpointCasts = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`

        fetch(endpointInfo)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setMovie(data)
            })


        fetch(endpointCasts)
            .then(res => res.json())
            .then(data => {
                console.log(data.cast)
                setCasts(data.cast)
            })



    }, [])

    const onClickToggleActor = () => {
        setToggleCasts(!ToggleCasts)
    }


    return (
        <div>
            
            {/* Header */}

            <MainImage 
                image={`${IMAGE_BASE_URL}w1280${Movie.backdrop_path}`}
                title={Movie.title}
                description={Movie.overview}
            />

            {/* Body */}
            <div style={{width: '85%', margin: '1rem auto'}}>

                <FavoriteBtn movieInfo={Movie} movieId={movieId} userFrom={localStorage.getItem('userId')} />

                {/* Movie Info */}
                <MovieInfo movie={Movie} />

                <br />

                <div style={{display: 'flex', justifyContent: 'center', margin: '2rem'}}>
                    <button onClick={onClickToggleActor}>
                        Toggle Actor View
                    </button>
                </div>

                {/* Actors Grid */}
                {ToggleCasts &&
                
                    <Row gutter={[16, 16]}>
                        {Casts && Casts.map((cast, index) => (

                            cast.profile_path ?
                            <GridCards 
                                key={cast.cast_id}
                                image={`${IMAGE_BASE_URL}w500${cast.profile_path}`}
                                CharacterName={cast.name}        
                            />
                            : null

                        ))               
                        }
                    </Row>
                }


            </div>





        </div>
    )
}

export default MovieDetail
