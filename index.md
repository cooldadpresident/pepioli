---
layout: home
title: Pepioli
---

# Welcome to Pepioli

A student community sharing experiences, recipes, and projects.

## Latest Posts

{% for post in site.blog limit: 5 %}
- [{{ post.title }}]({{ post.url }}) - {{ post.date | date: "%Y-%m-%d" }}
{% endfor %}

[View all posts →](/pepioli/blog)

## Recipes

{% for recipe in site.recipes limit: 5 %}
- [{{ recipe.title }}]({{ recipe.url }})
{% endfor %}

[View all recipes →](/pepioli/recipes)

## Projects

{% for project in site.projects limit: 5 %}
- [{{ project.title }}]({{ project.url }})
{% endfor %}

[View all projects →](/pepioli/projects)
