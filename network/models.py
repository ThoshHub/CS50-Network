from django.contrib.auth.models import AbstractUser
from django.contrib import admin
from django.db import models


class User(AbstractUser):
	followers = models.ManyToManyField("User", related_name="followedby")
	following = models.ManyToManyField("User", related_name="follows")
	# temp = models.CharField(max_length=64)