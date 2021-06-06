import React, {useState, useEffect} from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';

function Roads(props) {
    const [greenRoads, setGreenRoads] = useState([]);
    const [yellowRoads, setYellowRoads] = useState([]);
    const [redRoads, setRedRoads] = useState([]);
    const sloCoordinates = [46.1491664, 14.9860106];
      
    useEffect(function(){
        async function getSigns(){
            const res = await fetch('http://localhost:3001/roads/');
            var result = await res.json();

            var greenLines = [];
            var yellowLines = [];
            var redLines = [];

            var line = [];
            line.push([result[0].latitude, result[0].longtitude]);
            var id = result[0].pathID;

            for (let i = 1; i < result.length; i++) {
                if(result[i].pathID == id){
                    line.push([result[i].latitude, result[i].longtitude]);
                }
                else{
                    if(result[i-1].quality === 1){
                        greenLines.push(line);
                    }
                    else if(result[i-1].quality === 2){
                        yellowLines.push(line);
                    }
                    else{
                        redLines.push(line);
                    }
                    line = [];
                    id = result[i].pathID;
                    line.push([result[i].latitude, result[i].longtitude]);
                }
            }

            if(result[result.length-1].quality === 1){
                greenLines.push(line);
            }
            else if(result[result.length-1].quality === 2){
                yellowLines.push(line);
            }
            else{
                redLines.push(line);
            }
            
            setGreenRoads(greenLines);
            setYellowRoads(yellowLines);
            setRedRoads(redLines);
        }
        getSigns();
    }, []);

    const greenOptions = { color: '#00ff66' }
    const yellowOptions = { color: '#fffb00' }
    const redOptions = { color: '#ff0004' }

    return (
        <div style={{height: "850px", width: "100%"}}>
            <MapContainer center={sloCoordinates} zoom="9" scrollWheelZoom={true} style={{height: "inherit", width: "inherit"}}>
                <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polyline pathOptions={greenOptions} positions={greenRoads} />
                <Polyline pathOptions={yellowOptions} positions={yellowRoads} />
                <Polyline pathOptions={redOptions} positions={redRoads} />
            </MapContainer>
        </div>
    );
}

export default Roads;