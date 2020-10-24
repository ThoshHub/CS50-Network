# Generated by Django 3.1 on 2020-09-07 19:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0007_auto_20200905_0220'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='poster',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='user_listings', to=settings.AUTH_USER_MODEL),
        ),
    ]
