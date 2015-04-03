---
layout: docs-de
title: Installation
permalink: /framework/1.x/de/installation/
---

# Installation

Installation mittels [Composer](http://getcomposer.org) in ein `{$PROJECT_PATH}` deiner
Wahl:

    composer create-project aura/system {$PROJECT_PATH}

Dies wird eine Grund-Struktur mit allen nötigen Bibliotheken (Dependencies) erstellen.

Nach der Installation kann der mit geliefterte PHP Server mittels des
`Aura.Framework` CLI Befehl gestartet werden:

    cd {$PROJECT_PATH}
    php package/Aura.Framework/cli/server

Wenn Du nun deinen Browser zu <http://0.0.0.0:8000> navigiertst, solltest Du die "Hello
World!" Demo sehen. Durch das Drücken von `Ctrl-C` stoppste Du den Server.

Zusätzlich kannst Du den Kommando-Zeilen Check ausführen:

    cd {$PROJECT_PATH}
    php package/Aura.Framework_Demo/cli/hello

Du solltest "Hello World!" sehen.
