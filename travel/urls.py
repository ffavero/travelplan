from django.conf.urls.defaults import *

urlpatterns = patterns('',
    (r'^$', 'travel.views.index'),
    )
