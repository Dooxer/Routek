import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

function Signs() {
    const [signs, setSigns] = useState([]);
    const sloCoordinates = [46.1491664, 14.9860106];

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

    return (
        <div style={{height: "850px", width: "100%"}}>
            <MapContainer center={sloCoordinates} zoom="9" scrollWheelZoom={true} style={{height: "inherit", width: "inherit"}}>
                <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {signs.map((sign) => {
                    const icon = new L.Icon({
                        iconUrl: "http://localhost:3001/" + sign.picture,
                        iconRetinaUrl: "http://localhost:3001/" + sign.picture,
                        iconSize: new L.Point(45, 45),
                        className: 'leaflet-div-icon'
                    });

                    return (
                        <Marker icon={icon} key={sign._id} position={[sign.latitude, sign.longtitude]}>
                            <Popup>
                                <h5>{sign.description}</h5>
                                Created: {formatDate(sign.date)} <br/>
                                <img style={{height: "200px", width: "auto"}} src={"http://localhost:3001/" + sign.picture} />
                            </Popup>
                        </Marker>)
                })}
            </MapContainer>
        </div>
    );
}

export default Signs;