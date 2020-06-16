import React from 'react'
import { urlencoded } from 'body-parser'

function MainImage({image, title, description}) {
    return (
        <div style={{
                border:'1px solid aqua',
                position:'relative',
                background: `url(${image})`,
                backgroundSize: '100% cover',
                backgroundPosition: 'center center',
                width: '100%',
                height: '400px'
                }}>

            <div>
                <div style={{maxWidth: '500px', 
                        position:'absolute', bottom:'2rem', left:'2rem'
                        }}>
                    <h2 style={{color: 'white'}}>{title}</h2>
                    <p style={{color: 'white', fontSize:'1rem'}}>{description}</p>
                </div>
            </div>

        </div>
    )
}

export default MainImage
