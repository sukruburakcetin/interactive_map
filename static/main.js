var menuBtn = document.getElementById('menu')

var darkScreen = document.getElementById('dark-screen')

var addInput = document.getElementById('add-input')

menuBtn.addEventListener('click', scrollMenu)

var preLoader = document.getElementById("pre-loader")

preLoader.style.animation = "flip-horizontal 1s ease-in-out infinite";

var buttonContainerFirst = document.getElementById('button-container-first')
var buttonContainerSecond = document.getElementById('button-container-second')
var buttonContainerThird = document.getElementById('button-container-third')
var buttonClearAddress = document.getElementById('clear-address')
var searchInput = document.getElementById('search-bar-input')

var resultContainer = document.getElementById('result-container');

var potentialSaleInfo = document.getElementById('#potential-sale-info')
searchInput.addEventListener('click', function (){
    resultContainer.style.display = 'block'
})

function submitForm(event) {
    event.preventDefault(); // Prevent default form submission behavior

    var searchInput = document.getElementById('search-bar-input').value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/locate-addresses", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            // Handle the response here
            console.log(response);
            displayResponse(response);
        }
    };

    var data = JSON.stringify({"search-bar-input": searchInput});
    // console.log("data", data)
    xhr.send(data);

    function displayResponse(response) {
        // var resultContainer = document.getElementById('result-container');
        resultContainer.innerHTML = ''; // Clear previous results
        try {
            for (var i = 0; i < response.result.length; i++) {
                var address = response.result[i];
                var myList = document.createElement('li');
                var addressElement = document.createElement('button');
                addressElement.textContent = address.name;
                myList.appendChild(addressElement);

                // Create a closure to capture the address values
                (function (lat, lng) {
                    addressElement.onclick = function zoomTo() {
                        map.setView([lat, lng], 18);
                    };
                })(address.lat, address.lon);
                resultContainer.appendChild(addressElement);
            }
        }
        catch (e) {
            alert("Adres giriniz!")

        }
    }
}

buttonClearAddress.addEventListener('click', function (){
    resultContainer.style.display = "none"
    searchInput.value = ""
})

var scrollCheck = 0
function scrollMenu() {
    if (scrollCheck == 0) {
        buttonContainerFirst.style.left = "1px";
        buttonContainerThird.style.left = "1px";
        scrollCheck += 1
    } else if (buttonContainerFirst.style.left == "-60px" && buttonContainerThird.style.top == "120px") {
        console.log("1")
        buttonContainerFirst.style.left = "1px";
        buttonContainerThird.style.left = "1px";
    } else if (buttonContainerFirst.style.left == "-60px" && buttonContainerThird.style.top != "120px") {
        console.log("2")
        buttonContainerFirst.style.left = "1px";
        buttonContainerThird.style.top = "120px"
        buttonContainerThird.style.left = "1px";
    } else {
        console.log("3")
        buttonContainerFirst.style.left = "-60px"
        buttonContainerSecond.style.left = "-60px"
        buttonContainerThird.style.left = "-60px";
    }
}
// Get the popup and the close button
const popup = document.querySelector('.popup');
const closeBtn = popup.querySelector('.close-btn');


// Add an event listener to the close button
closeBtn.addEventListener('click', () => {
    // Hide the popup
    popup.style.display = 'none';
    darkScreen.style.display = 'none';
});

closeBtn.addEventListener('mouseover', () => {
    closeBtn.style.color = 'red'
});

closeBtn.addEventListener('mouseout', () => {
    closeBtn.style.color = 'black'
});

// Show the popup when the page is loaded
window.addEventListener('load', () => {
    popup.style.display = 'block';
});

var showTableBtn = document.getElementById('show-table');
var markerTable = document.getElementById('marker-table');
var checkershowTableBtn = 0
showTableBtn.addEventListener('click', function () {
    markerTable.classList.toggle('show');
    checkershowTableBtn += 1

    if (checkershowTableBtn % 2 === 1) {
        showTableBtn.style.backgroundColor = "green"
        showTableBtn.style.color = "white"
    } else {
        showTableBtn.style.backgroundColor = "#F0F0F0"
        showTableBtn.style.color = "black"
        showTableBtn.style.fontSize = "18px";
    }
});

var tableId = document.getElementById('marker-table');
var tBody = tableId.getElementsByTagName('tbody')[0];

tBody.addEventListener("mouseover", function () {
    tBody.style.overflowY = "scroll"
})

tBody.addEventListener("mouseout", function () {
    tBody.style.overflowY = "hidden"
})

var map = L.map('map', {
    minZoom: 10
}).setView([41.188806, 28.980162], 10);
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
})

var esriLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
})

var mapboxStreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic3VrcnVidXJha2NldGluIiwiYSI6ImNsODM4cHg2YzAzNHozdWxoajU0dWt6ODgifQ.kqIwO3bpD-U5qrisUnJLIA'
})


var cartoPositron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: 'Tiles &copy; <a href="https://carto.com/">Carto</a>',
    subdomains: 'abcd',
    maxZoom: 19
})

var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data &copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>',
    subdomains: ['a', 'b', 'c']
})

var rehberVTGrayLayer = L.tileLayer('https://cbsaltlik.ibb.gov.tr/arcgis/rest/services/RehberGrayMap/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'İstanbul Büyükşehir Belediyesi©',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 19
});

var rehberVTDarkLayer = L.tileLayer('https://cbsaltlik.ibb.gov.tr/arcgis/rest/services/RehberDark/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'İstanbul Büyükşehir Belediyesi©',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 19
})
var uyduLayer = L.tileLayer('https://cbsaltlik.ibb.gov.tr/arcgis/rest/services/Uydu/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'İstanbul Büyükşehir Belediyesi©',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 19
});


// Add only the selected layer back to the map
var selectedLayer = rehberVTGrayLayer
selectedLayer.addTo(map);

// Add the layer control back to the map with only the selected layer option
var layerControl = L.control.layers({
    // Only show the selected layer in the layer control
    'RehberVTGray': selectedLayer,
    'RehberVTDark': rehberVTDarkLayer,
    'Uydu 2022': uyduLayer,
    'Mapbox': mapboxStreets,
    'Carto': cartoPositron,
    'OpenTopo': openTopoMap,
    'Esri': esriLayer,
    'Osm': osmLayer
}).addTo(map);

var suitabilityLayer;

$.getJSON('/static/IHE_UYGUNLUK_YENI.geojson', function (data) {
    console.log("buraya bak", data); // log the GeoJSON data
    // create a new GeoJSON layer and assign it to the suitabilityLayer variable
    suitabilityLayer = L.geoJSON(data, {
        style: function (feature) {
            var gridcode = feature.properties.GRIDCODE;
            var fillColor;
            if (gridcode === 1) {
                fillColor = '#F3F3E2'
            } else if (gridcode === 2) {
                fillColor = '#fff7bc';
            } else if (gridcode === 3) {
                fillColor = '#fe9929';
            } else if (gridcode === 4) {
                fillColor = '#ec7014';
            } else if (gridcode === 5) {
                fillColor = '#8c2d04';
            } else if (gridcode === 6) {
                fillColor = '#00000000'
            } else if (gridcode === 7) {
                fillColor = '#00000000'
            } else if (gridcode === 8) {
                fillColor = '#00000000'
            }
            return {
                color: '#000',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9,
                fillColor: fillColor
            };
        }
    });
});

// define the ulasmayanLayer variable outside of the callback function
var ulasmayanLayer;

$.getJSON('/static/IHE_ULASMAYAN_YAPI.json', function (data) {
    // create a new GeoJSON layer and assign it to the suitabilityLayer variable
    ulasmayanLayer = L.geoJSON(data, {
        style: function (feature) {
            var gridcode = feature.properties.gridcode;
            var fillColor;

            if (gridcode === 0) {
                fillColor = 'purple'
            } else if (gridcode === 1) {
                fillColor = '#ffffb2';
            } else if (gridcode === 2) {
                fillColor = '#fecc5c';
            } else if (gridcode === 3) {
                fillColor = '#fd8d3c';
            } else if (gridcode === 4) {
                fillColor = '#f03b20';
            }
            return {
                color: '#000',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9,
                fillColor: fillColor
            };
        }
    });
});

// define the altmisLayer variable outside of the callback function
var altmisLayer;

$.getJSON('/static/ALTMIS_YAS_USTU_NUFUS.json', function (data) {
    // create a new GeoJSON layer and assign it to the suitabilityLayer variable
    altmisLayer = L.geoJSON(data, {
        style: function (feature) {
            var gridcode = feature.properties.gridcode;
            var fillColor;

            if (gridcode === 0) {
                fillColor = '#f2f0f7'
            } else if (gridcode === 1) {
                fillColor = '#dadaeb';
            } else if (gridcode === 2) {
                fillColor = '#bcbddc';
            } else if (gridcode === 3) {
                fillColor = '#9e9ac8';
            } else if (gridcode === 4) {
                fillColor = '#756bb1';
            } else if (gridcode === 5) {
                fillColor = '#54278f';
            }
            return {
                color: '#000',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.6,
                fillColor: fillColor
            };
        }
    });
});

// define the mahNufusLayer variable outside of the callback function
var mahNufusLayer;

$.getJSON('/static/Mah_Nufus.json', function (data) {
    console.log(data); // log the GeoJSON data
    // create a new GeoJSON layer and assign it to the suitabilityLayer variable
    mahNufusLayer = L.geoJSON(data, {
        style: function (feature) {
            var gridcode = feature.properties.gridcode;
            var fillColor;

            if (gridcode === 0) {
                fillColor = 'purple'
            } else if (gridcode === 1) {
                fillColor = 'black';
            } else if (gridcode === 2) {
                fillColor = 'yellow';
            } else if (gridcode === 3) {
                fillColor = 'red';
            } else if (gridcode === 4) {
                fillColor = 'orange';
            }
            return {
                color: '#000',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9,
                fillColor: fillColor
            };
        }
    });
});

// define the sesLayer variable outside of the callback function
var sesLayer;

$.getJSON('/static/SES.json', function (data) {
    console.log(data); // log the GeoJSON data
    // create a new GeoJSON layer and assign it to the suitabilityLayer variable
    sesLayer = L.geoJSON(data, {
        style: function (feature) {
            var gridcode = feature.properties.gridcode;
            var fillColor;

            if (gridcode === 0) {
                fillColor = 'purple'
            } else if (gridcode === 1) {
                fillColor = 'black';
            } else if (gridcode === 2) {
                fillColor = 'yellow';
            } else if (gridcode === 3) {
                fillColor = 'red';
            } else if (gridcode === 4) {
                fillColor = 'orange';
            }
            return {
                color: '#000',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9,
                fillColor: fillColor
            };
        }
    });
});

// define the sesLayer variable outside of the callback function
var mah_layer;

$.getJSON('/static/mah_layer.geojson', function (data) {
    console.log(data); // log the GeoJSON data
    // create a new GeoJSON layer and assign it to the suitabilityLayer variable
    mah_layer = L.geoJSON(data, {
        style: function (feature) {
            var gridcode = feature.properties.ILCEKN;
            var fillColor;
            if (gridcode === 1782) {
                fillColor = 'purple'
            }

            return {
                color: '#000',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9,
                fillColor: fillColor
            };
        }
    });
});

// create a custom control for the legend
var legend = L.control({position: 'bottomright'});

// get the toggle layer button element
var toggleLayerBtn = document.getElementById('toggle-layer');

var toggleCount = 0
// add an event listener to the button
toggleLayerBtn.addEventListener('click', function () {

    if (toggleCount == 0) {
        buttonContainerThird.style.top = "325px"
        buttonContainerSecond.style.left = "20px";
        toggleCount += 1
    } else if(buttonContainerThird.style.top == "325px") {
        console.log("1")
        buttonContainerSecond.style.left = "-60px"
        buttonContainerThird.style.top = "120px"
    } else{
        console.log("2")
        buttonContainerThird.style.top = "325px"
        buttonContainerSecond.style.left = "20px";
    }


    if (map.hasLayer(suitabilityLayer)) {
        // if the layer is currently visible, remove it from the map
        map.removeLayer(suitabilityLayer);
        map.removeControl(legend); // remove the legend control from the map
    } else {
        // if the layer is currently hidden, add it to the map
        try {
            map.removeLayer(ulasmayanLayer);
            map.removeLayer(altmisLayer);
            map.removeLayer(mahNufusLayer);
            map.removeLayer(sesLayer);
            map.removeControl(legend1);
            map.removeControl(legend2);
            map.removeControl(legend3);
            map.removeControl(legend4);
        } catch {
            console.log("Could not delete")
        }
        suitabilityLayer.addTo(map);
        // define the contents of the legend
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += '<h4 style="background-color:white; margin: 5px;text-decoration: underline;">Suitability Legend</h4>';
            div.innerHTML += '<i style="background-color: #F3F3E2; width: 10px; height: 10px; display: inline-block; border: 2px solid black;"></i><span style=" margin:2px;">Uygun Degil</span><br>';
            div.innerHTML += '<i style="background-color: #fff7bc; width: 10px; height: 10px; display: inline-block; border: 2px solid black;"></i><span style="margin:2px; padding:1px">Az Uygun</span><br>';
            div.innerHTML += '<i style="background-color: #fe9929; width: 10px; height: 10px; display: inline-block; border: 2px solid black;"></i><span style="margin:2px; padding:1px">Uygun</span><br>';
            div.innerHTML += '<i style="background-color: #ec7014; width: 10px; height: 10px; display: inline-block; border: 2px solid black;"></i><span style="margin:2px; padding:1px">Daha Uygun</span><br>';
            div.innerHTML += '<i style="background-color: #8c2d04; width: 10px; height: 10px; display: inline-block; border: 2px solid black;"></i><span style="margin:2px; padding:1px">En Uygun</span><br>';
            return div;
        };

        // add the legend control to the map
        legend.addTo(map); // add the legend control to the map
    }
});

// create a custom control for the legend
var legend1 = L.control({position: 'bottomright'});

// get the toggle layer button element
var toggleLayerBtn1 = document.getElementById('toggle-layer1');

// add an event listener to the button
toggleLayerBtn1.addEventListener('click', function () {
    if (map.hasLayer(ulasmayanLayer)) {
        // if the layer is currently visible, remove it from the map
        map.removeLayer(ulasmayanLayer);
        map.removeControl(legend1); // remove the legend control from the map
    } else {
        try {
            map.removeLayer(suitabilityLayer);
            map.removeLayer(altmisLayer);
            map.removeLayer(mahNufusLayer);
            map.removeLayer(sesLayer);
            map.removeControl(legend);
            map.removeControl(legend2);
            map.removeControl(legend3);
            map.removeControl(legend4);
        } catch {
            console.log("Could not delete")
        }
        // if the layer is currently hidden, add it to the map
        ulasmayanLayer.addTo(map);
        // define the contents of the legend
        legend1.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += '<h4 style="background-color:white; margin: 0;">Suitability Legend</h4>';
            div.innerHTML += '<i style="background-color: black; width: 10px; height: 10px; display: inline-block; "></i><span style=" margin:2px;">Uygun Değil</span><br>';
            div.innerHTML += '<i style="background-color: yellow; width: 10px; height: 10px; display: inline-block; "></i><span style=" margin:2px; padding:1px">Az Uygun</span><br>';
            div.innerHTML += '<i style="background-color: red; width: 10px; height: 10px; display: inline-block; "></i><span style="margin:2px; padding:1px">Uygun</span><br>';
            return div;
        };

        // add the legend control to the map
        legend1.addTo(map); // add the legend control to the map
    }
});

// create a custom control for the legend
var legend2 = L.control({position: 'bottomright'});

// get the toggle layer button element
var toggleLayerBtn2 = document.getElementById('toggle-layer2');

// add an event listener to the button
toggleLayerBtn2.addEventListener('click', function () {
    if (map.hasLayer(altmisLayer)) {
        // if the layer is currently visible, remove it from the map
        map.removeLayer(altmisLayer);
        map.removeControl(legend2); // remove the legend control from the map
    } else {
        try {
            map.removeLayer(ulasmayanLayer);
            map.removeLayer(suitabilityLayer);
            map.removeLayer(mahNufusLayer);
            map.removeLayer(sesLayer);
            map.removeControl(legend);
            map.removeControl(legend1);
            map.removeControl(legend3);
            map.removeControl(legend4);
        } catch {
            console.log("Could not delete")
        }
        // if the layer is currently hidden, add it to the map
        altmisLayer.addTo(map);
        // define the contents of the legend
        legend2.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += '<h4 style="background-color:white; margin: 0;">Suitability Legend</h4>';
            div.innerHTML += '<i style="background-color: black; width: 10px; height: 10px; display: inline-block; "></i><span style=" margin:2px;">Uygun Değil</span><br>';
            div.innerHTML += '<i style="background-color: yellow; width: 10px; height: 10px; display: inline-block; "></i><span style=" margin:2px; padding:1px">Az Uygun</span><br>';
            div.innerHTML += '<i style="background-color: red; width: 10px; height: 10px; display: inline-block; "></i><span style="margin:2px; padding:1px">Uygun</span><br>';
            return div;
        };

        // add the legend control to the map
        legend2.addTo(map); // add the legend control to the map
    }
});

// create a custom control for the legend
var legend3 = L.control({position: 'bottomright'});

// get the toggle layer button element
var toggleLayerBtn3 = document.getElementById('toggle-layer3');

// add an event listener to the button
toggleLayerBtn3.addEventListener('click', function () {
    if (map.hasLayer(mahNufusLayer)) {
        // if the layer is currently visible, remove it from the map
        map.removeLayer(mahNufusLayer);
        map.removeControl(legend3); // remove the legend control from the map
    } else {
        // if the layer is currently hidden, add it to the map
        try {
            map.removeLayer(ulasmayanLayer);
            map.removeLayer(altmisLayer);
            map.removeLayer(sesLayer);
            map.removeLayer(suitabilityLayer);
            map.removeControl(legend);
            map.removeControl(legend1);
            map.removeControl(legend2);
            map.removeControl(legend4);
        } catch {
            console.log("Could not delete")
        }
        mahNufusLayer.addTo(map);
        // define the contents of the legend
        legend3.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += '<h4 style="background-color:white; margin: 0;">Suitability Legend</h4>';
            div.innerHTML += '<i style="background-color: black; width: 10px; height: 10px; display: inline-block; "></i><span style=" margin:2px;">Uygun Değil</span><br>';
            div.innerHTML += '<i style="background-color: yellow; width: 10px; height: 10px; display: inline-block; "></i><span style=" margin:2px; padding:1px">Az Uygun</span><br>';
            div.innerHTML += '<i style="background-color: red; width: 10px; height: 10px; display: inline-block; "></i><span style="margin:2px; padding:1px">Uygun</span><br>';
            return div;
        };

        // add the legend control to the map
        legend3.addTo(map); // add the legend control to the map
    }
});

// create a custom control for the legend
var legend4 = L.control({position: 'bottomright'});

// get the toggle layer button element
var toggleLayerBtn4 = document.getElementById('toggle-layer4');

// add an event listener to the button
toggleLayerBtn4.addEventListener('click', function () {
    if (map.hasLayer(sesLayer)) {
        // if the layer is currently visible, remove it from the map
        map.removeLayer(sesLayer);
        map.removeControl(legend4); // remove the legend control from the map
    } else {
        // if the layer is currently hidden, add it to the map
        try {
            map.removeLayer(ulasmayanLayer);
            map.removeLayer(altmisLayer);
            map.removeLayer(mahNufusLayer);
            map.removeLayer(suitabilityLayer);
            map.removeControl(legend);
            map.removeControl(legend1);
            map.removeControl(legend2);
            map.removeControl(legend3);
        } catch {
            console.log("Could not delete")
        }
        sesLayer.addTo(map);
        // define the contents of the legend
        legend4.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += '<h4 style="background-color:white; margin: 0;">Suitability Legend</h4>';
            div.innerHTML += '<i style="background-color: black; width: 10px; height: 10px; display: inline-block; "></i><span style=" margin:2px;">Uygun Değil</span><br>';
            div.innerHTML += '<i style="background-color: yellow; width: 10px; height: 10px; display: inline-block; "></i><span style=" margin:2px; padding:1px">Az Uygun</span><br>';
            div.innerHTML += '<i style="background-color: red; width: 10px; height: 10px; display: inline-block; "></i><span style="margin:2px; padding:1px">Uygun</span><br>';
            return div;
        };

        // add the legend control to the map
        legend4.addTo(map); // add the legend control to the map
    }
});

// create a custom control for the legend
var legend5 = L.control({position: 'bottomright'});

// get the toggle layer button element
var toggleLayerBtn5 = document.getElementById('toggle-layer5');

// add an event listener to the button
toggleLayerBtn5.addEventListener('click', function () {
    if (map.hasLayer(mah_layer)) {
        // if the layer is currently visible, remove it from the map
        map.removeLayer(mah_layer);
        map.removeControl(legend5); // remove the legend control from the map
    } else {
        // if the layer is currently hidden, add it to the map
        try {
            map.removeLayer(ulasmayanLayer);
            map.removeLayer(altmisLayer);
            map.removeLayer(mahNufusLayer);
            map.removeLayer(suitabilityLayer);
            map.removeControl(legend);
            map.removeControl(legend1);
            map.removeControl(legend2);
            map.removeControl(legend3);
        } catch {
            console.log("Could not delete")
        }
        mah_layer.addTo(map);
        // define the contents of the legend
        legend5.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += '<h4 style="background-color:white; margin: 0;">Suitability Legend</h4>';
            div.innerHTML += '<i style="background-color: black; width: 10px; height: 10px; display: inline-block; "></i><span style=" margin:2px;">Uygun Değil</span><br>';
            div.innerHTML += '<i style="background-color: yellow; width: 10px; height: 10px; display: inline-block; "></i><span style=" margin:2px; padding:1px">Az Uygun</span><br>';
            div.innerHTML += '<i style="background-color: red; width: 10px; height: 10px; display: inline-block; "></i><span style="margin:2px; padding:1px">Uygun</span><br>';
            return div;
        };

        // add the legend control to the map
        legend5.addTo(map); // add the legend control to the map
    }
});

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
        edit: false
    },
    draw: {
        polygon: false,
        circle: false,
        marker: {
            icon: new L.Icon.Default(),
            repeatMode: true
        },
        circlemarker: false,
        rectangle: false,
        polyline: false
    }
});

map.addControl(drawControl);

var addMarkerPopup = document.getElementById('add-marker-popup')
var popupAddButton = document.getElementById('add-button')
var popupCancelButtonAdd = document.getElementById('cancel-button-add')

let locationValuesList = [];
let addedLayers = []

map.on('draw:created', function (e) {

    addMarkerPopup.style.display = "block"
    darkScreen.style.display = "block"
    var type = e.layerType,
        layer = e.layer;
    popupAddButton.addEventListener('click', function () {
        preLoader.style.display = "block"
        if (type === 'marker') {
            // Do something with the marker here, e.g. send it to the server
            var latlng = layer.getLatLng();
            // var locationValue = prompt("Please enter the location value:", "");
            var locationValue = document.getElementById('add-input').value;
            darkScreen.style.display = "none"
            $.ajax({
                url: '/save-points',
                type: 'POST',
                data: JSON.stringify({points: layer.toGeoJSON()}),
                contentType: 'application/json',
                dataType: 'json',
                success: function (response) {
                    addedLayer = L.geoJSON(response).addTo(map);
                    addedLayers.push(addedLayer);
                    var newRow = '<tr>' +
                        '<td>' + response['id'] + '</td>' +
                        '<td>' + locationValue + '</td>' +
                        '<td>' + latlng.lat.toFixed(6) + '</td>' +
                        '<td>' + latlng.lng.toFixed(6) + '</td>' +
                        '<td>' + response.gridcode + '</td>' +
                        '<td>' + response.suitability + '</td>' +
                        '<td>' + response.mahalle_ad + '</td>' +
                        '<td>' + response.ilce_ad + '</td>' +
                        '<td>' + response.ses_segment + '</td>' +
                        '<td>' + response.nufus + '</td>' +
                        '<td>' + response.yapi_nufus + '</td>' +
                        '<td>' + response.yapi_sayisi + '</td>' +
                        '<td>' + response.potansiyel_satis + '</td>' +
                        '</tr>';
                    $('#marker-table tbody').append(newRow);

                    // Add the properties to the marker popup
                    layer.bindPopup(
                        '<b class="popup-el">Lokasyon:</b> ' + locationValue +
                        '<br><b class="popup-el">Enlem:</b> ' + latlng.lat.toFixed(6) +
                        '<br><b class="popup-el">Boylam:</b> ' + latlng.lng.toFixed(6) +
                        '<br><b class="popup-el">Id:</b> ' + response['id'] +
                        '<br><b class="popup-el">Gridcode:</b> ' + response['gridcode'] +
                        '<br><b class="popup-el">Uygunluk:</b> ' + response['suitability'] +
                        '<br><b class="popup-el">Mahalle:</b> ' + response['mahalle_ad'] +
                        '<br><b class="popup-el">İlçe:</b> ' + response['ilce_ad'] +
                        '<br><b class="popup-el">Ses Segment:</b> ' + response['ses_segment'] +
                        '<br><b class="popup-el">Mahalle Nüfus:</b> ' + response['nufus'] +
                        '<br><b class="popup-el">Erişilebilir Nüfus:</b> ' + response['yapi_nufus'] +
                        '<br><b class="popup-el">Erişilebilir Yapı Sayısı:</b> ' + response['yapi_sayisi'] +
                        '<br><b class="popup-el">Potansiyel Satış:</b> ' + response['potansiyel_satis'] + '<ion-icon name="information-circle-sharp" style="cursor:pointer" id="potential-sale-info"></ion-icon>' +
                        '<br><a href="https://www.google.com/maps?layer=c&cbll=' +
                        String(latlng.lat.toFixed(6)) + ',' + String(latlng.lng.toFixed(6)) + '" target="blank"><img id="google-street-view-pic" src="https://images2.imgbox.com/54/82/bXyXnV9Z_o.png" ></a>')
                    gridcodeValue = isNaN(parseFloat(response['gridcode'])) ? 0 : response['gridcode'];
                    locationValuesList.push(parseFloat(gridcodeValue));
                    var els = document.getElementById("marker-table").getElementsByTagName("tr");
                    addInput.value = ""

                    drawnItems.getLayers().forEach(function (marker) {
                        marker.on('click', function (event) {
                            current_lat = marker._latlng.lat.toFixed(6)
                            current_lng = marker._latlng.lng.toFixed(6)
                            $('#marker-table tbody tr').each(function (index, row) {
                                index += 1

                                if (current_lat === $(row).find('td:eq(2)').text() && current_lng === $(row).find('td:eq(3)').text()) {
                                    for (var i = 0; i <= drawnItems.getLayers().length; i++) {
                                        if (i === 0) {
                                            continue
                                        } else if (i === index) {
                                            els[index].style.background = "#cad7d7";
                                        } else {
                                            if (i % 2 === 0) {

                                                els[i].style.background = "#ffffff";
                                            } else if (i % 2 === 1) {
                                                els[i].style.background = "#ffffff";
                                            }
                                        }
                                    }
                                }
                            })
                        });
                    });
                    type = []
                    layer = []
                },
                error: function (error) {
                    console.log("fail_return_log", error);
                }
            });
        }
        addMarkerPopup.style.display = "none"
        setTimeout(function() {
            preLoader.style.display = 'none';
        }, 2250);
    })

        popupCancelButtonAdd.addEventListener('click', function () {
        // Handle the case when the layer type is not 'marker'
        layer = null; // Set layer to null to prevent adding it to drawnItems
    })


    // Define a custom control for the compare button
    var compareButton = L.Control.extend({
        options: {
            position: 'topright'
        },

        onAdd: function (map) {
            // Check if the button has already been added to the map
            if (map.compareButton) {
                return map.compareButton;
            }

            // Create the button
            var button = L.DomUtil.create('button', 'compare-button');
            button.innerHTML = 'Karşılaştır';
            L.DomEvent.on(button, 'click', this._onClick, this);

            // Add the custom CSS style
            button.style.backgroundColor = 'green';
            button.style.color = 'white';
            button.style.padding = '10px 20px';
            button.style.fontSize = '16px';
            button.style.border = 'none';
            button.style.borderRadius = '30px';
            button.style.cursor = 'pointer';
            button.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.4)';
            button.style.transition = 'all 0.3s ease-in-out';

            // Add an animation on hover
            button.addEventListener('mouseenter', function () {
                button.style.transform = 'scale(1.1)';
                button.style.backgroundColor = 'linear-gradient(45deg, #FF8C00, #FF0080)';
            });

            button.addEventListener('mouseleave', function () {
                button.style.transform = 'scale(1)';
                button.style.backgroundColor = 'linear-gradient(45deg, #FF0080, #FF8C00)';
            });
            // Save the button instance to the map object
            map.compareButton = button;

            return button;
        },

        _onClick: function () {
            // Find the highest value in locationValuesList

            var highestValue = Math.max.apply(Math, locationValuesList);
            if (highestValue > 0) {

                // Loop through each layer in the drawnItems feature group
                drawnItems.eachLayer(function (layer) {
                    // Check if the layer is a marker
                    if (layer instanceof L.Marker) {
                        // Get the location value from the marker's popup content
                        var popupContent = layer.getPopup().getContent();

                        var locationValue = parseFloat(popupContent.split('<b>Gridcode:</b> ')[1]);

                        layer.setIcon(new L.Icon({
                            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                            iconSize: [25, 41],
                        }));

                        // If the location value matches the highest value, add a custom marker icon
                        if (locationValue === highestValue) {
                            var marker = layer.setIcon(new L.Icon({
                                iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
                                iconSize: [64, 64],
                                iconAnchor: [32, 64],
                                popupAnchor: [0, -56]
                            }));
                            marker.bindTooltip('Bu bölge diğerlerine göre daha uygun: ' + locationValue);
                            marker.addTo(map);
                            setTimeout(function () {
                                marker.openTooltip();
                            }, 100);
                        }
                    }
                });
            } else if (highestValue === 0) {
                alert("Uygun alan yok!");
            } else {
                alert("İşaretçiler sınır dışında!")
            }
        }
    });
    map.addControl(new compareButton());
    drawnItems.addLayer(layer);
});

popupCancelButtonAdd.addEventListener('click', function () {
    deleteClickManage()
    addMarkerPopup.style.display = "none"
    darkScreen.style.display = "none"
});

// Add a click event listener to the button
var deleteLastFeatureButton = document.getElementById('delete-last-feature');

// Add a click event listener to the button
deleteLastFeatureButton.addEventListener('click', function () {
    // Check if there are any markers or layers remaining
    if (drawnItems.getLayers().length > 0 && addedLayers.length > 0) {
        // Remove the last marker from the map and from drawnItems
        var currentMarker = drawnItems.getLayers().pop();
        drawnItems.removeLayer(currentMarker);

        // Remove the last layer from the map
        var lastLayer = addedLayers.pop();
        map.removeLayer(lastLayer);

        // Remove the last row from the table
        $('#marker-table tbody tr:last').remove();
    }
});

var isClickManageActive = false;
var deleteSelectedFeatureButton = document.getElementById('delete-selected-feature');
checkerDeleteSelectedFeature = 0;
// Add a click event listener to the button
deleteSelectedFeatureButton.addEventListener('click', function () {
    checkerDeleteSelectedFeature += 1

    if (checkerDeleteSelectedFeature % 2 === 1) {
        deleteSelectedFeatureButton.style.backgroundColor = "green"
        deleteSelectedFeatureButton.style.color = "white"
        clickManage()
    } else {
        isClickManageActive = false;
        deleteSelectedFeatureButton.style.backgroundColor = "#F0F0F0"
        deleteSelectedFeatureButton.style.color = "black"
        deleteSelectedFeatureButton.style.fontSize = "18px";
    }
});

var isDeleteClickManageActive = false;
var count = 0;

function deleteClickManage() {
    isDeleteClickManageActive = true;

    if (drawnItems.getLayers().length > 0) {
    var currentMarker = drawnItems.getLayers()[drawnItems.getLayers().length - 1];


    drawnItems.removeLayer(currentMarker);
    }else{
        console.log("pass")
    }
}

var isClickManageActive = false;

function clickManage() {
    isClickManageActive = true;
    deleteSelectedFeatureButton.style.backgroundColor = "#008000";
    deleteSelectedFeatureButton.style.color = "white";

    // Add markers to the map
    drawnItems.getLayers().forEach(function (marker) {
        // Attach a click event listener to each marker
        marker.on('click', function (event) {
            if (isClickManageActive) {
                for (var i = 0; i < drawnItems.getLayers().length; i++) {
                    console.log(drawnItems.getLayers()[i]._latlng)
                    if (marker._latlng === drawnItems.getLayers()[i]._latlng) {
                        // Perform any desired actions when a marker is clicked
                        var currentMarker = drawnItems.getLayers()[i]
                        var selectedMarkerOfLayer = addedLayers.splice(i, 1)[0];
                        drawnItems.removeLayer(currentMarker);
                        map.removeLayer(selectedMarkerOfLayer)
                        locationValuesList.splice(i, 1);
                        var tableBody = document.querySelector("#marker-table tbody");
                        var rows = tableBody.getElementsByTagName("tr");

                        if (i >= 0 && i < rows.length) {
                            var rowToRemove = rows[i];
                            rowToRemove.remove();
                        }
                    }
                }
            } else {
                deleteSelectedFeatureButton.style.backgroundColor = "F0F0F0"
                deleteSelectedFeatureButton.style.color = "black"
            }
        });
    });
}

// Get the "Delete All Layers" button element

var deletePopup = document.getElementById('all-items-delete-popup')
var PopupDeleteButton = document.getElementById('delete-button')
var PopupCancelButtonDelete = document.getElementById('cancel-button-delete')
var deleteButton = document.getElementById('delete-features');

// Add a click event listener to the button
deleteButton.addEventListener('click', function () {
    if (deletePopup.style.display == 'block') {
        deletePopup.style.display = 'none'
    } else {
        deletePopup.style.display = 'block'
        darkScreen.style.display = 'block'
    }

});

PopupDeleteButton.addEventListener('click', function () {
    // Clear all layers from the drawnItems feature group

    drawnItems.clearLayers();
    // Loop through the addedLayers array and remove each layer from the map
    addedLayers.forEach(function (layer) {
        map.removeLayer(layer);
    });
    // Clear the addedLayers array
    addedLayers = [];
    // Delete all rows in #marker-table tbody
    $('#marker-table tbody tr').remove();
    deletePopup.style.display = 'none'
    darkScreen.style.display = 'none'
})

PopupCancelButtonDelete.addEventListener('click', function () {
    deletePopup.style.display = 'none'
    darkScreen.style.display = 'none'
});

function saveData() {
    var csv = "ID, LOKASYON, ENLEM, BOYLAM, GRIDCODE, UYGUNLUK, MAHALLE, ILCE, SES_SEGMENT, NUFUS, YAPI_NUFUS, YAPI_SAYISI, POTALSIYEL_SATIS\n";
    $('#marker-table tbody tr').each(function (index, row) {
        // Do something with the row, for example:
        csv += $(row).find('td:first').text() + "," + $(row).find('td:eq(1)').text() + ","
            + $(row).find('td:eq(2)').text() + "," + $(row).find('td:eq(3)').text()
            + "," + $(row).find('td:eq(4)').text() + "," + $(row).find('td:eq(5)').text()
            + "," + $(row).find('td:eq(6)').text() + "," + $(row).find('td:eq(7)').text()
            + "," + $(row).find('td:eq(8)').text() + "," + $(row).find('td:eq(9)').text()
            + "," + $(row).find('td:eq(10)').text() + "," + $(row).find('td:eq(11)').text()
            + "," + $(row).find('td:eq(12)').text() + "," + $(row).find('td:eq(13)').text()
        csv += "\n"
    });
    // Prompt the user to download the CSV file
    var link = document.createElement('a');
    link.download = 'markers.txt';
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById("save-features").addEventListener("click", saveData);