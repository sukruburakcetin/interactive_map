import json

import cx_Oracle
import pandas as pd
from flask import Flask, render_template, request, jsonify
from shapely import Point
from shapely.geometry import shape

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/locate-addresses", methods=["POST"])
def locate_addresses():
    import requests

    api_url = 'http://10.6.128.105:7000/address_geocode/'

    search_param = {'search': ""}
    search_param.update({'search': request.json.get("search-bar-input")})
    if len(search_param['search']) > 0:
        data_geocoding_result = requests.get(url=api_url, params=search_param).json()
        return jsonify(data_geocoding_result)
    else:
        return jsonify({"message": "address is not available"})


@app.route("/save-points", methods=["POST"])
def save_points():
    cnx = cx_Oracle.connect('MAKS_EDU/MXEDU18TT@exa1-scan.ibb.gov.tr:1472/TESTCBS')
    cursor = cnx.cursor()

    # sql = '''CREATE TABLE IHE_UYGUNLUK(
    #      LOKASYON CHAR(50),
    #      ENLEM FLOAT,
    #      BOYLAM FLOAT,
    #      ID INT,
    #      GRIDCODE FLOAT,
    #      UYGUNLUK CHAR(50),
    #      MAHALLE CHAR(50),
    #      ILCE CHAR(50),
    #      SES_SEGMENT CHAR(50),
    #      NUFUS INT,
    #      YAPI_NUFUS INT,
    #      YAPI_SAYISI INT,
    #      ILCE_IHE_BUFE_SAYISI INT,
    #      MAHALLE_IHE_BUFE_SAYISI INT,
    #      POTANSIYEL_SATIS CHAR(50)
    # )'''
    #
    # cursor.execute(sql)
    # cnx.commit()
    # cnx.close()

    index_no = 0
    # Get the points data from the AJAX request
    points = request.json.get('points')
    # print(points)  # do something with the points data here
    # center point provided by the user
    point = Point(points['geometry']['coordinates'][0], points['geometry']['coordinates'][1])

    import requests

    api_url = 'http://10.6.128.105:7000/address_geocode/'

    search_param = {'search': ""}
    search_param.update({'search': "{},{}".format(points['geometry']['coordinates'][0], points['geometry']['coordinates'][1])})
    if len(search_param['search']) > 0:
        data_reverse_geocoding_result = requests.get(url=api_url, params=search_param).json()
    else:
        data_reverse_geocoding_result = ""
        return data_reverse_geocoding_result

    # Create a buffer around the Point object with a radius of 20 meters
    polygon = point.buffer(0.0002)  # 0.0002 is roughly equivalent to 20 meters

    with open('./static/data/ihe_uygunluk.geojson', 'r',
              encoding='utf-8') as f:
        ihe_uygunluk_geojson = json.load(f)

    with open('./static/data/mahalle_bilgileri.geojson', 'r', encoding='utf-8') as f:
        mahalle_geojson = json.load(f)

    mah_ad = ""
    ilce_ad = ""
    nufus = ""
    ses_segment = ""
    yapi_nufus = ""
    yapi_sayisi = ""
    ilce_ihe_bufe_sayisi = ""
    mahalle_ihe_bufe_sayisi = ""
    potansiyel_satis = ""

    for k in range(0, len(mahalle_geojson['features'])):
        current_mahalle_geojson = shape(mahalle_geojson['features'][k]['geometry'])
        if point.intersects(current_mahalle_geojson):
            try:
                try:
                    mah_ad = mahalle_geojson['features'][k]['properties']['MAH_AD']
                except:
                    pass
                try:
                    ilce_ad = mahalle_geojson['features'][k]['properties']['ILCE_AD']
                except:
                    pass
                try:
                    ses_segment = mahalle_geojson['features'][k]['properties']['SES_SEGMENT']
                except:
                    pass
                try:
                    nufus = mahalle_geojson['features'][k]['properties']['NUFUS']
                except:
                    pass
                try:
                    yapi_nufus = mahalle_geojson['features'][k]['properties']['YAPI_NUFUS']
                except:
                    pass
                try:
                    yapi_sayisi = mahalle_geojson['features'][k]['properties']['YAPI_SAYISI']
                except:
                    pass
                try:
                    ilce_ihe_bufe_sayisi = mahalle_geojson['features'][k]['properties']['ILCE_IHE_BUFE_SAYISI']
                except:
                    pass
                try:
                    mahalle_ihe_bufe_sayisi = mahalle_geojson['features'][k]['properties']['MAHALLE_IHE_BUFE_SAYISI']
                except:
                    pass
                try:
                    potansiyel_satis = mahalle_geojson['features'][k]['properties']['POTANSIYEL_SATIS']
                except:
                    pass
                    break
            except:
                mah_ad = "Özel Bölge(Mah. bilgisi yok)"
                ilce_ad = "Özel Bölge(İlçe bilgisi yok)"
                ses_segment = "Özel Bölge(SES bilgisi yok)"
                nufus = 0
                yapi_nufus = 0
                yapi_sayisi = 0
                ilce_ihe_bufe_sayisi = 0
                mahalle_ihe_bufe_sayisi = 0
                potansiyel_satis = ""

    # Find all the shapes that intersect with the polygon
    intersecting_shapes = []
    intersecting_shapes_indexes = []
    # her iki alanı kontrol eder ve indislerini array'e assign eder
    for i in range(0, len(ihe_uygunluk_geojson['features'])):
        current_ihe_uygunluk_shape = shape(ihe_uygunluk_geojson['features'][i]['geometry'])
        if point.intersects(current_ihe_uygunluk_shape) and \
                ihe_uygunluk_geojson['features'][i]['properties']['GRIDCODE'] == 6:
            break
        if point.intersects(current_ihe_uygunluk_shape) and \
                ihe_uygunluk_geojson['features'][i]['properties']['GRIDCODE'] == 7:
            break
        if point.intersects(current_ihe_uygunluk_shape) and \
                ihe_uygunluk_geojson['features'][i]['properties']['GRIDCODE'] == 8:
            break
        if polygon.intersects(current_ihe_uygunluk_shape):
            intersecting_shapes.append(current_ihe_uygunluk_shape)
            intersecting_shapes_indexes.append(i)

    # eger birden fazla polygon varsa buraya girer
    if len(intersecting_shapes) > 1:
        suitability_values = []
        for current_ihe_uygunluk_shape in intersecting_shapes:
            intersection = polygon.intersection(current_ihe_uygunluk_shape)
            # kesisim alanını, marker'ın kesisim alanına bölüyorum
            # misal 0.80/1 gibi
            proportion_within_shape = intersection.area / polygon.area
            # print("proportion within shape: ", proportion_within_shape)
            # print("proportion within shape: ", current_ihe_uygunluk_shape)
            suitability_values.append({
                'gridcode': ihe_uygunluk_geojson['features'][intersecting_shapes_indexes[index_no]]['properties'][
                    'GRIDCODE'],
                'proportion_within_shape': proportion_within_shape  # burada proporsiyonu saklıyorum
            })
            index_no += 1

        # Calculate the weighted average of the suitability values based
        # on the proportion of the polygon within each shape
        total_proportion = sum([value['proportion_within_shape'] for value in suitability_values])
        weighted_suitability_values = []
        for value in suitability_values:
            weighted_suitability_values.append({
                'weighted_suitability': value['gridcode'] * (value['proportion_within_shape'] / total_proportion)
                # burada kesisen altlık polygonlarının gridcodelarını(yani uygunluk kodlarını),
                # yukarda hesapladığım proporsiyonla isleme sokuyorum
            })

        # her bir polygondan 1.3 ve 1.6 gibi degerler geliyor, hangisinde daha çok kesişmisse o daha büyük
        # oluyor( değerlerin 3'ün altında gelmesi yukardaki işlemde normalize edilmesinden yani oradaki
        # 2 polygonla kesisiyor ya onların 2 ve 3 geliyor bunların agırlıkları diyelim)
        # bunları topluyorum GRIDCODE: 2.5532738460809687 böyle geliyor bu da ne  2 ne 3 ama 2li
        # olanından ne kadar 2liği o alanla kesisiyor ne kadar 3lüğü o alanla kesisiyor bu sayı artıyor
        # ya da  azalıyor ama 2 ve 3 le kesistiği için 2 ile 3 arasında oluyor
        # eger polygonun alanı 2 lik kısımda daha çok olsaydı 2 ye daha yakın olacaktı ama burda
        # 3 lük kırmızı alanda o yuvarlak polygon daha cok oldugu için 2.5 gibi geldi
        # Calculate the final suitability value as the sum of the weighted suitability values
        suitability = ""
        # sonra burada toplatılmıs value'ye göre tekrardan uygunluk description ataması yapıyorum
        final_suitability_value = sum([value['weighted_suitability'] for value in weighted_suitability_values])
        if 4 < final_suitability_value < 5:  # misal bizim GRIDCODE: 2.5532738460809687 degeri
            # bu aralıkta o yüzden uygun - az uygun
            suitability = "Daha Uygun-En Uygun"
        elif 3 < final_suitability_value < 4:  # misal bizim GRIDCODE: 2.5532738460809687 degeri bu
            # aralıkta o yüzden uygun - az uygun
            suitability = "Uygun-Daha Uygun"

        elif 2 < final_suitability_value < 3:
            suitability = "Az Uygun-Uygun"

        elif 1 < final_suitability_value < 2:
            suitability = "Uygun Değil-Az Uygun"

        try:
            reversed_geocode_address = data_reverse_geocoding_result['result'][0]['name']
        except:
            reversed_geocode_address = ""

        # sonra bu degeri marker'a bind edip html tarafında ajax koduyla bu veriyi consume edip ekrana yansıtıyorum
        feature = {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [list(polygon.exterior.coords)]
            },
            'id': " ",
            'gridcode': final_suitability_value,
            'suitability': suitability,
            'mahalle_ad': mah_ad,
            'ilce_ad': ilce_ad,
            'ses_segment': ses_segment,
            'nufus': nufus,
            'yapi_nufus': yapi_nufus,
            'yapi_sayisi': yapi_sayisi,
            'ilce_ihe_bufe_sayisi': ilce_ihe_bufe_sayisi,
            'mahalle_ihe_bufe_sayisi': mahalle_ihe_bufe_sayisi,
            'potansiyel_satis': potansiyel_satis,
            'adres': reversed_geocode_address

        }

        lokasyon_list = list()
        enlem_list = list()
        boylam_list = list()
        id_list = list()
        gridcode_list = list()
        uygunluk_list = list()
        mahalle_list = list()
        ilce_list = list()
        seg_segment_list = list()
        nufus_list = list()
        yapi_nufus_list = list()
        yapi_sayisi_list = list()
        ilce_ihe_bufe_sayisi_list = list()
        mahalle_ihe_bufe_sayisi_list = list()
        potansiyel_satis_list = list()

        lokasyon_list.append("")
        enlem_list.append(points['geometry']['coordinates'][0])
        boylam_list.append(points['geometry']['coordinates'][1])
        id_list.append("")
        gridcode_list.append(final_suitability_value)
        uygunluk_list.append(suitability)
        mahalle_list.append(mah_ad)
        ilce_list.append(ilce_ad)
        seg_segment_list.append(ses_segment)
        nufus_list.append(nufus)
        yapi_nufus_list.append(yapi_nufus)
        yapi_sayisi_list.append(yapi_sayisi)
        ilce_ihe_bufe_sayisi_list.append(ilce_ihe_bufe_sayisi)
        mahalle_ihe_bufe_sayisi_list.append(mahalle_ihe_bufe_sayisi)
        potansiyel_satis_list.append(potansiyel_satis)

        df = pd.DataFrame({"LOKASYON": lokasyon_list, "ENLEM": enlem_list, "BOYLAM": boylam_list,
                           "ID": id_list, "GRIDCODE": gridcode_list, "UYGUNLUK": uygunluk_list,
                           "MAHALLE": mahalle_list, "ILCE": ilce_list, "SES_SEGMENT": seg_segment_list,
                           "NUFUS": nufus_list, "YAPI_NUFUS": yapi_nufus_list, "YAPI_SAYISI": yapi_sayisi_list,
                           "ILCE_IHE_BUFE_SAYISI": ilce_ihe_bufe_sayisi_list,
                           "MAHALLE_IHE_BUFE_SAYISI": mahalle_ihe_bufe_sayisi_list,
                           "POTANSIYEL_SATIS": potansiyel_satis_list})

        df_tuples = [tuple(x) for x in df.values]
        """veritabanina yazdirma"""
        sqlTxt = 'INSERT INTO "MAKS_EDU".IHE_UYGUNLUK\
                        (LOKASYON, ENLEM, BOYLAM, ID, GRIDCODE, UYGUNLUK, MAHALLE, ILCE, SES_SEGMENT, ' \
                 'NUFUS, YAPI_NUFUS, YAPI_SAYISI, ILCE_IHE_BUFE_SAYISI, MAHALLE_IHE_BUFE_SAYISI, POTANSIYEL_SATIS)\
                        VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15)'

        cursor.executemany(sqlTxt, df_tuples)
        cnx.commit()
        """stack sismesin diye hafiza kontrolu yapilir"""
        lokasyon_list.clear()
        enlem_list.clear()
        boylam_list.clear()
        id_list.clear()
        gridcode_list.clear()
        uygunluk_list.clear()
        mahalle_list.clear()
        ilce_list.clear()
        seg_segment_list.clear()
        nufus_list.clear()
        yapi_nufus_list.clear()
        yapi_sayisi_list.clear()
        ilce_ihe_bufe_sayisi_list.clear()
        mahalle_ihe_bufe_sayisi_list.clear()
        potansiyel_satis_list.clear()

        intersecting_shapes.clear()
        intersecting_shapes_indexes.clear()
        suitability_values.clear()
        weighted_suitability_values.clear()

    else:
        thereIsAPolygon = 0
        for i in range(0, len(ihe_uygunluk_geojson['features'])):
            current_ihe_uygunluk_shape = shape(ihe_uygunluk_geojson['features'][i]['geometry'])
            if polygon.within(current_ihe_uygunluk_shape):
                thereIsAPolygon = 1
                current_gridcode = ihe_uygunluk_geojson['features'][i]['properties']['GRIDCODE']

                if current_gridcode == 1:
                    suitability_condition = "Uygun Degil"
                elif current_gridcode == 2:
                    suitability_condition = "Az Uygun"
                elif current_gridcode == 3:
                    suitability_condition = "Uygun"
                elif current_gridcode == 4:
                    suitability_condition = "Daha Uygun"
                elif current_gridcode == 5:
                    suitability_condition = "En Uygun"
                elif current_gridcode == 6:
                    suitability_condition = "Sulak Alan"
                elif current_gridcode == 7:
                    suitability_condition = "Askeri Bölge"
                elif current_gridcode == 8:
                    suitability_condition = "Ormanlık Alan"

                try:
                    reversed_geocode_address = data_reverse_geocoding_result['result'][0]['name']
                except:
                    reversed_geocode_address = ""


                # Convert the Shapely Polygon object to a GeoJSON Feature object
                feature = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [list(polygon.exterior.coords)]
                    },
                    'id': ihe_uygunluk_geojson['features'][i]['properties']['OBJECTID'],
                    'gridcode': ihe_uygunluk_geojson['features'][i]['properties']['GRIDCODE'],
                    'suitability': suitability_condition,
                    'mahalle_ad': mah_ad,
                    'ilce_ad': ilce_ad,
                    'ses_segment': ses_segment,
                    'nufus': nufus,
                    'yapi_nufus': yapi_nufus,
                    'yapi_sayisi': yapi_sayisi,
                    'ilce_ihe_bufe_sayisi': ilce_ihe_bufe_sayisi,
                    'mahalle_ihe_bufe_sayisi': mahalle_ihe_bufe_sayisi,
                    'potansiyel_satis': potansiyel_satis,
                    'adres': reversed_geocode_address
                }
                break
        if thereIsAPolygon == 0:
            feature = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [list(polygon.exterior.coords)]
                },
                'id': "No Suitability Polygon",
                'gridcode': " ",
                'suitability': " ",
                'mahalle_ad': " ",
                'ilce_ad': " ",
                'ses_segment': " ",
                'nufus': " ",
                'yapi_nufus': " ",
                'yapi_sayisi': " ",
                'ilce_ihe_bufe_sayisi': "",
                'mahalle_ihe_bufe_sayisi': "",
                'potansiyel_satis': "",
                'adres': ""
            }

        lokasyon_list = list()
        enlem_list = list()
        boylam_list = list()
        id_list = list()
        gridcode_list = list()
        uygunluk_list = list()
        mahalle_list = list()
        ilce_list = list()
        seg_segment_list = list()
        nufus_list = list()
        yapi_nufus_list = list()
        yapi_sayisi_list = list()
        ilce_ihe_bufe_sayisi_list = list()
        mahalle_ihe_bufe_sayisi_list = list()
        potansiyel_satis_list = list()

        lokasyon_list.append("")
        enlem_list.append(points['geometry']['coordinates'][0])
        boylam_list.append(points['geometry']['coordinates'][1])
        id_list.append(ihe_uygunluk_geojson['features'][i]['properties']['OBJECTID'])
        gridcode_list.append(ihe_uygunluk_geojson['features'][i]['properties']['GRIDCODE'])
        try:
            uygunluk_list.append(suitability_condition[0])
        except:
            uygunluk_list.append(" ")
        mahalle_list.append(mah_ad)
        ilce_list.append(ilce_ad)
        seg_segment_list.append(ses_segment)
        nufus_list.append(nufus)
        yapi_nufus_list.append(yapi_nufus)
        yapi_sayisi_list.append(yapi_sayisi)
        ilce_ihe_bufe_sayisi_list.append(ilce_ihe_bufe_sayisi)
        mahalle_ihe_bufe_sayisi_list.append(mahalle_ihe_bufe_sayisi)
        potansiyel_satis_list.append(potansiyel_satis)

        df = pd.DataFrame({"LOKASYON": lokasyon_list, "ENLEM": enlem_list, "BOYLAM": boylam_list,
                           "ID": id_list, "GRIDCODE": gridcode_list, "UYGUNLUK": uygunluk_list,
                           "MAHALLE": mahalle_list, "ILCE": ilce_list, "SES_SEGMENT": seg_segment_list,
                           "NUFUS": nufus_list, "YAPI_NUFUS": yapi_nufus_list, "YAPI_SAYISI": yapi_sayisi_list,
                           "ILCE_IHE_BUFE_SAYISI": ilce_ihe_bufe_sayisi_list,
                           "MAHALLE_IHE_BUFE_SAYISI": mahalle_ihe_bufe_sayisi_list,
                           "POTANSIYEL_SATIS": potansiyel_satis_list})

        df_tuples = [tuple(x) for x in df.values]
        """veritabanina yazdirma"""
        sqlTxt = 'INSERT INTO "MAKS_EDU".IHE_UYGUNLUK\
                        (LOKASYON, ENLEM, BOYLAM, ID, GRIDCODE, UYGUNLUK, MAHALLE, ILCE, SES_SEGMENT, ' \
                 'NUFUS, YAPI_NUFUS, YAPI_SAYISI, ILCE_IHE_BUFE_SAYISI, MAHALLE_IHE_BUFE_SAYISI, POTANSIYEL_SATIS)\
                        VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15)'

        cursor.executemany(sqlTxt, df_tuples)
        cnx.commit()
        """stack sismesin diye hafiza kontrolu yapilir"""
        lokasyon_list.clear()
        enlem_list.clear()
        boylam_list.clear()
        id_list.clear()
        gridcode_list.clear()
        uygunluk_list.clear()
        mahalle_list.clear()
        ilce_list.clear()
        seg_segment_list.clear()
        nufus_list.clear()
        yapi_nufus_list.clear()
        yapi_sayisi_list.clear()
        ilce_ihe_bufe_sayisi_list.clear()
        mahalle_ihe_bufe_sayisi_list.clear()
        potansiyel_satis_list.clear()
        # Return the GeoJSON Feature object as a JSON response
    return jsonify(feature)


if __name__ == "__main__":
    app.run(debug=True)
