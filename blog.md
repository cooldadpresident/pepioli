---
layout: page
title: Blog
permalink: /blog/
---

# Blog Posts

{% for post in site.blog %}
- [{{ post.title }}]({{ post.url }}) - {{ post.date | date: "%Y-%m-%d" }}
{% endfor %}
