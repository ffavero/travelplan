from django.conf.urls.defaults import *

urlpatterns = patterns('',
    (r'^$', 'travel.views.index'),
    (r'^travels/$', 'travel.views.travels'),
    (r'^settings/$', 'travel.views.settings'),
    )
