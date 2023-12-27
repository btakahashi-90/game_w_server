# Game with Server
 Basic game ported to Django project for database/backend support

Porting my basic game to a Django project allowing database for things like:
- Monsters/Mobs
- Equipment
- Characters

This should offload some of the work from the "client" should this ever go live to a real web server.

## GIT IGNORE INCLUDES THE FOLLOWING
- settings.py
  - Some settings are "private", i.e. database connection and password. While these are local (for now), someone may want to use something different and it'll be easier (I'm pretty sure) to instantiate your own database from the ground up.
- migrations
  - Anyone building this project on their own should also build their own migrations for database and system consistency.