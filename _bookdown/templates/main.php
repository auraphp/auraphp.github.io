<?php
// default library templates
$library = dirname(__DIR__) . "/vendor/bookdown/bookdown/templates";

// project-specific templates
$project = __DIR__;

// register the templates
$templates = $this->getViewRegistry();
$templates->set("core", "{$library}/core.php");
$templates->set("navheader", "{$library}/navheader.php");
$templates->set("navfooter", "{$library}/navfooter.php");
$templates->set("toc", "{$library}/toc.php");
?>
---
layout: site
active: home
title: <?= $this->page->getTitle() . PHP_EOL; ?>
---

<?php echo $this->render("core"); ?>
