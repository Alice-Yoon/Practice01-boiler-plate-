import React from 'react';
import {Col} from 'antd';

function GridCards({landingPage, image, movieId, movieName, CharacterName}) {


    if(landingPage) {

        return (
            <Col lg={6} md={8} xs={24}>
                <div style={{position: 'relative'}}>
                    <a href={`/movie/${movieId}`}>
                        <img src={image} alt={movieName} style={{width: '100%', height:'320px'}} />
                    </a>
                </div>
            </Col>
        )
    } else {

        return (
            <Col lg={6} md={8} xs={24}>
                <div style={{position: 'relative'}}>
                        <img src={image} alt={CharacterName} style={{width: '100%', height:'320px'}} />
                </div>
            </Col>
        )
    }
}

export default GridCards
