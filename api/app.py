from flask import Flask

from api.blueprints.auth import auth_blueprint
from api.blueprints.department import department_blueprint
from api.blueprints.professor import professor_blueprint
from api.blueprints.course import course_blueprint
from api.blueprints.review import review_blueprint
from api.blueprints.search import search_blueprint
from api.blueprints.vote import vote_blueprint

from api.config import configs
from api.data import db
from api.utils import register_auth_error_handlers


def create_app(config=None):
    app = Flask(__name__)

    # Set the configuration using the FLASK_ENV environment variable if
    # config not provided
    app.config.from_object(config or configs[app.env])
    # Load any override variables from a pyfile if defined
    app.config.from_pyfile(app.config['PYFILE_CONFIG'], silent=True)

    # IMPORTANT: Register all blueprints here
    app.register_blueprint(auth_blueprint, url_prefix='/api/auth')
    app.register_blueprint(department_blueprint, url_prefix='/api/department')
    app.register_blueprint(professor_blueprint, url_prefix='/api/professor')
    app.register_blueprint(course_blueprint, url_prefix='/api/course')
    app.register_blueprint(review_blueprint, url_prefix='/api/review')
    app.register_blueprint(search_blueprint, url_prefix='/api/search')
    app.register_blueprint(vote_blueprint, url_prefix='/api/vote')

    db.init_app(app)
    register_auth_error_handlers(app)

    return app
