---
layout: page
title: Aura Project for PHP
---
{% include JB/setup %}

Here you will see latest news regarding the Aura Project for PHP.


Some of the recent posts,

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date: "%d %b %Y" }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
