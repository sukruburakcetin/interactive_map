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
    index_no = 0
    # Get the points data from the AJAX request
    points = request.json.get('points')
    print(points)  # do something with the points data here
    # center point provided by the user
    point = Point(points['geometry']['coordinates'][0], points['geometry']['coordinates'][1])
    # Create a buffer around the Point object with a radius of 20 meters
    polygon = point.buffer(0.0002)  # 0.0002 is roughly equivalent to 20 meters
    url = 'https://raw.githubusercontent.com/sukruburakcetin/interactive_map/main/static/kres_uygunluk.geojson'
    kres_uygunluk_geojson = requests.get(url).json()
    # Checks there is a polygon that can be intersected

    # Find all the shapes that intersect with the polygon
    intersecting_shapes = []
    intersecting_shapes_indexes = []
    # her iki alanı kontrol eder ve indislerini array'e assign eder
    for i in range(0, len(kres_uygunluk_geojson['features'])):
        current_kres_uygunluk_shape = shape(kres_uygunluk_geojson['features'][i]['geometry'])
        if polygon.intersects(current_kres_uygunluk_shape):
            intersecting_shapes.append(current_kres_uygunluk_shape)
            intersecting_shapes_indexes.append(i)

    # eger birden fazla polygon varsa buraya girer
    if len(intersecting_shapes) > 1:
        suitability_values = []
        for current_kres_uygunluk_shape in intersecting_shapes:

            intersection = polygon.intersection(current_kres_uygunluk_shape)
            # kesisim alanını, marker'ın kesisim alanına bölüyorum
            # misal 0.80/1 gibi
            proportion_within_shape = intersection.area / polygon.area
            print("proportion within shape: ", proportion_within_shape)
            print("proportion within shape: ", current_kres_uygunluk_shape)
            suitability_values.append({
                'gridcode': kres_uygunluk_geojson['features'][intersecting_shapes_indexes[index_no]]['properties']['GRIDCODE'],
                'proportion_within_shape': proportion_within_shape # burada proporsiyonu saklıyorum
            })
            index_no += 1

        # Calculate the weighted average of the suitability values based on the proportion of the polygon within each shape
        total_proportion = sum([value['proportion_within_shape'] for value in suitability_values])
        weighted_suitability_values = []
        for value in suitability_values:
            weighted_suitability_values.append({
                'weighted_suitability': value['gridcode'] * (value['proportion_within_shape'] / total_proportion) # burada kesisen altlık polygonlarının gridcodelarını(yani uygunluk kodlarını), yukarda hesapladığım proporsiyonla isleme sokuyorum
            })

        # her bir polygondan 1.3 ve 1.6 gibi degerler geliyor, hangisinde daha çok kesişmisse o daha büyük oluyor( değerlerin 3'ün altında gelmesi yukardaki işlemde normalize edilmesinden yani oradaki 2 polygonla kesisiyor ya onların 2 ve 3 geliyor bunların agırlıkları diyelim)
        # bunları topluyorum GRIDCODE: 2.5532738460809687 böyle geliyor bu da ne  2 ne 3 ama 2li olanından ne kadar 2liği o alanla kesisiyor ne kadar 3lüğü o alanla kesisiyor bu sayı artıyor ya da  azalıyor ama 2 ve 3 le kesistiği için 2 ile 3 arasında oluyor
        # eger polygonun alanı 2 lik kısımda daha çok olsaydı 2 ye daha yakın olacaktı ama burda 3 lük kırmızı alanda o yuvarlak polygon daha cok oldugu için 2.5 gibi geldi
        # Calculate the final suitability value as the sum of the weighted suitability values

        # sonra burada toplatılmıs value'ye göre tekrardan uygunluk description ataması yapıyorum
        final_suitability_value = sum([value['weighted_suitability'] for value in weighted_suitability_values])
        if 2 < final_suitability_value < 3: # misal bizim GRIDCODE: 2.5532738460809687 degeri bu aralıkta o yüzden uygun - az uygun
            suitability = "Uygun - Az Uygun"

        elif 1 < final_suitability_value < 2:
            suitability = "Az Uygun - Uygun Değil"

        elif 0 < final_suitability_value < 1:
            suitability = "Uygun Değil"


        # sonra bu degeri marker'a bind edip html tarafında ajax koduyla bu veriyi consume edip ekrana yansıtıyorum
        feature = {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [list(polygon.exterior.coords)]
            },
            'id': 0,
            'gridcode': final_suitability_value,
            'suitability': suitability
        }
        intersecting_shapes.clear()
        intersecting_shapes_indexes.clear()
        suitability_values.clear()
        weighted_suitability_values.clear()

    else:

        thereIsAPolygon = 0
        for i in range(0, len(kres_uygunluk_geojson['features'])):
            current_kres_uygunluk_shape = shape(kres_uygunluk_geojson['features'][i]['geometry'])
            if polygon.within(current_kres_uygunluk_shape):
                thereIsAPolygon = 1
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
        if thereIsAPolygon == 0:
            feature = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [list(polygon.exterior.coords)]
                },
                'id': "No Suitability Polygon",
                'gridcode': 0,
                'suitability': 0
            }
        # Return the GeoJSON Feature object as a JSON response
    return jsonify(feature)


if __name__ == "__main__":
    app.run(debug=True)
