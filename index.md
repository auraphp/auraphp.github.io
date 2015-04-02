---
layout: site
active: home
title: Aura for PHP
---

<div class="hero-unit">
    <div class="hero-logo">
        <img src="img/aura-logo-black.png" width="240" height="240" />
        <h3><script>
            var adjectives = [
                "powerful",
                "independent",
                "sharp",
                "high-quality",
                "reliable",
                "well-tested"
            ];
            var adjLower = adjectives[Math.floor(adjectives.length * Math.random())];
            var adjUpper = adjLower[0].toUpperCase() + adjLower.slice(1);
            document.write(adjUpper + ' tools for ' + adjLower + ' developers.');
        </script></h3>
        <p><a class="btn btn-primary btn-large" href="/about">Learn more &raquo;</a></p>
    </div>
</div>

<div class="row">
    <div class="span12">
        <table id="packages">
            <thead><tr>
                <th>Package</th>
                <th>Composer</th>
                <th>Description</th>
            </tr></thead>
        </table>
        <script>
            $.getJSON('packages.json', function (packages) {
                var rows = [];

                $.each(packages, function (name, info) {

                    var readmeLink =
                        '<a href="'
                        + info.github + '">'
                        + name + '</a>';

                    var releaseLink =
                        '<a class="version" href="'
                        + info.releases + '">'
                        + info.version.replace('-', '&#8209;')
                        + '</a>';

                    var packagistLink =
                        '<a href="'
                        + info.packagist + '">'
                        + info.composer.replace('-', '&#8209;')
                        + '</a>';

                    var row =
                        '<tr>'
                        + '<td>' + readmeLink + '&nbsp;' + releaseLink + '</td>'
                        + '<td>' + packagistLink + '</td>'
                        + '<td>' + info.description + '</td>'
                        + '</tr>';

                    rows.push(row);
                });

                $('<tbody />', {
                    html: rows.join('')
                }).appendTo('#packages');
            });
        </script>
    </div>
</div>


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
