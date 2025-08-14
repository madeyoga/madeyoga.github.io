---
title: "What 5 Years with Django Taught Me: Pros and Cons"
description: After half a decade of building apps with Django, here’s my honest take on its strengths, weaknesses, and the lessons I’ve learned along the way.
image:
  src: /images/chrome_2025-07-24_14-44-25.jpg
authors:
  - name: Made Y
    to: https://madeyoga.github.io
    avatar:
      src: /images/profile2.jpg
date: 2025-08-13
seo:
  keywords: django, django review, django pros and cons, python web framework, django developer experience
badge:
  label: Django
schemaOrg:
  - type: "BlogPosting"
    headline: "5 Years with Django: The Good, The Bad, and What I Wish I Knew Earlier"
    author:
      type: "Person"
      name: "Made Yoga"
    datePublished: "2025-08-13"
---


## Introduction

In this article, I’ll share my real-world experience after **5 years of working with Django**. From small side projects to production web apps. Whether you’re just starting with Django or considering it for your next project, I hope this helps you understand what’s great about it, and where it can get tricky.


## Why I Chose Django in the First Place

I started my web development journey in PHP, learning **CodeIgniter** during an internship at [Toro Developer Universal](https://torodeveloper.com/){.text-primary} in 2018. My main task was to develop a module and UI to automatically generate CRUD operations from existing sql tables. It was a great learning experience, but while working on it, I discovered that Django, a Python framework I’d barely heard of at the time, already had this functionality built in through the Django ORM and Admin. That caught my attention.

After the internship ended, I decided to explore Django on my own. At first, it was just curiosity. But later, while studying data science and machine learning at university, I was assigned a class project: build a handwriting character recognition model. Using **TensorFlow** and the **Keras API** and **Python**, I trained a model that could take an image of handwritten text and predict the letters.

When my lecturer asked me to showcase the project through a website, Django instantly came to mind. It gave me exactly what I needed; a way to build both the backend API to run predictions and a simple UI for users to upload images, all in one framework.

By the end of that project, I had a site where people could upload an image, the server would load my trained model, and the prediction results would appear right on the screen. Since then, I’ve used Django to build a variety of applications, from a **blogging** platform where people can sign up and share their stories, to a **point-of-sale** system with dashboard analytics, customized Django Admin, invoicing, and **inventory management** that runs entirely on a store’s local network, connecting everyone from cashiers to storage staff. I’ve also built online stores and catalogs, and through each project, Django has remained my go-to framework for turning ideas into fully functional software.


::tabs
  ::div{icon="i-lucide-bar-chart-4" label="Customized Django Admin Dashboard"}
    ![customized django admin dashboard](/images/chrome_2025-07-24_14-44-25.jpg)
  ::

  ::div{icon="i-lucide-shopping-cart" label="Online Store"}
    ::pictures
      ::div
      ![superjaya.id catalog](https://res.cloudinary.com/dhqbr2d4l/image/upload/v1755144296/SJ1_oztatv.jpg)
      ::
      ::div
      ![superjaya.id cart ui](/images/SJ2.jpeg)
      ::
    ::
  ::

  ::div{icon="i-simple-icons-blogger" label="Blogging Platform"}
    ::pictures
      ::div
      ![xamarind blogging platform](https://res.cloudinary.com/dhqbr2d4l/image/upload/v1755150579/xamarind1_k8uvjt.webp)
      ::
      ::div
      ![xamarind blogging platform article page](https://res.cloudinary.com/dhqbr2d4l/image/upload/v1755150579/xamarind2_w2dnvj.webp)
      ::
    ::
  ::
  
::


## The Good Stuff About Django (Pros)

### 1. Django ORM
One of my favorite thing about Django is the ORM. Not only does it let you work with the database without writing raw SQL, but you can also run Python scripts during migrations. This came in handy more than once. Especially when I needed to populate a newly added column with default values right as the migration ran.

```python
from django.db import migrations

def populate_default_status(apps, schema_editor):
    MyModel = apps.get_model('myapp', 'MyModel')
    MyModel.objects.filter(status__isnull=True).update(status='pending')

class Migration(migrations.Migration):
    dependencies = [
        ('myapp', '0001_initial'),
    ]
    operations = [
        migrations.RunPython(populate_default_status),
    ]

```

### 2. Django Management Commands
Management commands feel like little superpowers baked into the framework. They let me run Python scripts directly inside the Django environment, which is perfect for tasks like populating fields, importing / exporting data, fixing incorrect values, or even creating quick backups. Whenever I need to tweak or move data, management commands are my go-to tool. For example, Here’s a management command that generates slugs for any blog post that doesn’t have one:

```python
# blog/management/commands/fix_missing_slug.py

# python manage.py fix_missing_slug

from django.core.management.base import BaseCommand
from django.utils.text import slugify
from blog.models import Article


class Command(BaseCommand):
    help = "Generate slugs for articles that don't have one yet"

    def handle(self, *args, **options):
        articles_without_slug = Article.objects.filter(slug__isnull=True)

        for article in articles_without_slug:
            article.slug = slugify(article.title)
            article.save()
            self.stdout.write(self.style.SUCCESS(f"Slug set for: {article.title}"))

        self.stdout.write(self.style.SUCCESS("Done!"))

```

### 3. The Django Admin
This is what first caught my attention back in my CodeIgniter days. Django can turn your models into a fully functional CRUD interface instantly. It’s incredibly useful for development and testing, but it’s not just for that; I’ve built entire internal tools with customized Django Admin. With the right tweaks (and a little help from packages like [Django Unfold](https://unfoldadmin.com/){.text-primary} for a modern UI), you can make it both powerful and beautiful. It makes building apps with an administration fast and efficient.


### 4. Time to Market 
When people talk about rapid development, Django is one of the few frameworks that actually delivers. Between the admin, ORM, and built-in features, I can go from idea to a working prototype in a fraction of the time it would take with many other stacks. It truly comes “batteries included”: authentication, forms, and user management are already there out of the box. And when I’ve needed something more specialized, like APIs, or payments, the community has always had excellent, battle-tested libraries ready to go. Whatever the challenge, there’s almost always a solution at hand.


## The Not-So-Great Parts (Cons)

### 1. The “Spoiled Kid” Effect 
Spending years with a highly opinionated framework like Django make me a little spoiled. I realized this when I had to learn another web framework for work, ASP.NET Core. Django (and Python in general) spoils you with free, open-source, maintained community libraries for almost anything you can imagine. In contrast, in the other hand, you might not even find a library that does exactly what you need; and if you do, there’s a chance it’s freemium or commercial, which makes you appreciate Django’s open-source ecosystem even more. It’s not Django’s fault, but it does make switching stacks a bit of a shock.


::picture-and-caption

"Where batteries?"

#image
::p{class="mb-0"}
![caveman](https://i.kym-cdn.com/entries/icons/original/000/038/301/cavemancover.jpg){.rounded-lg .my-0}
::
::


### 2. Performance (or the Reputation of It)
If you hang around tech forums long enough, you’ll hear people say Python, and by extension Django is “slow”. In absolute terms, yes, it’s not going to beat a Go or Java or dotnet backend in raw speed. But in practice, I’ve found Django to be more than fast enough for my projects. That said, for extremely high-performance, low-latency systems, Django might not be the first tool you reach for without careful optimization or caching strategies. 

::div{class="w-full flex justify-center"}
![django benchmark fortune](https://res.cloudinary.com/dhqbr2d4l/image/upload/v1755144309/django_benchmark_j1gqsh.jpg)
::


### 3. JavaScript Frameworks Integration
Django works great on the backend, but integrating it smoothly with modern JavaScript frameworks isn’t as polished as in some other ecosystems. For example, Laravel has Inertia.js, which makes connecting Vue or React feel almost seamless. With Django, you either stick to traditional server-rendered templates or set up a separate frontend project.


## Final Thoughts

Django has been a big part of my journey as a developer. It’s not perfect, but it’s powerful. The key is knowing when it’s the right tool for the job, and how to make the most of it.

---

*Have you been working with Django too? I’d love to hear them!*

