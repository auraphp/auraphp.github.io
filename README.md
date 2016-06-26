This is the [auraphp.com](http://auraphp.com) website repo.

The pages are built via [jekyll](https://jekyllrb.com) and package
documentation via [Bookdown](http://bookdown.io).

## Building the site locally

You need a few dependencies like ruby, gem, bundler etc.

```bash
git clone https://github.com/auraphp/auraphp.github.com
cd auraphp.github.com
ruby -version #minimum version 2.x
gem install bundler
bundle install
bundle exec jekyll serve
```

Preview your local Jekyll site in your web browser at http://localhost:4000 .


If you are interested read more about [Setting up your GitHub Pages site locally with Jekyll](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/) .


### Create / Update aura library documentation

```bash
cd _bookdown
composer install --no-dev
sh update-package.sh
```
