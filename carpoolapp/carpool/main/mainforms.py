import google.appengine.ext.db.djangoforms as forms
from django import forms as newforms
import models

class UserForm(forms.ModelForm):
    class Meta:
        model = models.Settings
        exclude = ('userid','expire_date')

