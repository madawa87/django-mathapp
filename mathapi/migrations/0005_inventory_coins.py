# Generated by Django 4.2 on 2023-09-23 18:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mathapi', '0004_pokemon_userpokemon_lifetimepokeballs_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='inventory',
            name='coins',
            field=models.IntegerField(default=0),
        ),
    ]