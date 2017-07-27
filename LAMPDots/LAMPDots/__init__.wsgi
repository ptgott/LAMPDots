#!/usr/bin/python
import sys
import logging

logging.basicConfig(stream=sys.stderr)
sys.path.append("/var/www/LAMPDots/")
sys.path.append("/var/www/LAMPDots/LAMPDots/")
sys.path.append("/var/www/virtualEnvironment/lib/python2.7/site-packages/")

from LAMPDots import app as application
application.secret_key = 'secret key'