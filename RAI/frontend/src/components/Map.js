import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function Map(props) {
    return (
        <div style={{height: "500px", width: "500px"}}>
            <MapContainer center={[46.145214, 15.286206]} zoom={13} scrollWheelZoom={true} style={{height: "inherit", width: "inherit"}}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[46.145214, 15.286206]}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            </MapContainer>
        </div>
    );
}

export default Map;