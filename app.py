import requests
from flask import Flask, render_template, request, jsonify
from shapely import Point
from shapely.geometry import shape

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/save-points", methods=["POST"])
def save_points():
    # Get the points data from the AJAX request
    points = request.json.get('points')
    print(points)  # do something with the points data here
    # center point provided by the user
    point = Point(points['geometry']['coordinates'][0], points['geometry']['coordinates'][1])
    # Create a buffer around the Point object with a radius of 20 meters
    polygon = point.buffer(0.0002)  # 0.0002 is roughly equivalent to 20 meters
    url = 'https://raw.githubusercontent.com/sukruburakcetin/interactive_map/main/static/kres_uygunluk.geojson'
    kres_uygunluk_geojson = requests.get(url).json()
    for i in range(0, len(kres_uygunluk_geojson['features'])):
        current_kres_uygunluk_shape = shape(kres_uygunluk_geojson['features'][i]['geometry'])
        if polygon.within(current_kres_uygunluk_shape):
            print(kres_uygunluk_geojson['features'][i]['properties']['ID'])
            print(kres_uygunluk_geojson['features'][i]['properties']['GRIDCODE'])
            # Convert the Shapely Polygon object to a GeoJSON Feature object
            feature = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [list(polygon.exterior.coords)]
                },
                'id': kres_uygunluk_geojson['features'][i]['properties']['ID'],
                'gridcode': kres_uygunluk_geojson['features'][i]['properties']['GRIDCODE'],
                'suitability': kres_uygunluk_geojson['features'][i]['properties']['UYGUNLUK_D']
            }
            # Return the GeoJSON Feature object as a JSON response
    return jsonify(feature)


    # url = 'https://raw.githubusercontent.com/sukruburakcetin/interactive_map/main/static/fatih.geojson'
    # faith_geojson = requests.get(url).json()
    # faith_shape = shape(faith_geojson['features'][0]['geometry'])
    # if polygon.within(faith_shape):
    #     print('Polygon is within the Faith GeoJSON boundaries')
    #     # Convert the Shapely Polygon object to a GeoJSON Feature object
    #     feature = {
    #         'type': 'Feature',
    #         'geometry': {
    #             'type': 'Polygon',
    #             'coordinates': [list(polygon.exterior.coords)]
    #         }
    #     }
    #     # Return the GeoJSON Feature object as a JSON response
    #     return jsonify(feature)
    # else:
    #     print('Polygon is not within the Faith GeoJSON boundaries')
    #     # Return an error response
    #     return jsonify({'error': 'Polygon is not within the Faith GeoJSON boundaries'})


if __name__ == "__main__":
    app.run(debug=True)
