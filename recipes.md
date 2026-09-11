---
layout: page
title: 🍳 Recepty
permalink: /recipes/
---

<p class="page-description">Vyzkoušené recepty na oblíbená jídla a sladkosti.</p>

<div class="card-grid">
{% for recipe in site.recipes %}
  {% assign img = recipe.image | default: recipe.thumbnail %}
  <div class="card">
    {% if img %}
    <a href="{{ recipe.url | relative_url }}" class="card-thumb"><img src="{% if img contains '://' %}{{ img }}{% else %}{{ img | relative_url }}{% endif %}" alt="{{ recipe.title | escape }}" loading="lazy"></a>
    {% else %}
    <a href="{{ recipe.url | relative_url }}" class="card-thumb is-placeholder"><span class="emoji">🍰</span></a>
    {% endif %}
    <div class="card-body">
      <h3><a href="{{ recipe.url | relative_url }}">{{ recipe.title }}</a></h3>
      {% if recipe.description %}<p>{{ recipe.description }}</p>{% endif %}
    </div>
  </div>
{% endfor %}
</div>
