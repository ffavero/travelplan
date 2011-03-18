from google.appengine.ext import db
from django.template.context import RequestContext
from django.shortcuts import render_to_response
from carpool.main import mainforms
from carpool.main.models import Settings
from carpool.main.misc import StatusCodes
from django.http import HttpResponseRedirect, HttpResponse
import datetime

def mainapp(request,userid):
   settings = Settings.gql("WHERE userid = :userid", userid = userid).get()
   if not settings:
      create_new_account = '/'+userid+'/settings/'
      return HttpResponseRedirect(create_new_account)
   payload = dict(settings=settings,userid=userid)
   return render_to_response('mainapp.html', payload)


def usersets(request,userid):
   settings = Settings.gql("WHERE userid = :userid", userid = userid).get()
   if not settings:
      settings = Settings(userid=userid)
   expiring = settings.expire_date
   if request.method == 'GET':
      userform = mainforms.UserForm(instance=settings)
   if request.method == 'POST':
      userform = mainforms.UserForm(data=request.POST,instance=settings)
      if userform.is_valid():
         user = userform.save()
         return HttpResponseRedirect('/'+userid)
   payload = dict(userform=userform, userid=userid, expiring=expiring)
   return render_to_response('settings.html',RequestContext(request, payload))


def pay(request, userid):
   settings = Settings.gql("WHERE userid = :userid", userid = userid).get()
   if not settings:
      create_new_account = '/'+userid+'/settings/'
      return HttpResponseRedirect(create_new_account)

   if settings.expire_date < datetime.datetime.utcnow():
      settings.expire_date =  datetime.datetime.utcnow() + datetime.timedelta(365/12)
   else:   
      settings.expire_date = settings.expire_date + datetime.timedelta(365/12)
   settings.put()
   return HttpResponseRedirect('/'+userid+'/settings/')
   
 
