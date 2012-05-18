---
title: Writing / Sharing your experience with Aura
layout: post
category : auraphp
tags : [blog]
---
{% include JB/setup %}

When you play with aura components, sometimes you may have faced some techincal difficulties which people may have never faced. Its always hard to remember what all things we did to resolve it. In such cases we write small snippets of code either in blog or as pastie for future reference. Its a good habit to share stuffs that we learn. There can be better way to do other than that also.

If you like to share something on aura components, you can share here.

#How can you write posts on aura blog?

Fork https://github.com/auraphp/auraphp.github.com

Add your post to _post directory with naming convention as 

```yyyy-mm-dd-url-of-post```

Open it on your favourite editor and post 

    ---
    layout: post
    category : category-name
    tags : [tags]
    ---
    {% include JB/setup %}
    
    Contents. If you want to highlight some code snippets add 4 spaces in front of it.

You can see the examples over https://github.com/auraphp/auraphp.github.com/tree/master/_posts

Now commit and push to your repository and and initiate a Pull Request.

We will verify it and publish .... Easy right ?

Then why are you waiting ? Start writing :-) .
