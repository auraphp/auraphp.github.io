$.getJSON('/packages.json', function (data) {

    $.each(data, function (branch, packages) {

        var rows = [];

        $.each(packages, function (name, info) {

            var skip =
                info.type != 'library'
                && info.type != 'bundle'
                && info.type != 'interface';

            if (skip) {
                return;
            }

            var branchLink =
                '<a href="'
                + info.github + '/tree/' + branch + '>'
                + name + '</a>';

            var versionLink =
                '<a class="version" href="'
                + info.github + '/tree/' + info.version + '#readme">'
                + info.version.replace('-', '&#8209;')
                + '</a>';

            var row =
                '<tr>'
                + '<td>' + branchLink + '&nbsp;' + versionLink + '</td>'
                + '<td>' + info.description + '</td>'
                + '</tr>';

            rows.push(row);
        });

        var table =
            '<caption>' + branch + ' Packages</caption>'
            + '<thead>'
            + '<tr>'
            + '<th>Package</th>'
            + '<th>Description</th>'
            + '</tr>'
            + '</thead>'
            + '<tbody>'
            + rows.join('')
            + '</tbody>';

        $('<table />', {
            html: table
        }).appendTo('#packages');

    })
});
