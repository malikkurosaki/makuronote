brew update
brew install postgresql
brew services start postgresql
createuser -s postgres
psql -U postgres

# membuat user dengan kemampuan membuat database
CREATE USER nama_pengguna WITH PASSWORD 'kata_sandi';
ALTER USER nama_pengguna CREATEDB;

psql -U nama_pengguna -d postgres
CREATE DATABASE nama_database;

# ganti port
brew services stop postgresql
sudo nano /opt/homebrew/var/postgresql@14/postgresql.conf
port = 5433
brew services start postgresql

# paksa user mengggunakan password
nano /opt/homebrew/var/postgresql@14/pg_hba.conf
# "local" is for Unix domain socket connections only
local   all             all                                     md5
brew services restart postgresql




