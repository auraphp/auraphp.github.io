---
layout: page
title: Welcome to Blog of Aura Project for PHP 5.4!
---
{% include JB/setup %}

Welcome to the blog for Aura Project for PHP 5.4.

We will shortly update this

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

Thanks to http://github.com/plusjade/jekyll-bootstrap for making this happen
