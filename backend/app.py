from Flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Backend is Running!"

if __name__ == "__main__":
    app.run(debug=True, port=5000)
