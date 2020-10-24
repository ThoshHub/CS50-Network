from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms
from datetime import date, datetime
from .models import Listing, Comment, Bid, CATEGORY_CHOICES
from .models import User
from .forms import ListingForm
from decimal import *

class NewListingForm(forms.Form):
	title = forms.CharField(label="Title")
	description = forms.CharField(label="Description", required=False)
	starting_bid = forms.DecimalField(
		label="Starting Bid", max_digits=6, decimal_places=2)
	image = forms.URLField(label="Image URL", required=False)
	category = forms.CharField(
		max_length=11,
		widget=forms.Select(choices=CATEGORY_CHOICES.CATEGORY_CHOICES),
		required=False
	)


def index(request):
	return render(request, "auctions/index.html")


def login_view(request):
	if request.method == "POST":

		# Attempt to sign user in
		username = request.POST["username"]
		password = request.POST["password"]
		user = authenticate(request, username=username, password=password)

		# Check if authentication successful
		if user is not None:
			login(request, user)
			return HttpResponseRedirect(reverse("index"))
		else:
			return render(request, "auctions/login.html", {
				"message": "Invalid username and/or password."
			})
	else:
		return render(request, "auctions/login.html")


def logout_view(request):
	logout(request)
	return HttpResponseRedirect(reverse("index"))


def register(request):
	if request.method == "POST":
		username = request.POST["username"]
		email = request.POST["email"]

		# Ensure password matches confirmation
		password = request.POST["password"]
		confirmation = request.POST["confirmation"]
		if password != confirmation:
			return render(request, "auctions/register.html", {
				"message": "Passwords must match."
			})

		# Attempt to create new user
		try:
			user = User.objects.create_user(username, email, password)
			user.save()
		except IntegrityError:
			return render(request, "auctions/register.html", {
				"message": "Username already taken."
			})
		login(request, user)
		return HttpResponseRedirect(reverse("index"))
	else:
		return render(request, "auctions/register.html")


def create_listing(request):
	if request.method == "POST":
		form = ListingForm(request.POST)
		if form.is_valid():
			return_title = form.cleaned_data["title"].title()
			return_description = form.cleaned_data["description"]
			return_price = form.cleaned_data["starting_bid"]
			return_picture = form.cleaned_data["picture"]
			return_category = form.cleaned_data["category"]
			current_user = request.user
			if return_picture == "":  # checks if it is empty
				return_picture = "https://i.imgur.com/qldLMTx.png"
			listing = Listing(title=return_title, description=return_description, starting_bid=return_price, sold=False, picture=return_picture, poster=current_user, category=return_category)
			listing.save()
			return HttpResponseRedirect(reverse("listings"))
		else:
			return render(request, "auctions/create_listing.html", {
					"form": form
			})

	return render(request, "auctions/create_listing.html", {
		"form": ListingForm()
	})

def listings(request):
	return render(request, "auctions/listings.html", {
		"listings": Listing.objects.all().filter(sold=False), "title": "Current Listings"
	})

def updateBid(return_bid, current_user, this_listing):
	bid = Bid(bid_price=return_bid, bidder=current_user)
	bid.save()
	this_listing.current_bid = bid
	this_listing.save()

def listing_details(request, listing_id):
	
	# Grab listing, otherwise return an error
	try:
		this_listing = Listing.objects.get(pk=listing_id)
	except:
		return render(request, "auctions/listings.html", {
			"listings": Listing.objects.all().filter(sold=False), "title": "Current Listings", "message": "That listing does not exist! Please select a listing from below! \n"
		})
	
	# Grab information to process 
	comments = Comment.objects.filter(listing=listing_id)
	current_user = request.user
	in_watchlist = this_listing.watchlist.filter(id=current_user.id)
	is_poster = this_listing.poster == current_user

	# Process POST requests
	if request.method == "POST":

		# Comments
		if 'comment' in request.POST:
			return_comment = request.POST["comment"]
			if return_comment != "":
				comment = Comment(comment_text=return_comment, poster=current_user, listing=this_listing)
				comment.save()
			else:
				comment_message_f = "Please type something to comment!"
				return render(request, "auctions/listing_details.html", {
					"listing": this_listing, "comments": comments, "in_watchlist": in_watchlist, "is_poster": is_poster, "comment_message_f": comment_message_f
				})

		# Bids	
		if 'user_bid' in request.POST:
			return_bid = Decimal(request.POST["user_bid"])
			if return_bid is not None:
				if this_listing.current_bid is None: # a single bid hasn't been placed, so comparison must be done with starting bid
					if return_bid > this_listing.starting_bid:
						updateBid(return_bid, current_user, this_listing)
					else: # return form with error message
						bid_message_f = "Your bid must be greater than $" + str(this_listing.starting_bid) + "!"
						return render(request, "auctions/listing_details.html", {
							"listing": this_listing, "comments": comments, "in_watchlist": in_watchlist, "is_poster": is_poster, "bid_message_f": bid_message_f
						})
				else: # compare with current bid
					if return_bid > this_listing.current_bid.bid_price:
						updateBid(return_bid, current_user, this_listing)
					else: # return form with error message
						bid_message_f = "Your bid must be greater than $" + str(this_listing.current_bid.bid_price) + "!"
						return render(request, "auctions/listing_details.html", {
							"listing": this_listing, "comments": comments, "in_watchlist": in_watchlist, "is_poster": is_poster, "bid_message_f": bid_message_f
						})

		# Closing an auction
		if 'close_auction' in request.POST:
			this_listing.sold = True
			this_listing.save()

		# Removing and adding from a watchlist
		if 'remove_from_watchlist' in request.POST:
			this_listing.watchlist.remove(current_user)
		if 'add_to_watchlist' in request.POST:
			this_listing.watchlist.add(current_user)

	return render(request, "auctions/listing_details.html", {
		"listing": this_listing, "comments": comments, "in_watchlist": in_watchlist, "is_poster": is_poster
	})

def debug(request):
	return render(request, "auctions/debug.html")

def watchlist(request):
	try:
		current_user = request.user
		return render(request, "auctions/listings.html", {
			"listings": Listing.objects.all().filter(watchlist=current_user), "title": "Your Watchlist"
		})
	except:
		return render(request, "auctions/login.html", {
			"message": "Please Login To See This Page!"
		})

def my_listings(request):
	try:
		current_user = request.user
		return render(request, "auctions/listings.html", {
			"listings": Listing.objects.all().filter(poster=current_user), "title": "Your Listings"
		})
	except:
		return render(request, "auctions/login.html", {
			"message": "Please Login To See This Page!"
		})

def categories(request):
	return render(request, "auctions/categories.html", {
		"categories": CATEGORY_CHOICES.CATEGORY_CHOICES
	})

def category_listings(request, category):
	request_category = category.upper()
	return render(request, "auctions/listings.html", {
		"listings": Listing.objects.all().filter(category=request_category), "title": category.title
	})
