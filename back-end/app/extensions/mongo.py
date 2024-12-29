from mongoengine import connect

def connected(app):
    try:
        connect(host=app.config['MONGO_URI'])
        print("Kết nối MongoDB thành công!")
    except Exception as e:
        print("Lỗi kết nối MongoDB:", str(e))
