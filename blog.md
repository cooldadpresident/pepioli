---
layout: page
title: 📝 Blog
permalink: /blog/
---

<p class="page-description">Zkušenosti, tipy a příběhy ze studentského života.</p>

<ul class="post-list">
{% for post in site.blog %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <div class="post-meta">
      <span><span class="emoji">📅</span> {{ post.date | date: "%-d. %-m. %Y" }}</span>
      {% if post.author %}<span><span class="emoji">✍️</span> {{ post.author }}</span>{% endif %}
    </div>
    {% if post.description %}
    <p class="post-excerpt">{{ post.description }}</p>
    {% endif %}
  </li>
{% endfor %}
</ul>
