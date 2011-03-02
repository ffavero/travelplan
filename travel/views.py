from django.http import HttpResponse, HttpResponseRedirect
from travel import models
import trforms
from django.shortcuts import render_to_response

def index(request):
    return render_to_response('index.html', {})

def travels(request):
    return render_to_response('travels.html', {})

def settings(request):
    return render_to_response('settings.html', {})


def register_user(request):
    if request.method == 'POST':
       userform = trform.userForm(request.POST)
    if userform.is_valid():
       return HttpResponseRedirect('/settings/')
    else:
       userform = trform.userForm()
   
    return render_to_response('setting.html', {
      'form':userform,
    })



