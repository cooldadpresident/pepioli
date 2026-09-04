---
layout: page
title: 🎨 Projekty
permalink: /projects/
---

<p class="page-description">Ukázky práce a zajímavé projekty.</p>

<div class="card-grid">
{% for project in site.projects %}
  {% assign img = project.image | default: project.thumbnail %}
  <div class="card">
    {% if img %}
    <a href="{{ project.url | relative_url }}" class="card-thumb"><img src="{% if img contains '://' %}{{ img }}{% else %}{{ img | relative_url }}{% endif %}" alt="{{ project.title | escape }}" loading="lazy"></a>
    {% else %}
    <a href="{{ project.url | relative_url }}" class="card-thumb is-placeholder"><span class="emoji">🌷</span></a>
    {% endif %}
    <div class="card-body">
      <h3><a href="{{ project.url | relative_url }}">{{ project.title }}</a></h3>
      {% if project.description %}<p>{{ project.description }}</p>{% endif %}
    </div>
  </div>
{% endfor %}
</div>
