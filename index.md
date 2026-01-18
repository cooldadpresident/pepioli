---
layout: default
title: Domů
---

<div class="hero">
  <h1>🎓 Pepioli</h1>
  <p>Studentská komunita sdílející zkušenosti, recepty a projekty</p>
</div>

<section class="section">
  <h2 class="section-title">📝 Nejnovější příspěvky</h2>
  <ul class="post-list">
  {% for post in site.blog limit: 6 %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <div class="post-meta">
        <span>📅 {{ post.date | date: "%d.%m.%Y" }}</span>
        {% if post.author %}<span>✍️ {{ post.author }}</span>{% endif %}
      </div>
    </li>
  {% endfor %}
  </ul>
  <a href="{{ '/blog' | relative_url }}" class="btn">Všechny příspěvky →</a>
</section>

<section class="section">
  <h2 class="section-title">🍳 Recepty</h2>
  <div class="card-grid">
  {% for recipe in site.recipes limit: 3 %}
    <div class="card">
      <h3><a href="{{ recipe.url | relative_url }}">{{ recipe.title }}</a></h3>
      <p>{{ recipe.description }}</p>
    </div>
  {% endfor %}
  </div>
  <a href="{{ '/recipes' | relative_url }}" class="btn">Všechny recepty →</a>
</section>

<section class="section">
  <h2 class="section-title">🎨 Projekty</h2>
  <div class="card-grid">
  {% for project in site.projects %}
    <div class="card">
      <h3><a href="{{ project.url | relative_url }}">{{ project.title }}</a></h3>
      <p>{{ project.description }}</p>
    </div>
  {% endfor %}
  </div>
  <a href="{{ '/projects' | relative_url }}" class="btn">Všechny projekty →</a>
</section>
