from django.contrib.auth.models import AbstractUser
from django.contrib import admin
from django.db import models
from datetime import date, datetime
from django.utils import timezone

class User(AbstractUser):
	followers = models.ManyToManyField("User", related_name="followedby", blank=True)
	following = models.ManyToManyField("User", related_name="follows", blank=True)
	# temp = models.CharField(max_length=64)

class message(models.Model):
	content = models.CharField( max_length=2000 ) # set the limit to 2000 chars
	date = models.DateTimeField(default=timezone.now) # default time will be the time at creation
	writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_messages")
	liked_by = models.ManyToManyField("User", related_name="likes")
	numoflikes = models.IntegerField(default=0)
	writername = models.CharField(null=True, max_length=128)
	
	def serialize(self):
		return {
			"id": self.id,
			"content": self.content,
			"date": self.date,
			"writer": self.writer
			# "liked_by": self.liked_by
		}

	def __str__(self): 
		return f"{self.id} - CONTENT: \"{self.content}\", DATE: \"{str(self.date)}\", WRITER: \"{str(self.writer)}\""