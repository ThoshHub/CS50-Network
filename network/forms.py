from django.forms import ModelForm
from django import forms
from .models import message

class messageForm(ModelForm):
	message = forms.CharField(widget=forms.Textarea(
		attrs={
			'class': 'message-form'
		}
	), required=True)
	class Meta:
		model = message
		fields = [ 
			'message'
			]
		widget = {
			'message': 2
		}