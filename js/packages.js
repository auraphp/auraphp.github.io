$.getJSON('/packages.json', function (packages) {

    var rows = [];

    $.each(packages, function (name, info) {

        if (info.type != 'library' && info.type != 'bundle') {
            return;
        }

        var readmeLink =
            '<a href="'
            + info.github + '/tree/' + info.version + '#readme">'
            + name + '</a>';

        var releasesLink =
            '<a class="version" href="'
            + info.github + '/releases">'
            + info.version.replace('-', '&#8209;')
            + '</a>';

        var row =
            '<tr>'
            + '<td>' + readmeLink + '&nbsp;' + releasesLink + '</td>'
            + '<td>' + info.description + '</td>'
            + '</tr>';

        rows.push(row);
    });

    $('<tbody />', {
        html: rows.join('')
    }).appendTo('#packages');

});
