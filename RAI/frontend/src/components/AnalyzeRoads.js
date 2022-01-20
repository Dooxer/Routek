import React, { useState, useEffect } from 'react';
import DoubleBubble from "./Loading"
import '../App.css';

function AnalyzeRoads(props) {

    const [quality, setQuality] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(function () {
        async function calculateQualuty() {
            const res = await fetch('http://localhost:3001/roads/analyze');
            var result = await res.json();
            console.log(result.quality);
            setQuality(result.quality.slice(0, 5));
            setLoading(false);
        }
        calculateQualuty();
    }, []);



    return (
        <div>
            {loading ? <DoubleBubble></DoubleBubble> : <div className='circle'> <div className='centerH'>All roads calculation</div>
                <div className='center'>{quality}</div></div>}

        </div>
    );
}

export default AnalyzeRoads;
