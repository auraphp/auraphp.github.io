---
layout: site
active: home
title: Aura for PHP
---

<div class="hero-unit">
    <div class="hero-logo">
        <p><img
            src="img/aura-logo-black.png"
            width="240"
            height="240"
        ></p>
        <h3><script>
            var adjectives = [
                "powerful",
                "mature",
                "independent",
                "sharp",
                "high-quality",
                "practical",
                "consistent",
                "reliable",
                "standalone",
                "thoughtful",
                "diligent",
                "veteran",
                "well-tested"
            ];

            var adjLower = adjectives[Math.floor(adjectives.length * Math.random())];
            var adjUpper = adjLower[0].toUpperCase() + adjLower.slice(1);
            document.write(adjUpper + ' tools for ' + adjLower + ' developers.');
        </script></h3>
    </div>
</div>

{% include packages-front.md %}

<div class="row">
    <div class="span6">
        <h2>About</h2>
        <p>
            The primary goal of Aura is to provide high-quality, well-tested,
            <a href="http://php-fig.org">standards-compliant</a>, decoupled
            libraries that can be used in any codebase. This means you can use
            as much or as little of the project as you like.
        </p>
        <p><a class="btn" href="/about">Read more &raquo;</a></p>
    </div>
    <div class="span6">
        <h2>Packages</h2>
        <p>
            The Aura project centers around a collection of independent
            packages. Each package is self-contained and has only the things
            it needs for its core purpose. None of the packages depends on any
            of the other; you can download and use each of the packages on its
            own.
        </p>
        <p><a class="btn" href="/packages">Read more &raquo;</a></p>
    </div>
    <!-- <div class="span4">
        <h2>Framework</h2>
        <p>
            Aura has enough libraries to form a full-stack framework of its
            own. A system repository is available to incorporate them all into
            a coherent framework for application development.
        </p>
        <p><a class="btn" href="/framework">Read more &raquo;</a></p>
    </div> -->
</div>
