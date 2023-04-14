from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/save-points", methods=["POST"])
def save_points():
    # Get the points data from the AJAX request
    points = request.json.get('points')
    print(points)  # do something with the points data here
    return {"success": True}


if __name__ == "__main__":
    app.run(debug=True)
