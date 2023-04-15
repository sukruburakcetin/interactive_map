### this repository includes helper codes for further uses ###

"""Convert the Shapely Polygon object to a GeoJSON Feature object"""
# feature = {
#     'type': 'Feature',
#     'geometry': {
#         'type': 'Polygon',
#         'coordinates': [list(polygon.exterior.coords)]
#     }
# }
# print(jsonify(feature))
# # Return the GeoJSON Feature object as a JSON response
# return jsonify(feature)


"""Get Geojson From Url and Save to Static Folder"""

# @app.route('/fatih-geojson', methods=["GET"])
# def get_fatih_geojson():
#     url = 'https://github.com/sukruburakcetin/interactive_map/blob/main/templates/fatih.geojson?raw=true'
#     response = requests.get(url)
#     if response.status_code == 200:
#         filepath = os.path.join(app.static_folder, 'fatih.geojson')
#         with open(filepath, 'wb') as f:
#             f.write(response.content)
#         return jsonify({'success': True})
#     else:
#         return jsonify({'success': False})
