from flask import Flask

from api.blueprints.auth import auth_blueprint
from api.blueprints.departments import departments_blueprint
from api.blueprints.professors import professors_blueprint
from api.blueprints.review import review_blueprint
from api.blueprints.search import search_blueprint

from api.config import configs
from api.data import db
from api.utils import register_auth_error_handlers


def create_app(config=None):
    app = Flask(__name__)

    # set the configuration using the FLASK_ENV environment variable if
    # config not provided
    app.config.from_object(config or configs[app.env])

    # register all blueprints here
    app.register_blueprint(auth_blueprint, url_prefix='/api/auth')
    app.register_blueprint(
        departments_blueprint,
        url_prefix='/api/departments')
    app.register_blueprint(professors_blueprint, url_prefix='/api/professors')
    app.register_blueprint(review_blueprint, url_prefix='/api/review')
    app.register_blueprint(search_blueprint, url_prefix='/api/search')

    db.init_app(app)
    register_auth_error_handlers(app)

    return app
