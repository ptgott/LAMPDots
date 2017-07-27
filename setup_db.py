import sys
sys.path.append('/vagrant/LAMPDots/')
sys.path.append("/var/www/virtualEnvironment/lib/python2.7/site-packages/")
from LAMPDots import db

db.create_all()