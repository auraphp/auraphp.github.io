---
layout: docs
title: Installation
permalink: /framework/1.x/en/installation/
---

# Installation

Install via [Composer](http://getcomposer.org) to a `{$PROJECT_PATH}` of
your choosing:

    composer create-project aura/system {$PROJECT_PATH}

This will create the system skeleton and install all of the necessary
packages.

Once you have installed the Aura system, start the built-in PHP server with an
`Aura.Framework` CLI command:

    cd {$PROJECT_PATH}
    php package/Aura.Framework/cli/server

You can then open a browser and go to <http://0.0.0.0:8000> to see the "Hello
World!" demo output. Press `Ctrl-C` to stop the built-in PHP server.

Additionally, you can run a command-line check:

    cd {$PROJECT_PATH}
    php package/Aura.Framework_Demo/cli/hello

You should see "Hello World!" as the output.
