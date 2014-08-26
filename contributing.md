---
layout: site
active: contributing
title: Aura for PHP | Contributing
---

# Contributing

As an open-source project, Aura depends on your skills and talent to help make it better for everyone. Do you want to contribute some code or documentation to Aura? Here's how!

## Prerequisites

1. Install Git and have a Github account. If you are new to Git and Github, [this setup guide](https://help.github.com/articles/set-up-git) will help you.

1. Install [PHPUnit](http://www.phpunit.de/manual/current/en/installation.html) for unit tests.

## Library Packages

1. Create a [fork of the repository](https://help.github.com/articles/fork-a-repo) to which you want to contribute.

1. Clone that fork to your development workstation.

        git clone git@github.com:{$YOUR_USER_NAME}/{$AURA_REPO}.git
        cd {$REPO}

1. From the `develop-2` branch, create and check out a branch for your new work, then push it to Github:

        git checkout develop-2
        git branch {$WORKING_BRANCH}
        git checkout {$WORKING_BRANCH}
        git push --set-upstream origin/{$WORKING_BRANCH}

1. Add the original Aura repository as a remote.

        git remote add upstream https://github.com/auraphp/{$AURA_REPO}.git

1. Do your work, fixing bugs or adding features.

    - Honor the Aura [standards](#standards) for code.

    - Maintain 100% test coverage, adding new tests as needed. (Be wary of making changes to existing tests.)

    - Push your changes early and often.

    - To fetch upstream changes from the original Aura repository and merge them into your working branch:

            git fetch upstream
            git merge upstream/develop-2

    You may need to resolve conflicts in your working branch after merging.

1. When all the tests pass and your final push is ready for review, make a pull request from your working branch to the original Aura repository. Be prepared for extensive discussion and revision, and a waiting period before your pull request is merged.

## Bundle Packages

TBD

## Kernel Packages

TBD

## Project Packages

TBD

## Standards

These are the major standards for code contributions.

1. Confofm to [PSR-1](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md) for basic coding standards.

1. Conform to [PSR-2](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md) for coding style, with the following additions that are unspecified by PSR-2:

    1. Variables, properties, array keys, and the like should be in `$snake_case` and not `$camelCase`.

    1. Default to the use of the [Solar vocabulary for method names](http://solarphp.com/manual/appendix-standards.naming.methods).

    1. Do not use public properties on user-defined classes. (Magic `__get()`, `__set()`, and so on are allowed to present the appearance of public properties.)

    1. Do not use globals or superglobals (e.g., $_SERVER). Inject them as needed via constructor or method parameters.

1. Adhere to PSR-4 for autoloading.

1. Do not introduce dependencies on any other package.

1. Maintain 100% test coverage.

1. A class should *either* create objects *or* operate on those objects, never both. This means the `new` keyword should be used only in Factories and Builders. (The built-in PHP classes are exempt from this rule.)

1. Default to explicit configuration rather than implicit convention.

1. Default to Dependency Injection instead of Service Locator. If a Service Locator is actually needed, it should locate only one type of object.

1. Default to composing functionality through dependency injection, rather than through inheritance and base classes.

1. Keep the README updated with any new or changed features.


## Questions?

If you have any questions, please feel free to [contact the Aura community of developers](/community). And thanks!
