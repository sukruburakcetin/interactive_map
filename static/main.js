var menuBtn = document.getElementById('menu')

var darkScreen = document.getElementById('dark-screen')

var whiteScreen = document.getElementById('white-screen')

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
searchInput.addEventListener('click', function () {
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
            // console.log(response);
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
        } catch (e) {
            alert("Adres giriniz!")

        }
    }
}

buttonClearAddress.addEventListener('click', function () {
    resultContainer.style.display = "none"
    searchInput.value = ""
})

var scrollCheck = 0

function scrollMenu() {
    if (scrollCheck === 0) {
        buttonContainerFirst.style.left = "1px";
        buttonContainerThird.style.left = "1px";
        scrollCheck += 1
    } else if (buttonContainerFirst.style.left === "-60px" && buttonContainerThird.style.top === "120px") {
        // console.log("1")
        buttonContainerFirst.style.left = "1px";
        buttonContainerThird.style.left = "1px";
    } else if (buttonContainerFirst.style.left === "-60px" && buttonContainerThird.style.top !== "120px") {
        // console.log("2")
        buttonContainerFirst.style.left = "1px";
        buttonContainerThird.style.top = "120px"
        buttonContainerThird.style.left = "1px";
    } else {
        // console.log("3")
        buttonContainerFirst.style.left = "-60px"
        buttonContainerSecond.style.left = "-60px"
        buttonContainerThird.style.left = "-60px";

        try {
            map.removeLayer(suitabilityLayer)
            map.removeLayer(iheSubelerLayer);
            map.removeLayer(altmisLayer);
            map.removeControl(legend1);
            map.removeControl(legend2);

        } catch {
            // console.log("Could not delete")
        }
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
var tableContainer = document.getElementById('table-container')
var checkershowTableBtn = 0
showTableBtn.addEventListener('click', function () {

    markerTable.classList.toggle('show');
    checkershowTableBtn += 1

    if (checkershowTableBtn % 2 === 1) {
        showTableBtn.style.backgroundColor = "green"
        showTableBtn.style.color = "white"
        tableContainer.style.display = "block"
    } else {
        showTableBtn.style.backgroundColor = "#F0F0F0"
        showTableBtn.style.color = "black"
        showTableBtn.style.fontSize = "18px";
        tableContainer.style.display = "none"
    }
});

var tableId = document.getElementById('marker-table');
var tBody = tableId.getElementsByTagName('tbody')[0];
var tHead = tableId.getElementsByTagName('thead')[0];

var tutorialButtonChecker = 0;

var tutorialBtn = document.getElementById('activate-tutorials')

var deleteSelectedFeatureButton = document.getElementById('delete-selected-feature');
tutorialBtn.addEventListener('click', function () {
    if (tutorialButtonChecker % 2 === 0) {
        tutorialBtn.style.backgroundColor = "green"
        tutorialBtn.style.color = "white"
        tutorialButtonChecker += 1;
    } else if (deleteSelectedFeatureButton.style.backgroundColor === "green") {
        tutorialGifContainerDsf.style.display = "block"
    } else {
        tutorialBtn.style.backgroundColor = "#F0F0F0"
        tutorialBtn.style.color = "black"
        tutorialBtn.style.fontSize = "18px";
        tutorialButtonChecker += 1;
    }

})


tBody.addEventListener("mouseover", function () {
    tBody.style.overflowY = "scroll"
    tHead.style.width = "98%"
})

tBody.addEventListener("mouseout", function () {
    tBody.style.overflowY = "hidden"
    tHead.style.width = "100%"
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

$.getJSON('/static/data/ihe_uygunluk.geojson', function (data) {
    // console.log(data); // log the GeoJSON data
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

// define the iheSubelerLayer variable outside of the callback function
var iheSubelerLayer;

const geojsonMarkerOptions = {
    radius: 8,
    fillColor: '#ff7800',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}

const ihe_sube_markers = L.markerClusterGroup();

$.getJSON('/static/data/ihe_subeler.geojson', function (data) {
    console.log(data);
    // create a new GeoJSON layer and assign it to the suitabilityLayer variable
    iheSubelerLayer = L.geoJSON(data, {
        onEachFeature: function (feature, layer) {
            const popupContent =
                '<h4 class = "text-primary">BÜFE BİLGİLERİ</h4>' +
                '<div class="container"><table class="table table-striped">' +
                "<thead><tr><th>ÖZELLİK</th><th>ÖZELLİK DEĞERİ</th></tr></thead>" +
                "<tbody><tr><td> İSİM: </td><td>" +
                feature.properties.NAME +
                "</td></tr>" +
                "<tr><td>İLÇE: </td><td>" +
                feature.properties.ILCE +
                "</td></tr>" +
                "<tr><td> MAHALLE: </td><td>" +
                feature.properties.MAHALLE +
                "</td></tr>" +
                "<tr><td> TOPLAM İŞYERİ: </td><td>" +
                feature.properties.TOPLAM_ISY +
                "</td></tr>" +
                "<tr><td> TOPLAM KİŞİ: </td><td>" +
                feature.properties.TOPLAM_KIS +
                "</td></tr>" +
                "<tr><td> TOPLAM KONUT: </td><td>" +
                feature.properties.TOPLAM_KON +
                "</td></tr>" +
                "<tr><td> TOPLAM YAPI: </td><td>" +
                feature.properties.TOPLAM_YAP +
                "</td></tr>";
            layer.bindPopup(popupContent);
        },
        pointToLayer: function (feature, latlng) {
            return ihe_sube_markers.addLayer(L.circleMarker(latlng, geojsonMarkerOptions))
        },
    });
});

// define the altmisLayer variable outside of the callback function
var altmisLayer;

$.getJSON('/static/data/mahalle_bilgileri.geojson', function (data) {
    // console.log("mah_nufus:", data);
    // create a new GeoJSON layer and assign it to the suitabilityLayer variable
    altmisLayer = L.geoJSON(data, {
        style: function (feature) {
            var nufus = feature.properties.NUFUS;
            // console.log("nufus:", nufus)
            var fillColor;
            if (nufus === null) {
                nufus = 0;
            }
            else{

                if (parseInt(nufus) <= 6816) {
                    fillColor = '#FFFFCC'
                }
                else if (parseInt(nufus) <= 16828) {
                    fillColor = '#FEE187';
                }
                else if (parseInt(nufus) <= 27580) {
                    fillColor = '#FEAB49';
                }
                else if (parseInt(nufus) <= 40383) {
                    fillColor = '#FC5B2E';
                }
                else if (parseInt(nufus) <= 59083) {
                    fillColor = '#D41020';
                }
                else if (parseInt(nufus) <= 111646) {
                    fillColor = '#800026';
                }
                else{
                }
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

// create a custom control for the legend
var legend = L.control({position: 'bottomright'});

// get the toggle layer button element
var toggleLayerBtn = document.getElementById('toggle-layer');

var toggleCount = 0
// add an event listener to the button
toggleLayerBtn.addEventListener('click', function () {

    if (toggleCount === 0) {
        buttonContainerThird.style.top = "200px"
        buttonContainerSecond.style.left = "20px";
        toggleCount += 1
        if (!map.hasLayer(suitabilityLayer)) {
            suitabilityLayer.addTo(map);

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
    } else if (buttonContainerThird.style.top === "200px") {
        // console.log("1")
        buttonContainerSecond.style.left = "-60px"
        buttonContainerThird.style.top = "120px"
        if (map.hasLayer(suitabilityLayer)) {
            // console.log("3")
            map.removeLayer(suitabilityLayer);
            map.removeControl(legend);
        }
    } else {
        // console.log("2")
        buttonContainerThird.style.top = "200px"
        buttonContainerSecond.style.left = "20px";
        if (!map.hasLayer(suitabilityLayer)) {
            suitabilityLayer.addTo(map);

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
    }

    try {
        map.removeLayer(iheSubelerLayer);
        map.removeLayer(altmisLayer);
        map.removeControl(legend1);
        map.removeControl(legend2);

    } catch {
        // console.log("Could not delete")
    }
});

// create a custom control for the legend
var legend1 = L.control({position: 'bottomright'});

// get the toggle layer button element
var toggleLayerBtn1 = document.getElementById('toggle-layer1');

// add an event listener to the button
toggleLayerBtn1.addEventListener('click', function () {
    if (map.hasLayer(iheSubelerLayer)) {
        // if the layer is currently visible, remove it from the map
        map.removeLayer(iheSubelerLayer);
        map.removeControl(legend1); // remove the legend control from the map
    } else {
        try {
            map.removeLayer(suitabilityLayer);
            map.removeLayer(altmisLayer);
            map.removeControl(legend);
            map.removeControl(legend2);

        } catch {
            // console.log("Could not delete")
        }
        // if the layer is currently hidden, add it to the map
        iheSubelerLayer.addTo(map);
        map.addLayer(ihe_sube_markers);

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
            map.removeLayer(iheSubelerLayer);
            map.removeLayer(suitabilityLayer);
            map.removeControl(legend);
            map.removeControl(legend1);

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

var legendMarkers;
var addMarkerPopup = document.getElementById('add-marker-popup')
var popupAddButton = document.getElementById('add-button')
var popupCancelButtonAdd = document.getElementById('cancel-button-add')

let locationValuesList = [];
let addedLayers = []

map.on('draw:created', function (e) {

    addMarkerPopup.style.display = "block"
    whiteScreen.style.display = "block"
    var type = e.layerType,
        layer = e.layer;
    popupAddButton.addEventListener('click', function () {
        preLoader.style.display = "block"
        if (type === 'marker') {
            // Do something with the marker here, e.g. send it to the server
            var latlng = layer.getLatLng();
            // var locationValue = prompt("Please enter the location value:", "");
            var locationValue = document.getElementById('add-input').value;
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
                        '<td>' + response.ilce_ihe_bufe_sayisi + '</td>' +
                        '<td>' + response.mahalle_ihe_bufe_sayisi + '</td>' +
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
                        '<br><b class="popup-el">İlçe İhe Büfe Sayısı:</b> ' + response['ilce_ihe_bufe_sayisi'] +
                        '<br><b class="popup-el">Mahalle İhe Büfe Sayısı:</b> ' + response['mahalle_ihe_bufe_sayisi'] +
                        '<br><button id="potential-sale-info" onclick="showInfo()"><ion-icon name="information-circle-sharp" style="cursor:pointer" ></ion-icon></button>' + '<b class="popup-el">Potansiyel Satış:</b> ' + response['potansiyel_satis'] +
                        '<br><b class="popup-el">Adres:</b> ' + response['adres'] +
                        '<br><a href="https://www.google.com/maps?layer=c&cbll=' +
                        String(latlng.lat.toFixed(6)) + ',' + String(latlng.lng.toFixed(6)) + '" target="blank"><img id="google-street-view-pic" src="https://images2.imgbox.com/54/82/bXyXnV9Z_o.png" ></a>'
                    );


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


            whiteScreen.style.display = "none"
        }

        addMarkerPopup.style.display = "none"
        setTimeout(function () {
            preLoader.style.display = 'none';
        }, 2250);
    })


    popupCancelButtonAdd.addEventListener('click', function () {
        // Handle the case when the layer type is not 'marker'
        layer = null; // Set layer to null to prevent adding it to drawnItems
        whiteScreen.style.display = "none"
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


            if (legendMarkers) {
                // Remove the existing legend control from the map
                map.removeControl(legendMarkers);
            }
            var highestValue = Math.max.apply(Math, locationValuesList);
            // console.log("highest", highestValue)
            if (highestValue > 0) {
                var totalMarkerCount = locationValuesList.length
                var colorIncrementFactor = parseInt(256 / totalMarkerCount)
                // console.log("colorInFac", colorIncrementFactor)
                locationValuesList.sort(function (a, b) {
                    return a - b;
                });

                // console.log("locationvaluelist:", locationValuesList)

                // Loop through each layer in the drawnItems feature group
                drawnItems.eachLayer(function (layer) {
                    // Check if the layer is a marker
                    if (layer instanceof L.Marker) {
                        // Get the location value from the marker's popup content
                        var popupContent = layer.getPopup().getContent();

                        var locationValue = parseFloat(popupContent.split('<b class="popup-el">Gridcode:</b> ')[1]);

                        layer.setIcon(new L.Icon({
                            iconUrl: 'https://images2.imgbox.com/a5/a6/MlVf9aUS_o.png',
                            iconSize: [25, 41],
                            className: 'custom-icon'
                        }));

                        var currentIndex = locationValuesList.indexOf(locationValue) + 1
                        // console.log("currentIndex", currentIndex)
                        var customIcon = layer._icon;
                        customIcon.style.backgroundColor = `rgb(255, ${255 - (currentIndex * colorIncrementFactor)}, 0)`
                        customIcon.style.borderRadius = "50px";

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

            legendMarkers = L.control({position: 'bottomright'});

            legendMarkers.onAdd = function (map) {
                var div = L.DomUtil.create('div');
                div.innerHTML += '<h4 style="background-color:white; margin: 5px;text-decoration: underline;">Konum Uygunluk Değeri</h4>';
                div.innerHTML += '<div style="background: rgb(255,255,0); background: linear-gradient(0deg, rgba(255,255,0,1) 0%, rgba(255,0,0,1) 100%); width: 20px; height: 100px; display: inline-block; border: 2px solid black;"></div>' +
                    '<span style="position:absolute; font-size: 22px; margin-left: 5px; margin-top: -5px">5</span>' +
                    '<span style=" margin-left:5px; font-size: 22px;">1</span><br>';

                return div;
            };

            // add the legend control to the map
            legendMarkers.addTo(map); // add the legend control to the map
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

var tutorialGifContainerDsf = document.getElementById('tutorial-gif-container');
var closeGifButton = document.getElementById("close-gif-button")

closeGifButton.addEventListener("click", function () {
    darkScreen.style.display = "none";
    tutorialGifContainerDsf.style.display = "none";
    deleteSelectedFeatureButton.style.backgroundColor = "#F0F0F0"
    deleteSelectedFeatureButton.style.color = "black"
    deleteSelectedFeatureButton.style.fontSize = "18px";
})

var isClickManageActive = false;
checkerDeleteSelectedFeature = 0;
// Add a click event listener to the button
deleteSelectedFeatureButton.addEventListener('click', function () {

    // if (deleteSelectedFeatureButton.style.backgroundColor == "green") {
    //     deleteSelectedFeatureButton.style.backgroundColor = "#F0F0F0"
    //     deleteSelectedFeatureButton.style.color = "black"
    //     deleteSelectedFeatureButton.style.fontSize = "18px";
    // } else {
    //     deleteSelectedFeatureButton.style.backgroundColor = "green"
    //     deleteSelectedFeatureButton.style.color = "white"
    // }

    if (checkerDeleteSelectedFeature % 2 === 0) {
        if (tutorialButtonChecker % 2 === 0) {
            clickManage()
            checkerDeleteSelectedFeature += 1
        } else {
            tutorialGifContainerDsf.style.display = 'block';
            darkScreen.style.display = 'block'
            deleteSelectedFeatureButton.style.backgroundColor = "green"
            deleteSelectedFeatureButton.style.color = "white"
        }


    } else {
        isClickManageActive = false;
        deleteSelectedFeatureButton.style.backgroundColor = "#F0F0F0"
        deleteSelectedFeatureButton.style.color = "black"
        deleteSelectedFeatureButton.style.fontSize = "18px";
        checkerDeleteSelectedFeature += 1
    }
});

var isDeleteClickManageActive = false;
var count = 0;

function deleteClickManage() {
    isDeleteClickManageActive = true;
    checkerDeleteSelectedFeature += 1
    if (drawnItems.getLayers().length > 0) {
        var currentMarker = drawnItems.getLayers()[drawnItems.getLayers().length - 1];


        drawnItems.removeLayer(currentMarker);
    } else {
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
                    // console.log(drawnItems.getLayers()[i]._latlng)
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
    if (deletePopup.style.display === 'block') {
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
    var csv = "ID, LOKASYON, ENLEM, BOYLAM, GRIDCODE, UYGUNLUK, MAHALLE, ILCE, SES_SEGMENT, NUFUS, YAPI_NUFUS, YAPI_SAYISI, ILCE_IHE_BUFE_SAYISI, MAHALLE_IHE_BUFE_SAYISI, POTALSIYEL_SATIS\n";
    $('#marker-table tbody tr').each(function (index, row) {
        // Do something with the row, for example:
        csv += $(row).find('td:first').text() + "," + $(row).find('td:eq(1)').text() + ","
            + $(row).find('td:eq(2)').text() + "," + $(row).find('td:eq(3)').text()
            + "," + $(row).find('td:eq(4)').text() + "," + $(row).find('td:eq(5)').text()
            + "," + $(row).find('td:eq(6)').text() + "," + $(row).find('td:eq(7)').text()
            + "," + $(row).find('td:eq(8)').text() + "," + $(row).find('td:eq(9)').text()
            + "," + $(row).find('td:eq(10)').text() + "," + $(row).find('td:eq(11)').text()
            + "," + $(row).find('td:eq(12)').text() + "," + $(row).find('td:eq(13)').text()
            + "," + $(row).find('td:eq(14)').text() + "," + $(row).find('td:eq(15)').text()
            + "," + $(row).find('td:eq(16)').text() + "," + $(row).find('td:eq(17)').text()
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

var potentialInfo = document.getElementById("potential-info")

function showInfo() {
    potentialInfo.style.display = "block";
    darkScreen.style.display = "block";
}

function closePotentialInfo() {
    potentialInfo.style.display = "none";
    darkScreen.style.display = "none"
}

document.getElementById("save-features").addEventListener("click", saveData);