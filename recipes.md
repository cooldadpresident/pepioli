---
layout: page
title: Recipes
permalink: /recipes/
---

# Recipes

{% for recipe in site.recipes %}
- [{{ recipe.title }}]({{ recipe.url }})
{% endfor %}
