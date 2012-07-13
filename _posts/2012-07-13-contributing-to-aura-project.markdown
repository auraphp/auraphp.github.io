---
title: Contributing to Aura Project
layout: post
category : auraphp
tags : [contibuting]
draft: true
---
{% include JB/setup %}

Sometimes you may have noticed a bug, or need a feature implemented, and need to contribute back to the aura community. These are some of the steps to help / contribute to aura project.

#Set Up Git
First you need git and a github account. If you are new to git and github the [guide set up git](https://help.github.com/articles/set-up-git) will help you.

#Fork A Repo

Now you need to fork the repo you want to contribute. Here is a detailed guide on how to [fork a repo](https://help.github.com/articles/fork-a-repo)

In this example we will be using Aura.Web as the repo you need to fork and make the necessary changes(bug/features) and give a PR (Pull Request).

Point your browser to https://github.com/auraphp/Aura.Web and click fork. Now the repo will be in your github account. 

Eg : `https://github.com/your-username/Aura.Web`

Now you need to clone to your local system.

    git clone git@github.com:username/Aura.Web.git

    cd Aura.Web
    
All `Aura.Package` has `master` and `develop` branch. The `master` points to the current or latest release. All the development activities goes in develop branch. There will be different tags for each release. So if you want to give a PR for a bug then you create a branch from master. 

Lets see in which branch you are in ( $ represents the terminal )
    
    $ git branch
    
Will list the local branches. For eg something like 
    
    *master
    develop
    
Now you can checkout to develop branch like 

    $ git checkout develop 
    
Lets check on which branch we are 
    
    $ git branch
    
    * develop
    master
    
Lets add the remote repo as upstream (https://github.com/auraphp/Aura.Web)

    $ git remote add upstream https://github.com/auraphp/Aura.Web.git
    # Pulls in changes not present in your local repository, without modifying your files
    
Never commit directly to `master`, `develop` branches. Always create a new branch and give a PR. Lets see how we can do. 
Lets create another branch and do our experiments.

    $ git checkout -b experimental
    
    Switched to a new branch 'experimental'
    
This has created a branch from your current branch(in this case `develop`)

Now you can do your experiments and commit the changes. In the mean time the develop branch of auraphp would have received many commits. So you may want to merge the changes.

    $ git fetch upstream
    # Pulls in changes not present in your local repository, without modifying your files
    
If you want to merge the commits from the upstream/branch , to your current branch you can do like

    $ git merge upstream/develop
    
Sometimes there can be conflicts and you may want to resolve and commit manually.

Now you can push your branch to your github account.

    $ git push -u origin experimental
    
Once you have pushed give a PR to the develop branch if its a feature/changes. Remember to check the PSR-1, PSR-2 by running PHP_CodeSniffer.

#Running PHP_CodeSniffer

    $ git clone git://github.com/squizlabs/PHP_CodeSniffer.git
    $ cd PHP_CodeSniffer
    $ php scripts/phpcs -h
    $ php scripts/phpcs --standard=PSR1 path-to-Aura.Web/src
    $ php scripts/phpcs --standard=PSR2 path-to-Aura.Web/src

You can also install via pear. For more information look into https://github.com/squizlabs/PHP_CodeSniffer

The core team has direct push/pull access but still its a good idea that [Paul M Jones](https://github.com/pmjones) do the merge. We will discuss about the PR, why the changes needed etc.

Thanks for being with Aura and we love to see your contributions. If you have any queries feel free to comment below or create an issue or talk in #auraphp irc freenode or in [https://groups.google.com/group/auraphp](https://groups.google.com/group/auraphp).

If you are new to irc, you can use [pidgin](http://www.pidgin.im/) or [x-chat](http://xchat.org/)
