---
layout: default
title: Domů
---

<div class="hero">
  <div class="hero-inner">
    <h1><span class="emoji">🌸</span> Pepioli</h1>
    <p>Studentská komunita, kde kvete sdílení — zkušenosti, recepty a projekty na jednom místě.</p>
    <div class="hero-actions">
      <a href="{{ '/blog' | relative_url }}" class="btn"><span class="emoji">📖</span> Číst blog</a>
      <a href="{{ '/recipes' | relative_url }}" class="btn btn-ghost"><span class="emoji">🍳</span> Recepty</a>
    </div>
  </div>
</div>

<section class="section">
  <div class="section-head">
    <h2 class="section-title"><span class="emoji">📝</span> Nejnovější příspěvky</h2>
    <a href="{{ '/blog' | relative_url }}" class="link-more">Všechny příspěvky →</a>
  </div>
  <ul class="post-list">
  {% for post in site.blog limit: 5 %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <div class="post-meta">
        <span><span class="emoji">📅</span> {{ post.date | date: "%-d. %-m. %Y" }}</span>
        {% if post.author %}<span><span class="emoji">✍️</span> {{ post.author }}</span>{% endif %}
      </div>
      {% if post.description %}<p class="post-excerpt">{{ post.description }}</p>{% endif %}
    </li>
  {% endfor %}
  </ul>
</section>

<section class="section">
  <div class="section-head">
    <h2 class="section-title"><span class="emoji">🍳</span> Recepty</h2>
    <a href="{{ '/recipes' | relative_url }}" class="link-more">Všechny recepty →</a>
  </div>
  <div class="card-grid">
  {% for recipe in site.recipes limit: 3 %}
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
</section>

<section class="section">
  <div class="section-head">
    <h2 class="section-title"><span class="emoji">🎨</span> Projekty</h2>
    <a href="{{ '/projects' | relative_url }}" class="link-more">Všechny projekty →</a>
  </div>
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
</section>
