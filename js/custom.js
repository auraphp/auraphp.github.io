$( function() {
    $.get('https://api.github.com/orgs/auraphp/repos', function(data) {
        var str = '';
        data.repositories.reverse();
        for( i = 0; i < data.repositories.length; i++ ) {
            var repo = data.repositories[i].name;
            if( repo.match('Aura.') ) {
                str = str + '<li><a href="/'+ data.repositories[i].name +'" title="'+ data.repositories[i].description +'">' + data.repositories[i].name + '</a></li>';
            }
        }
        //console.log( data );
        if( str.length > 0 ) {
            $('#githubrepos').html( '<ul>' + str + '</ul>' );
        }
    });
/* Version 2
    gh.user("auraphp").repos(function (data) {
        var str = '';
        data.repositories.reverse();
        for( i = 0; i < data.repositories.length; i++ ) {
            var repo = data.repositories[i].name;
            if( repo.match('Aura.') ) {
                str = str + '<li><a href="/'+ data.repositories[i].name +'" title="'+ data.repositories[i].description +'">' + data.repositories[i].name + '</a></li>';
            }
        }
        //console.log( data );
        if( str.length > 0 ) {
            $('#githubrepos').html( '<ul>' + str + '</ul>' );
        }
    });
*/
});
