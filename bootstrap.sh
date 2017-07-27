#!/usr/bin/env bash

apt-get update
apt-get install -y apache2
if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi

# remove the default virtual host
sudo rm /etc/apache2/sites-enabled/000-default.conf

sudo apt-get install -y libapache2-mod-wsgi python-dev

#extend Apache with the WSGI module
sudo a2enmod wsgi

sudo apt-get install -y python-pip

sudo pip install virtualenv

#set up a Python virtual environment
cd /var/www/
sudo virtualenv virtualEnvironment

#activate the virtual environment
source virtualEnvironment/bin/activate

# install Flask and its ORM, Flask-SQLAlchemy
pip install Flask
pip install Flask-SQLAlchemy
deactivate

#add a file that configures this site for Apache
ln -fs /vagrant/LAMPDots.conf /etc/apache2/sites-available/LAMPDots.conf

# Make the wsgi file executable, readable and writable by owner and group.
chmod 774 /var/www/LAMPDots/LAMPDots/__init__.wsgi

## ==Install MySQL and configure==
## This prevents the MySQL installation from asking for a password.
export DEBIAN_FRONTEND=noninteractive
sudo -E apt-get -y install mysql-server
# # note that I've only identified a provisional, insecure password.
sudo -E mysql -e "GRANT ALL PRIVILEGES ON *.* TO 'vagrant'@'localhost' IDENTIFIED BY '11111';"
PATH=$PATH:/vagrant/

sudo a2ensite LAMPDots
sudo service apache2 restart
# # so SQLAlchemy can find MySQL:
# sudo pip install mysql-python
sudo apt-get install -y python-mysqldb

sudo mysql -e "CREATE DATABASE lampdots;"

# # Run a script that sets up the db tables using
# # SQLAlchemy
python /vagrant/setup_db.py

sudo service apache2 restart
