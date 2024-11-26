from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

from flask_migrate import Migrate
migrate = Migrate()

# Khởi tạo các extension như SQLAlchemy, Migrate, hoặc các thư viện khác mà ứng dụng cần.