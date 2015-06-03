DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
php $DIR/vendor/bin/bookdown $DIR/_packages.bookdown.json
