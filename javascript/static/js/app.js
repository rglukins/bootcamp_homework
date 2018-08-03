// from data.js
var tableData = data;

// create arrays of the data for use in the drop-down menus

let states = Array.from(new Set(tableData.map(data => data.state)));
let cities = Array.from(new Set(tableData.map(city => city.city)));
let shapes = Array.from(new Set(tableData.map(shape => shape.shape)));
let countries = Array.from(new Set(tableData.map(country => country.country)));

// ** Add the states, cities, and shapes options to the drop-down options in the filter menu of the index.html file.**

// cities drop-down
cities.forEach((city) => { 
    let mySelect = document.getElementById('city'),
        newOption = document.createElement('option');
    newOption.value = `${city}`;
    if (typeof newOption.textContent === 'undefined'){
        newOption.innerText = `${city}`;}
    else{
        newOption.textContent = `${city}`;}

    mySelect.appendChild(newOption);
});

// states drop-down
states.forEach((state) => { 
    let mySelect = document.getElementById('state'),
        newOption = document.createElement('option');
    newOption.value = `${state}`;
    if (typeof newOption.textContent === 'undefined'){
        newOption.innerText = `${state}`;}
    else{
        newOption.textContent = `${state}`;}

    mySelect.appendChild(newOption);
});

// shape drop-down
shapes.forEach((shape) => { 
    let mySelect = document.getElementById('shape'),
        newOption = document.createElement('option');
    newOption.value = `${shape}`;
    if (typeof newOption.textContent === 'undefined'){
        newOption.innerText = `${shape}`;}
    else{
        newOption.textContent = `${shape}`;}

    mySelect.appendChild(newOption);
});

// country drop-down
countries.forEach((country) => { 
    let mySelect = document.getElementById('country'),
        newOption = document.createElement('option');
    newOption.value = `${country}`;
    if (typeof newOption.textContent === 'undefined'){
        newOption.innerText = `${country}`;}
    else{
        newOption.textContent = `${country}`;}

    mySelect.appendChild(newOption);
});

// Get a reference to the table body and other important html tags
let tbody = d3.select("tbody");

// ** Code the functions for the events in the search and filter menus. **

// Start by populate the entire dataset on the homepage.

initData(tableData);
function initData(dataset) {
    dataset.forEach((ufoData) => {
        let row = tbody.append("tr");
        Object.entries(ufoData).forEach(([key, value]) => {
            let cell = tbody.append("td");
            cell.text(value);
        });
    });
}

// Functions for the date search and the change options in the drop-down menus.

function dateSearch(datestring){
    console.log(datestring);
    let filteredData = tableData.filter((date) => date.datetime === datestring)
            
    filteredData.forEach((ufoData) => {
        let row = tbody.append("tr");
        Object.entries(ufoData).forEach(([key, value]) => {
            let cell = tbody.append("td");
            cell.text(value);
        });
    });
}

function getCityData(){
    console.log('deleting original table')
    $("#ufo-table-body").empty();
    console.log('starting get city')
    let e = document.getElementById("city");
    console.log('have element')
    let cityResult = e.options[e.selectedIndex].text;
    console.log('have city text')
    let cityData = tableData.filter((x) => x.city === cityResult);
    console.log('have new table data')
    cityData.forEach((cityData) => {
        let row = tbody.append("tr");
        Object.entries(cityData).forEach(([key, value]) => {
            let cell = tbody.append("td");
            cell.text(value);
        });
    });
}

function getStateData(){
    console.log('deleting original table')
    $("#ufo-table-body").empty();
    console.log('starting get state')
    let e = document.getElementById("state");
    console.log('have element')
    let stateResult = e.options[e.selectedIndex].text;
    console.log('have state text')
    let stateData = tableData.filter((x) => x.state === stateResult);
    console.log('have new table data')
    stateData.forEach((stateData) => {
        let row = tbody.append("tr");
        Object.entries(stateData).forEach(([key, value]) => {
            let cell = tbody.append("td");
            cell.text(value);
        });
    });
}

function getCountryData(){
    console.log('deleting original table')
    $("#ufo-table-body").empty();
    console.log('starting get country')
    let e = document.getElementById("country");
    console.log('have element')
    let countryResult = e.options[e.selectedIndex].text;
    console.log('have country text')
    let countryData = tableData.filter((x) => x.country === countryResult);
    console.log('have new table data')
    countryData.forEach((countryData) => {
        let row = tbody.append("tr");
        Object.entries(countryData).forEach(([key, value]) => {
            let cell = tbody.append("td");
            cell.text(value);
        });
    });
}

function getShapeData(){
    console.log('deleting original table');
    $("#ufo-table-body").empty();
    console.log('starting get shape')
    let e = document.getElementById("shape");
    console.log('have element');
    let shapeResult = e.options[e.selectedIndex].text;
    console.log('have shape text')
    let shapeData = tableData.filter((x) => x.shape === shapeResult);
    console.log('have new table data')
    shapeData.forEach((shapeData) => {
        let row = tbody.append("tr");
        Object.entries(shapeData).forEach(([key, value]) => {
            let cell = tbody.append("td");
            cell.text(value);
        });
    });
}

// Add a listerer event for the date search button

let submitDate = d3.select("#search-btn");

submitDate.on('click', () => {
    d3.event.preventDefault();
    console.log('clicked!');
    $("#ufo-table-body").empty();
    console.log("Original Table deleted");
    let inputElement = d3.select("#datetime");
    console.log(inputElement);
    let inputValue = inputElement.property('value');
    console.log(inputValue);
    dateSearch(inputValue);
});

