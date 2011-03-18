from google.appengine.ext import db

#range_score = range(30,100,10)

class Settings(db.Model):
   userid = db.StringProperty(required=True)
   expire_date = db.DateTimeProperty(required=True,auto_now_add = True)
   contactpref = db.StringProperty(required=True,default="notify",choices=set(["mail","phone","notify"]))
   suppl_contact = db.StringProperty()
   usual_search = db.StringProperty(required=True,default="passenger",choices=set(["lift","passenger"]))
   aval_sits = db.IntegerProperty(default=3)
   range_time = db.IntegerProperty(default=60,required=True)
   range_time_sense = db.StringProperty(required=True,default="both",choices=set(["more", "less", "both"]))
#   result_treshold = db.IntegerProperty(required=True,default=70)
   result_treshold = db.IntegerProperty(required=True,default=70)

    
