---
layout: page
title: Blog
permalink: /blog/
---

<div class="page-header">
  <h1>📝 Blog</h1>
  <p>Zkušenosti, tipy a příběhy ze studentského života</p>
</div>

<ul class="post-list">
{% for post in site.blog %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <div class="post-meta">
      <span>📅 {{ post.date | date: "%d.%m.%Y" }}</span>
      {% if post.author %}<span>✍️ {{ post.author }}</span>{% endif %}
    </div>
    {% if post.description %}
    <p class="post-excerpt">{{ post.description }}</p>
    {% endif %}
  </li>
{% endfor %}
</ul>
