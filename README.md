# Game with Server
 Basic game ported to Django project for database/backend support

# MAJOR CHANGE LOG
### 12/27/2023
- add 'base.apps.BaseConfig' to "INSTALLED_APPS" in settings.py
- makemigrations
- migrate
- add BASE_DIR / "templates" to "TEMPLATES" in settings.py (no affect yet, but allows customizable /admin if you want to...)

## Software in use
- Python 3.10.0
- Django 4.0.4
- PostgreSQL Database 14.2 (user preference, not included in files/build)

Porting my basic game to a Django project allowing database for things like:
- Monsters/Mobs
- Equipment
- Characters

This should offload some of the work from the "client" should this ever go live to a real web server.
## The default page has no "home", go to default_url/base/

## GIT IGNORE INCLUDES THE FOLLOWING
- settings.py
  - Some settings are "private", i.e. database connection and password. While these are local (for now), someone may want to use something different and it'll be easier (I'm pretty sure) to instantiate your own database from the ground up.
- migrations
  - Anyone building this project on their own should also build their own migrations for database and system consistency.