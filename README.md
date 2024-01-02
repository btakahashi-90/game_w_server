# Game with Server
 Basic game ported to Django project for database/backend support

## Software in use
- Python 3.10.0
- Django 4.0.4
- PostgreSQL Database 14.2 (user preference, not included in files/build)
  - Psycopg 2

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

# MAJOR CHANGE LOG
### 1/2/2024
- added mob editing and mob creation form/urls/etc.
  - used "custom" form for this, might try a django form for something else for fun
  - Name must be unique, case INSENSITIVE (mob and MOB are two different objects)
  - There is no built in delete yet, you can delete from /admin or directly with DB Management API/Software
  - Name is the only REQUIRED field, values will be defaulted for all others if left blank
  - Editing a mob and blanking a field will also default the field, please be careful
- updated mob "details" page to include currently available stats
- reduced data from server for mobs to necessary info for game
- makemigrations
  - minor mob data update (damage reduction, made "name" unique)
- migrate

### 1/1/2024
- added game.html and link at /base
- extracted js/css to separate files, small modification to base.css
- added mobs from server
  - Currently loads in via context and JS handles JSON parsing
  - Very ham handed, next update should include data reduction in the context being passed in
- makemigrations
  - minor mob data update (base damage and damage modifier)
- migrate

### 12/27/2023
- add 'base.apps.BaseConfig' to "INSTALLED_APPS" in settings.py
- makemigrations
- migrate
- add BASE_DIR / "templates" to "TEMPLATES" in settings.py (no affect yet, but allows customizable /admin if you want to...)