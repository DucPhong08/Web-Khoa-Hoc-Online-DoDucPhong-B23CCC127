from flask import Flask
from app.config import Config
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
from app.routes import blueprints
from app.extensions import connected



def create_app():
    app = Flask(__name__)
    CORS(app) 
    # nạp cấu hình mongo
    app.config.from_object(Config)

    jwt = JWTManager(app)
    
    # kết nối mongo
    connected(app)  
    for bp, prefix in blueprints:
        app.register_blueprint(bp, url_prefix=f"/api/{prefix}")
    
    # Thiết lập thời gian hết hạn của Access Token là 1 giờ   
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
        
    return app
