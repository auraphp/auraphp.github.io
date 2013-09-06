---
layout: site
title: System Organization
---

# System Organization #

The system directory structure is pretty straightforward:

    {$system}/
        config/                     # mode-specific config files
            _mode                   # The config mode, 'default' by default
            _packages               # Load these packages in order
            default.php             # default config overrides
            dev.php                 # shared development server
            local.php               # local (individual) development server
            prod.php                # production
            stage.php               # staging
            test.php                # testing
        include/                    # generic include-path directory
        package/                    # Aura packages
        tmp/                        # temporary files
        vendor/                     # Composer vendors
        web/                        # web server document root
            .htaccess               # mod_rewrite rules
            cache/                  # public cached files
            favicon.ico             # favicon to reduce error_log lines
            index.php               # bootstrap script


`config`: The configuration files which are common to all packages.

`package`: All aura packages like Aura.Autoload, Aura.Di, Aura.Router 
etc and the one you are creating will be at packages folder.

`tmp`: The temporary files, like cached configuration etc

`vendor`: All the 3rd party libraries, like Doctrine, Propel, Twig
what all you install via composer.

`web`: The web folder is the one that is exposed to the user.

We will talk more on Package organization and how to create your own 
package in the next chapter.
