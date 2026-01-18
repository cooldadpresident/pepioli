---
layout: page
title: Recepty
permalink: /recipes/
---

<div class="page-header">
  <h1>🍳 Recepty</h1>
  <p>Vyzkoušené recepty na oblíbená jídla a sladkosti</p>
</div>

<div class="card-grid">
{% for recipe in site.recipes %}
  <div class="card">
    <h3><a href="{{ recipe.url | relative_url }}">{{ recipe.title }}</a></h3>
    {% if recipe.description %}
    <p>{{ recipe.description }}</p>
    {% endif %}
    <div class="card-meta">
      {% if recipe.date %}📅 {{ recipe.date | date: "%d.%m.%Y" }}{% endif %}
    </div>
  </div>
{% endfor %}
</div>
