from flask import Flask, render_template, request, jsonify
from shapely import Point

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
    # Create a buffer around the Point object with a radius of 500 meters
    polygon = point.buffer(0.0003) #0.005 is roughly equivalent to 500 meters
    # Convert the Shapely Polygon object to a GeoJSON Feature object
    feature = {
        'type': 'Feature',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [list(polygon.exterior.coords)]
        }
    }
    print(jsonify(feature))
    # Return the GeoJSON Feature object as a JSON response
    return jsonify(feature)


if __name__ == "__main__":
    app.run(debug=True)
