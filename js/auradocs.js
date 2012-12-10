jQuery(function($) {
  //modified version of http://stackoverflow.com/questions/5511458/jquery-making-content-based-on-h1-h2-h3-tags
  var ul = null;
  var lasth1 = null;
  var lasth1ul = null;
  var lasth2 = null;
  var lasth2ul = null;

  $("h1, h2, h3").each(function() {

    switch (this.tagName.toLowerCase()) {
      case "h1":
        if (!ul) {
          ul = $('<ul class="nav nav-list bs-docs-sidenav bs-docs-sidebar">');
        }
        lasth1 = $("<li>").html('<a href="#' + this.id + '">' + $(this).html() + '</a>').appendTo(ul);
        lasth1ul = null;
        lasth2ul = null;
        break;
      case "h2":
        if (!lasth1) {
          // Deal with invalid condition, h2 with no h1 before it
        }
        else {
          if (!lasth1ul) {
            lasth1ul = $('<ul class="nav nav-list bs-docs-sidenav">').appendTo(lasth1);
          }
          lasth2 = $("<li>").html('<a href="#' + this.id + '"> <i class="icon-hand-right"></i>&nbsp;' + $(this).html() + '</a>').appendTo(lasth1ul);
        }
        break;
      case "h3":
        if (!lasth2) {
          // Deal with invalid condition, h3 with no h2 before it
        }
        else {
          if (!lasth2ul) {
            lasth2ul = $('<ul class="nav nav-list">').appendTo(lasth2);
          }
          $("<li>").html('<a href="#' + this.id + '">' + $(this).html() + '</a>').appendTo(lasth2ul);
        }
        break;
    }

  });
  if (ul) {
    $("#sidebar").append(ul);
    $('.bs-docs-sidebar').affix();
  }
  $('.nav-list > li > a').live('click', function() {
    var id = $(this).attr('href');
    $('html,body').animate({scrollTop: $(id).offset().top - 40},'slow');
  });
});

$(document).ready(function() {
    $('#switch').change(function() {
      var sheet = $("select option:selected").text();
      $('link[rel*=style][title]').each(function(i) {
        this.disabled = true;
        if (this.getAttribute('title') == sheet) 
          this.disabled = false;
      });
    });
});
