---
layout: page
title: 🍳 Recepty
permalink: /recipes/
---

<p class="page-description">Vyzkoušené recepty na oblíbená jídla a sladkosti</p>

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
