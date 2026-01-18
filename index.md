---
layout: default
title: Pepioli
---

# 🎓 Welcome to Pepioli

A student community sharing experiences, recipes, and projects.

---

## 📝 Latest Posts

<ul class="post-list">
{% for post in site.blog limit: 5 %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span class="post-meta">{{ post.date | date: "%Y-%m-%d" }}</span>
  </li>
{% endfor %}
</ul>

[View all posts →](/pepioli/blog){:.view-all}

---

## 🍳 Recipes

<ul class="post-list">
{% for recipe in site.recipes limit: 5 %}
  <li>
    <a href="{{ recipe.url | relative_url }}">{{ recipe.title }}</a>
  </li>
{% endfor %}
</ul>

[View all recipes →](/pepioli/recipes){:.view-all}

---

## 🎨 Projects

<ul class="post-list">
{% for project in site.projects limit: 5 %}
  <li>
    <a href="{{ project.url | relative_url }}">{{ project.title }}</a>
  </li>
{% endfor %}
</ul>

[View all projects →](/pepioli/projects){:.view-all}
