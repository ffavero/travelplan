from django.shortcuts import render_to_response

def index(request):
    return render_to_response('index.html', {})

def travels(request):
    return render_to_response('travels.html', {})

def settings(request):
    return render_to_response('settings.html', {})
