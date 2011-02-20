#! /usr/bin/env python

from django.utils import simplejson
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
import os.path

print 'Content-Type: text/plain'
print ''
print 'Starting Find a Lift :)!'
