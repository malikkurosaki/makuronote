brew update
brew install postgresql
brew services start postgresql

psql -U postgres
CREATE USER nama_pengguna WITH PASSWORD 'kata_sandi';
ALTER USER nama_pengguna CREATEDB;

psql -U nama_pengguna -d postgres
CREATE DATABASE nama_database;


brew services stop postgresql
nano /usr/local/var/postgres/postgresql.conf
port = 5433
brew services start postgresql


nano /usr/local/var/postgres/pg_hba.conf
# "local" is for Unix domain socket connections only
local   all             all                                     md5
brew services restart postgresql
