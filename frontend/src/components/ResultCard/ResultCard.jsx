import React from 'react';
import "./ResultCard.css";

const ResultCard = ({title, subtitle, imageUrl}) => {
    return (
        <div className="result-card">
            <img src={imageUrl} alt={title} className="result-image"/>
            <h4>{title}</h4>
            (subtitle && <p>{subtitle}</p>)
        </div>
    )
}

export default ResultCard;