# Generated by Django 3.1 on 2020-10-25 02:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_user_followers'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='followers',
        ),
        migrations.AddField(
            model_name='user',
            name='temp',
            field=models.CharField(default='temp', max_length=64),
            preserve_default=False,
        ),
    ]
