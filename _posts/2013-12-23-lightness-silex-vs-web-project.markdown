---
title: Which is Lighter, Silex or Aura.Web_Project?
layout: post
tags : [v2, web, project]
author : Paul M. Jones
---

At least one commenter at [Reddit](http://www.reddit.com/r/PHP/comments/1sq7fi/lighter_than_silex_and_slimmer_than_slim_auraweb/) pointed [to this Silex article](https://igor.io/2013/09/02/how-heavy-is-silex.html) and used it as their basis for evaluating my claim that [Aura.Web_Project is lighter than Silex](http://auraphp.com/blog/2013/12/12/aura-v2-web-project/). Others had similar sentiments.

Too many people, including the Silex article author, use absolute terms like "light" and "heavy" and "bloated", instead of relative terms like "lighter" and "heavier" and "more bloated" and "less bloated", to describe software. Any time someone uses an absolute term like that, you need to ask: "Compared to what?" Always remember that there is no such thing as "bloated" or "heavy" or "light"; there is only "heavier" or "lighter" or "more bloated" or "less bloated" in comparison to something else.

I don't know if the measurements in that article are valid or useful for defining "what makes a microframework" but they do provide a basis for comparison. I understand that some people think "measuring (size|lines-of-code|number-of-classes) is stupid and it doesn't matter!" Maybe it is, maybe it's not. The author of the article seemed to think it was worthwhile to mention those numbers in relation to Silex, whether or not he thought they "mattered."

So, let's go with that article and use its approach to make a comparison between Silex and Aura.Web_Project to see if my earlier claim, using the terms and measurements outlined by the Silex post author, is accurate.

### Methodology

The Silex article does not define its measurement methodology as well as I would like. There are no steps listed so his results can be replicated, or so the process can be applied to other systems. This means I had to do a little guessing to figure out the author's process. I came up with the following:

1. Install the system in question and remove its tests.

2. Modify the `index.php` bootstrap script to show the classes actually used in a dynamic dispatch.

3. Run `du` to check disk usage.

4. Run `cloc` to count the non-comment non-blank lines of code (NCLOC) in the entire system.

5. Invoke the `index.php` bootstrap script to see a list of the classes actually used in a "standard request".

6. Given that list of classes, run `cloc` to count the non-comment non-blank lines of code (NCLOC) in the class files that are actually used in a "standard request".

The term "standard request" is from the Silex post. I don't know what the author means by that, so in this article it's a bare-bones invocation of the framework, a "Hello World" call that tells you the dynamic dispatch has been completed.

In order for you to see exactly what I did and what the the results were, here are links to [the script](https://gist.github.com/pmjones/8074310) and [the output](https://gist.github.com/pmjones/8074442). You can run the script yourself and see the results on your own system. If you notice anything wrong with the script or its output, please let me know so I can fix it and correct this article and its conclusions.

### Measurements and Comparisons

As you can see from the above script, we are comparing the bare-bones Silex 1.1.2 installation without any providers to a bare-bones Aura.Web_Project as installed via `composer create-project`.

I list the following measurements only because the original Silex article uses them. There are some measurement differences from the original article; I am willing to ascribe the differences to changes in the Silex codebase since that time.

#### Total Package Dependencies

- Silex: 7 [output](https://gist.github.com/pmjones/8074442#file-gistfile1-txt-L6-L29), not including itself
- Aura.Web_Project: 9 [output](https://gist.github.com/pmjones/8074442#file-gistfile1-txt-L59-L85)

Aura has two more package dependencies than Silex. Aura is minus an event handling system, but adds an Includer for reading config files, a Project_Kernel as the foundation for the Web_Kernel, and Monolog.

#### Total Disk Usage

- Silex: 2.6M [output](https://gist.github.com/pmjones/8074442#file-gistfile1-txt-L97-L101), althought original article states 3.5M
- Aura.Web_Project: 1.2M [output](https://gist.github.com/pmjones/8074442#file-gistfile1-txt-L103-L107)

In terms of bytes-on-disk, even with two more package dependencies, Aura.Web_Project is less than half the size of Silex.

#### Total Non-Comment Lines Of PHP Code

- Silex: 23327 [output](https://gist.github.com/pmjones/8074442#file-gistfile1-txt-L109-L121)
- Aura.Web_Project: 7465 [output](https://gist.github.com/pmjones/8074442#file-gistfile1-txt-L130-L142)

Even with two more package dependencies, Aura.Web_Project has 1/3 the NCLOC than Silex.

#### Total Class Count

The class-counting command is here: <https://gist.github.com/pmjones/8074310#file-gistfile1-sh-L97> and includes only classes and abstract classes, not interfaces or traits.

- Silex: 311 [output](https://gist.github.com/pmjones/8074442#file-gistfile1-txt-L149-L153)
- Aura.Web_Project: 148 [output](https://gist.github.com/pmjones/8074442#file-gistfile1-txt-L155-L159)

Even with two more dependencies, Aura.Web_Project has 1/2 the total class count of Silex.

#### "Actual Usage" Class Count

This is determined by doing an `array_diff()` between `get_declared_classes()` before and after the framework is invoked via a web server. It includes only classes and abstract classes, not interfaces or traits.

- Silex: 45 [output](https://gist.github.com/pmjones/8074442#file-gistfile1-txt-L161-L217); the original article claimed a "standard request" in Silex uses 50 classes, but the author did not state what a "standard request" was.

- Aura.Web_Project: 53 [output](https://gist.github.com/pmjones/8074442#file-gistfile1-txt-L221-L285)

In a bare-bones "hello world" that invokes only the dynamic dispatch cycle, Aura.Web_Project uses eight more classes (i.e., almost 1/5 more) than Silex.

Take a look at the actual class lists linked above. Note that Aura splits the request object into 21 (!) classes, and the response object into 7, for a total of 28 classes related to request and response handling. In Silex 1.1.2, I see only 8 request/response classes from Symfony HttpFoundation.  This means that similar functionality has been split across more classes in Aura.Web_Project.

#### "Actual Usage" Non-Comment Lines Of PHP Code

- Silex: 4388 [output](https://gist.github.com/pmjones/8074442#file-gistfile1-txt-L289-L301); The original article stated a total of 4018
- Aura.Web_Project: 3555 [output](https://gist.github.com/pmjones/8074442#file-gistfile1-txt-L306-L318)

Even though Aura.Web_Project uses eight more classes, its NCLOC count is only 81% that of Silex (i.e., almost 1/5 smaller).

#### Minimal Interface

At the end of the original article, the author states ...

> For the most part you will only ever deal with the following types:
> 
> - Silex\Application
> - Silex\Controller
> - Silex\Route
> - Symfony\Component\HttFoundation\Request
> - Symfony\Component\HttFoundation\Response
> - Pimple
> 
> ...
> 
> - Minimal interface > minimal lines of code.
> - Silex is quite lightweight.
> - The entire public API consists of 5 classes.

(The article summary says 5 classes, but there are 6 classes in that list. Because Silex\Application extends Pimple I think it's fair for the author not to count Pimple separately there.)

For Aura.Web_Project, "for the most part" there are only 4:

- Aura\Di
- Aura\Router
- Aura\Web\Request
- Aura\Web\Response

### Conclusion

Does all this mean it is true that Aura.Web_Project is lighter than Silex? It depends on how you measure:

- If you measure by the number of package dependencies, disregarding how similar functionality is split up between packages, then Silex is lighter.

- If you measure by the total disk usage, Aura.Web_Project is lighter.

- If you measure by the total NCLOC, Aura.Web_Project is lighter.

- If you measure by the total class count, Aura.Web_Project is lighter.

- If you measure by the acutual-usage class count, disregarding how similar functionality is split up among classes, then Silex is lighter.

- If you measure by the actual-usage NCLOC, Aura.Web_Project is lighter.

- If you measure by how many classes "for the most part" are in the public API, Aura.Web_Project is lighter.

In 5 of the 7 measures put forth by the original Silex article, Aura.Web_Project is the lighter of the two.  The original author's claim that "Silex is quite lightweight" might be true in some other way, but is it not as "lightweight" as Aura.Web_Project according to the measures he puts forth.
