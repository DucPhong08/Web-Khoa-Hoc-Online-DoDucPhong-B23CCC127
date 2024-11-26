from flask import Flask
from .routes import main_routes, auth_routes

app = Flask(__name__)
app.config.from_object('app.config.Config')  # Nơi chứa cấu hình ứng dụng

app.register_blueprint(main_routes.bp)
app.register_blueprint(auth_routes.bp, url_prefix='/auth')
