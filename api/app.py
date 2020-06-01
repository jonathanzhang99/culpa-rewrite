from flask import Flask

from api.blueprints.professors import professors_blueprint
from api.blueprints.announcements import announcements_blueprint

app = Flask(__name__)
app.register_blueprint(professors_blueprint, url_prefix='/api/professors')
app.register_blueprint(announcements_blueprint, url_prefix='/api/announcements')
