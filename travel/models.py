from google.appengine.ext import db


class Settings(db.Model):
   userid = db.IntegerProperty(required=True)
   expire_date = DateProperty(required=True)
   contactpref = db.StringProperty(choices=set(["notify", "phone", "mail"]))
   suppl_contact = db.StringProperty()
   usual_search = db.StringProperty(choices=set(["lift","passenger"]))
   aval_sits = db.IntegerProperty()
   range_time = db.TimeProperty()
   range_time_sense = db.StringProperty(choices=set(["more", "less", "both"]))
   result_treshold = db.IntegerProperty(choices=set(range(30, 100, 10)))


class Travels(db.Model):
   userid = db.IntegerProperty(required=True)
   time_start = db.DateTimeProperty(required=True)
   start_point = db.GeoPtProperty(required=True)
   end_point = db.GeoPtProperty(required=True)
   track = db.ListProperty(GeoPtProperty,required=True)
   search_type = db.StringProperty(required=True, choices=set(["lift","passenger","both"]))

class Match(db.Model):
   # thinking about it
    
















