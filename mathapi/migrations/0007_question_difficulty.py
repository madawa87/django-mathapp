# Generated by Django 4.2 on 2023-09-26 15:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mathapi', '0006_inventory_trapmodules_lifetimeinventory_coins_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='difficulty',
            field=models.IntegerField(default=1),
        ),
    ]
