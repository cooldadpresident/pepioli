---
layout: page
title: Projekty
permalink: /projects/
---

<div class="page-header">
  <h1>🎨 Projekty</h1>
  <p>Ukázky práce a zajímavé projekty</p>
</div>

<div class="card-grid">
{% for project in site.projects %}
  <div class="card">
    <h3><a href="{{ project.url | relative_url }}">{{ project.title }}</a></h3>
    {% if project.description %}
    <p>{{ project.description }}</p>
    {% endif %}
    <div class="card-meta">
      {% if project.date %}📅 {{ project.date | date: "%d.%m.%Y" }}{% endif %}
    </div>
  </div>
{% endfor %}
</div>
