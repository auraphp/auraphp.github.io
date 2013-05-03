<?php
$packages = [
    'Aura.Autoload' => '1.0.1',
    'Aura.Cli'      => '1.1.0',
    'Aura.Di'       => '1.1.0',
    'Aura.Filter'   => '1.0.0-beta1',
    'Aura.Http'     => '1.0.0',
    // 'Aura.Input'    => '1.0.0-dev',
    'Aura.Intl'     => '1.0.0-beta2',
    'Aura.Marshal'  => '1.0.0',
    'Aura.Router'   => '1.0.0',
    'Aura.Session'  => '1.0.0-beta1',
    'Aura.Signal'   => '1.0.0',
    'Aura.Sql'      => '1.0.0',
    'Aura.Uri'      => '1.1.0',
    'Aura.View'     => '1.1.0',
    'Aura.Web'      => '1.0.0',
];

$html = [];

$html[] = "Package | "
        . "Description | "
        . "API Version | "
        . "Release Date | "
        . "Downloads | "
        . "Development ";

$html[] = "--- | "
        . "--- | "
        . "--- | "
        . "--- | "
        . "--- | "
        . "--- ";

foreach ($packages as $package => $version) {
    echo "{$package} ...\n";
    $json = json_decode(file_get_contents(
        "https://raw.github.com/auraphp/{$package}/master/composer.json"
    ));
    $name = substr($package, 5);
    $html[] = "[{$name}](/{$package}) | "
            . str_replace("\n", " ", $json->description) . " | "
            . "[{$version}](/{$package}/version/{$version}/api) | "
            . "{$json->time} | "
            . "[.zip](https://github.com/auraphp/{$package}/zipball/{$version}), "
            . "[.tar.gz](https://github.com/auraphp/{$package}/tarball/{$version}) | "
            . "[Github](https://github.com/auraphp/{$package})";
}

$html[] = "";
file_put_contents(dirname(__DIR__) . '/_includes/packages.md', implode("\n", $html));
echo "Done.\n";
