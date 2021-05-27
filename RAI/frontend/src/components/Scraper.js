import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
const rp = require('request-promise');
var convert = require('xml-js');

function Scraper(props) {
    const [trafficEvents, setTrafficEvents] = useState([]);
    const [trafficEventsHead, setTrafficEventsHead] = useState([]);
    const [update, setUpdate] = useState(0);

    useEffect(function () {
        const url = 'https://www.promet.si/dc/b2b.dogodki.rss?language=en_US&eventtype=incidents';

        rp(url).then(function(html){
            async function update(){
                var res = await fetch('http://localhost:3001/trafficEventsHead/');
                var head = await res.json();
                
                if(res.status === 200){
                    setTrafficEventsHead(head[0]);
        
                    res = await fetch('http://localhost:3001/trafficEvent/');
                    var trafficEvents = await res.json();
                    
                    if(res.status === 200){
                        setTrafficEvents(trafficEvents);
                    }
                }
            }

            async function getData(){
                // dobimo podatke
                var json = convert.xml2json(html, {compact: true, spaces: 4});
                json = JSON.parse(json).feed;

                // nastavimo glavo dogodkov v prometu
                var trafficEventsHead = {title: json.title._text, subtitle: json.subtitle._text, updated: new Date(json.updated._text), author: json.author.name._text, email: json.author.email._text};

                // dobimo shranjeno glavo
                var res = await fetch('http://localhost:3001/trafficEventsHead/');
                var result = await res.json();

                if(res.status === 200){
                    // če je čas shranjene glave še isti, ni novih podatkov
                    var newUpdate = true;
                    result.forEach(element => {
                        if(new Date(element.updated) === new Date(trafficEventsHead.updated)){
                            newUpdate = false;
                        }
                    });

                    if(newUpdate === true){
                        // posodobimo oziroma ustvarimo glavo, če še ne obstaja
                        if(result.length === 0){
                            res = await fetch('http://localhost:3001/trafficEventsHead/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(trafficEventsHead)
                            });
                            result = await res.json();
                        }
                        else{
                            res = await fetch('http://localhost:3001/trafficEventsHead/' + result[0]._id, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(trafficEventsHead)
                            });
                            result = await res.json();
                        }
        
                        if(res.status === 201 || res.status === 200){
                            // dobimo že shranjene dogodke
                            res = await fetch('http://localhost:3001/trafficEvent/');
                            var trafficEvents = await res.json();

                            json.entry.forEach(async element => {
                                var trafficEvent = {id: element.id._text, title: element.title._text, updated: element.updated._text, summary: element.summary._text, trafficEventsHead: result._id, category: element.category._attributes.term};
                                                            
                                // preverimo, če dogodek že obstaja
                                var addEvent = true;
                                trafficEvents.forEach(event => {
                                    if(event.id == trafficEvent.id){
                                        addEvent = false;
                                    }
                                });
                                
                                if(addEvent === true){
                                    // dodamo dogodek, če še ne obstaja
                                    res = await fetch('http://localhost:3001/trafficEvent/', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(trafficEvent)
                                    });

                                    if(await res.status !== 201){
                                        console.log("Failed to add event '" + trafficEvent + "' to database!");
                                    }
                                }                       
                            });
                            update();
                        }
                    }    
                }
            }
            getData();
        })
        .catch(function(err){
            console.err("Failed to fetch data from '" + url + "'", err);
        });
    }, [update]);

    function formatDate (date) {
        date = new Date(date);
        var ret = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + (date.getHours() + 1) + ":" + (date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes());
        return ret;
    }

    function updateEvents(){
        setUpdate(update + 1);
    }
    
    return (
        <>
            <h1>{trafficEventsHead.subtitle}</h1>
            <h3>{trafficEventsHead.title}</h3>
            <h5>Author: {trafficEventsHead.author}</h5>
            <h5>Email: {trafficEventsHead.email}</h5>
            <h5>Updated: {formatDate(trafficEventsHead.updated)}</h5>
            <Button onClick={updateEvents} style={{marginBottom: "10px"}}>Update</Button>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Summary</th>
                        <th>Updated</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {trafficEvents.map((element) => {
                        return (<tr key={element.id}>
                            <td>{element.id}</td>
                            <td>{element.title}</td>
                            <td>{element.summary}</td>
                            <td>{formatDate(element.updated)}</td>
                            <td>{element.category}</td>
                        </tr>) 
                    })}
                </tbody>
            </Table>  
        </>
    );
}

export default Scraper;