import React, {useState, useEffect} from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';

function Roads(props) {
    const [signs, setSigns] = useState([]);
    const sloCoordinates = [46.1491664, 14.9860106];
    const polyline = [
        [51.505, -0.09],
        [51.51, -0.1],
        [51.51, -0.12],
      ]
      
    useEffect(function(){
        async function getSigns(){
            const res = await fetch('http://localhost:3001/signs/');
            var result = await res.json();
            setSigns(result);
        }
        getSigns();
    }, []);

    function formatDate (date) {
        date = new Date(date);
        var ret = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + (date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes());
        return ret;
    }
    const limeOptions = { color: 'lime' }

    return (
        <div style={{height: "850px", width: "100%"}}>
            <MapContainer center={[51.505, -0.09]} zoom="9" scrollWheelZoom={true} style={{height: "inherit", width: "inherit"}}>
                <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polyline pathOptions={limeOptions} positions={polyline} />
            </MapContainer>
        </div>
    );
}

export default Roads;