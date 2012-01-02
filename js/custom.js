$( function() {
    gh.user("auraphp").repos(function (data) {
        var str = '';
        data.repositories.reverse();
        for( i = 0; i < data.repositories.length; i++ ) {
            if( data.repositories[i].name != 'auraphp.github.com' ) {
                str = str + '<li><a href="/'+ data.repositories[i].name +'" title="'+ data.repositories[i].description +'">' + data.repositories[i].name + '</a></li>';
            }
        }
        //console.log( data );
        if( str.length > 0 ) {
            $('#githubrepos').html( '<ul>' + str + '</ul>' );
        }
    });
});
