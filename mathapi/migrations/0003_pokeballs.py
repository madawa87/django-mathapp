# Generated by Django 4.0.2 on 2022-08-04 16:42

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('mathapi', '0002_stats_user_coins'),
    ]

    operations = [
        migrations.CreateModel(
            name='Pokeballs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tier1', models.IntegerField(default=0)),
                ('tier2', models.IntegerField(default=0)),
                ('tier3', models.IntegerField(default=0)),
                ('tier4', models.IntegerField(default=0)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pokeballs', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
