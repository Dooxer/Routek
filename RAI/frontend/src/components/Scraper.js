import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
const rp = require('request-promise');
var convert = require('xml-js');

//START: compress/decompress
let differences = [];
let binData = "";
function deAbs10() {
    var tempSign = binData.substring(0, 1);
    binData = binData.substring(1);

    var tempValue = binData.substring(0, 8);
    binData = binData.substring(8);

    if (tempSign == "1") {
        differences.push(-bin2dec(tempValue));
    }
    else {
        differences.push(bin2dec(tempValue));
    }
}

function deDifference00() {
    var temp = binData.substring(0, 2);
    binData = binData.substring(2);

    var numberOfBits = bin2dec(temp) + 2;

    if (numberOfBits == 2) {
        let lowArr = [-2, -1];
        let highArr = [1, 2];
        differences.push(getValFromBits(lowArr, highArr, binData.substring(0, 2)));
        binData = binData.substring(2);
    }
    else if (numberOfBits == 3) {
        let lowArr = [-6, -3];
        let highArr = [3, 6];
        differences.push(getValFromBits(lowArr, highArr, binData.substring(0, 3)));
        binData = binData.substring(3);
    }
    else if (numberOfBits == 4) {
        let lowArr = [-14, -7];
        let highArr = [7, 14];
        differences.push(getValFromBits(lowArr, highArr, binData.substring(0, 4)));
        binData = binData.substring(4);
    }
    else {
        let lowArr = [-30, -15];
        let highArr = [15, 30];
        differences.push(getValFromBits(lowArr, highArr, binData.substring(0, 5)));
        binData = binData.substring(5);
    }
}

function deRepetitions01() {
    var temp = binData.substring(0, 3);
    binData = binData.substring(3);

    var reps = bin2dec(temp) + 1;

    for (let i = 0; i < reps; i++) {
        differences.push(0);
    }
}

function getValFromBits(lowArr, highArr, input) {
    let temp = bin2dec(input);
    let value = lowArr[0];

    for (let i = 0; i < temp; i++) {
        if (value == lowArr[1]) value = highArr[0];
        else {
            value++;
        }
    }

    return value;
}

function getBits(lowArr, highArr, input, numOfBits) {
    let temp = lowArr[0];
    let value = 0;

    for (let i = 0; temp != input; i++) {
        if (temp == lowArr[1]) {
            temp = highArr[0];
            value++;
        }
        else {
            temp++;
            value++;
        }
    }

    return ("00000" + value.toString(2)).substr(-numOfBits)
}

function difference00(input) {
    var output = "";

    if (Math.abs(input) == 1 || Math.abs(input) == 2) {
        let lowArr = [-2, -1];
        let highArr = [1, 2];

        output += "00" + getBits(lowArr, highArr, input, 2);
    }
    else if (Math.abs(input) >= 3 && Math.abs(input) <= 6) {
        let lowArr = [-6, -3];
        let highArr = [3, 6];

        output += "01" + getBits(lowArr, highArr, input, 3);
    }
    else if (Math.abs(input) >= 7 && Math.abs(input) <= 14) {
        let lowArr = [-14, -7];
        let highArr = [7, 14];

        output += "10" + getBits(lowArr, highArr, input, 4);
    }
    else if (Math.abs(input) >= 15 && Math.abs(input) <= 30) {
        let lowArr = [-30, -15];
        let highArr = [15, 30];

        output += "11" + getBits(lowArr, highArr, input, 5);
    }

    return output;
}

function repetitions01(reps) {
    return ("0000" + reps.toString(2)).substr(-3);
}

function abs10(input) {
    if (input > 0) {
        return "0" + dec2bin(input);
    }
    else {
        return "1" + dec2bin(Math.abs(input));
    }
}

function dec2bin(n) {
    return ("000000000" + n.toString(2)).substr(-8);
}

function bin2dec(n) {
    return (parseInt(n, 2));
}

function compress(text) {
    let output = "";
    let diffArr = [];

    // escape
    text = encodeURI(text);

    //Input -> ASCII
    for (let i = 0; i < text.length - 1; i++) {
        diffArr[i] = text[i + 1].charCodeAt() - text[i].charCodeAt();
    }

    //Zapis prve vrednosti z 8 biti
    output += dec2bin(text[0].charCodeAt());

    let reps = 0;
    for (let i = 0; i < diffArr.length; i++) {
        if (Math.abs(diffArr[i]) >= 1 && Math.abs(diffArr[i]) <= 30) {
            output += "00" + difference00(diffArr[i]);
        }
        else if (diffArr[i] == 0) {
            reps++;

            if (diffArr.length - 1 == i || diffArr[i + 1] != 0 || reps == 8) {
                output += "01" + repetitions01(reps - 1);
                reps = 0;
            }
        }
        else {
            output += "10" + abs10(diffArr[i]);
        }
    }

    output += "11";

    while (output.length % 8 != 0) {
        output += "0";
    }

    var buffer = "";
    for (let i = 0; output.length > 0; i++) {
        buffer += (String.fromCharCode(parseInt(output.substring(0, 8), 2)));
        output = output.substring(8);
    }

    return buffer;
}

function decompress(data) {
    differences.push(data[0].charCodeAt());

    for (let i = 1; i < data.length; i++) {
        binData += dec2bin(data[i].charCodeAt())
    }

    while (binData.length != 0) {
        let temp = binData.substring(0, 2);
        binData = binData.substring(2);

        switch (temp) {
            case "00":
                deDifference00();
                break;
            case "01":
                deRepetitions01();
                break;
            case "10":
                deAbs10();
                break;
            case "11":
                binData = "";
                break;
        }
    }

    var output = "" + String.fromCharCode(differences[0]);

    for (let i = 1; i < differences.length; i++) {
        differences[i] = differences[i - 1] + differences[i];
        output += String.fromCharCode(differences[i]);
    }

    output = decodeURI(output);
    binData = "";
    differences = [];

    return output;
}
//END

function Scraper() {
    const [trafficEvents, setTrafficEvents] = useState([]);
    const [trafficEventsHead, setTrafficEventsHead] = useState([]);
    const [update, setUpdate] = useState(0);

    useEffect(function () {
        const url = 'https://www.promet.si/dc/b2b.dogodki.rss?language=en_US&eventtype=incidents';
        document.getElementById("loader").style.display = "block";

        rp(url).then(function (html) {
            async function update() {
                var res = await fetch('http://localhost:3001/trafficEventsHead/');
                var head = await res.json();

                if (res.status === 200) {
                    setTrafficEventsHead(head[0]);

                    res = await fetch('http://localhost:3001/trafficEvent/');
                    var trafficEvents = await res.json();

                    if (res.status === 200) {
                        setTrafficEvents(trafficEvents);
                    }
                }
            }

            async function getData() {
                // dobimo podatke
                var json = convert.xml2json(html, { compact: true, spaces: 4 });
                json = JSON.parse(json).feed;

                // nastavimo glavo dogodkov v prometu
                var trafficEventsHead = { title: json.title._text, subtitle: json.subtitle._text, updated: new Date(json.updated._text), author: json.author.name._text, email: json.author.email._text };

                // dobimo shranjeno glavo
                var res = await fetch('http://localhost:3001/trafficEventsHead/');
                var result = await res.json();

                if (res.status === 200) {
                    // če je čas shranjene glave še isti, ni novih podatkov
                    var newUpdate = true;
                    result.forEach(element => {
                        if (new Date(element.updated) === new Date(trafficEventsHead.updated)) {
                            newUpdate = false;
                        }
                    });

                    if (newUpdate === true) {
                        // posodobimo oziroma ustvarimo glavo, če še ne obstaja
                        if (result.length === 0) {
                            res = await fetch('http://localhost:3001/trafficEventsHead/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(trafficEventsHead)
                            });
                            result = await res.json();
                        }
                        else {
                            res = await fetch('http://localhost:3001/trafficEventsHead/' + result[0]._id, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(trafficEventsHead)
                            });
                            result = await res.json();
                        }

                        if (res.status === 201 || res.status === 200) {
                            // dobimo že shranjene dogodke
                            res = await fetch('http://localhost:3001/trafficEvent/');
                            var trafficEvents = await res.json();

                            json.entry.forEach(async element => {
                                var trafficEvent = { id: element.id._text, title: element.title._text, updated: element.updated._text, summaryData: compress(element.summary._text), trafficEventsHead: result._id, category: element.category._attributes.term };

                                // preverimo, če dogodek že obstaja
                                var addEvent = true;
                                trafficEvents.forEach(event => {
                                    if (event.id == trafficEvent.id) {
                                        addEvent = false;
                                    }
                                });

                                if (addEvent === true) {
                                    // dodamo dogodek, če še ne obstaja
                                    res = await fetch('http://localhost:3001/trafficEvent/', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(trafficEvent)
                                    });

                                    if (await res.status !== 201) {
                                        console.log("Failed to add event '" + trafficEvent + "' to database!");
                                    }
                                }
                            });
                            update();

                            document.getElementById("loader").style.display = "none";
                        }
                    }
                }
            }
            getData();
        })
            .catch(function (err) {
                console.err("Failed to fetch data from '" + url + "'", err);
            });
    }, [update]);

    function formatDate(date) {
        date = new Date(date);
        var ret = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + (date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes());
        return ret;
    }

    function updateEvents() {
        setUpdate(update + 1);
    }

    return (
        <div>
            <h1>{trafficEventsHead.subtitle}</h1>
            <h3>{trafficEventsHead.title}</h3>
            <h5>Author: {trafficEventsHead.author}</h5>
            <h5>Email: {trafficEventsHead.email}</h5>
            <h5>Updated: {formatDate(trafficEventsHead.updated)}</h5>
            <Button onClick={updateEvents} style={{ marginBottom: "10px" }}>Update</Button>
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
                        return (
                            <tr key={element.id}>
                                <td>{element.id}</td>
                                <td>{element.title}</td>
                                <td>{decompress(element.summaryData)}</td>
                                <td>{formatDate(element.updated)}</td>
                                <td>{element.category}</td>
                            </tr>)
                    })}
                </tbody>
            </Table>
        </div>
    );
}

export default Scraper;