---
layout: page
title: Aura Project for PHP
---
{% include JB/setup %}

Here you will see latest news, experiments on Aura and PHP.


Some of the recent posts,

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
