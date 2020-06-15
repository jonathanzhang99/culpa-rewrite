from flask import Flask

from api.blueprints.professors import professors_blueprint
from api.blueprints.announcements import announcements_blueprint
from api.blueprints.review import review_blueprint

app = Flask(__name__)
app.register_blueprint(professors_blueprint, url_prefix='/api/professors')
app.register_blueprint(announcements_blueprint, url_prefix='/api/announcements')  # noqa: E501
app.register_blueprint(review_blueprint, url_prefix='/api/review')
