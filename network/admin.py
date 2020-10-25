from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your models here.

class UserAdmin(admin.ModelAdmin): 
	model = User
admin.site.register(User, UserAdmin) # Custom fields don't show up if you register UserAdmin... (?)
# admin.site.register(User) # OR just use this instead of the above 3 lines
