from django.urls import path

from . import views

urlpatterns = [
    # path("", views.index, name="index"),
	path("", views.listings, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
	path("create_listing", views.create_listing, name="create_listing"),
	path("listings", views.listings, name="listings"),
	path("debug", views.debug, name="debug"),
	path("listings/<int:listing_id>", views.listing_details, name="listing_details"),
	path("watchlist", views.watchlist, name="watchlist"),
	path("my_listings", views.my_listings, name="my_listings"),
	path("categories", views.categories, name="categories"),
	path("categories/<str:category>", views.category_listings, name="category_listings")
]
