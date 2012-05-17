$(function(){
  
  var TE = {
    // name of subdirectory themes are in.
    namespace : 'preview', 
    $container : $("#theme_explorer"),
    $themesWrap : $("#te_themes"),
    $installBtn : $("#te_install"),
    $modal : $("#modal"),
    $toggler : $("#theme_explorer_hide"),
    modalTmpl : $("#modal_tmpl").html(),
    themesTmpl : $("#te_themes_tmpl").html(),
    themes : [],
    
    // initialize theme explorer
    init : function(){
      TE.$toggler.click(function(e){
        TE.toggle();
        e.preventDefault();
        return false;
      })
      
      TE.$installBtn.click(function(e){
        TE.$modal.modal();
        e.preventDefault();
        return false;
      })

      $.getJSON("/"+TE.namespace+"/data.json", function(data){
        TE.themes = data;
        TE.loadThemes();
        TE.setActiveTheme();
      })
    },
  
    // populate themes into theme explorer
    loadThemes : function(){
      TE.$themesWrap.html(
        $.mustache(TE.themesTmpl, {
          themes : TE.themes, 
          buildUrl : function(){ 
            return function(name, render) {return render( TE.buildUrl(name) ) }
          }
        })
      );
    },
    
    // return theme object by name  
    getTheme : function(theme_name){
      var t;
      $.each(TE.themes, function(){
        if(this.name === theme_name){ t = this; return false }
      })
      return t;
    },
    
    // get theme for current page.
    // assumes "twitter" theme for homepage
    // returns (String) themeName
    currentThemeName : function(){
      var arr = location.pathname.split("/");
      return (arr[1] === TE.namespace) ? arr[2] : "twitter";
    },
    
    // Set current active theme
    // set installer url, highlight theme, display meta-data
    setActiveTheme : function(){
      var theme = TE.getTheme(TE.currentThemeName());
      if(theme){
        var url = TE.$installBtn.attr("href");
        TE.$themesWrap.find("a."+ theme.name).addClass("active");
        
        // pre-populate modal with data
        TE.$modal.html(
          $.mustache(TE.modalTmpl, TE.getTheme(TE.currentThemeName()))
        );
      }
    },

    // builds the Url for the given themeName
    buildUrl : function(themeName){
      var arr = location.pathname.split("/");
      if   (arr[1] === TE.namespace)  arr[2] = themeName;
      else { arr.shift(); arr.unshift("", TE.namespace, themeName) }
      return arr.join("/");
    },
    
    // show/hide theme explorer
    toggle : function(){
      TE.$container.animate({
        bottom: parseInt(TE.$container.css('bottom'),10) == 0 ? -TE.$container.outerHeight() : 0
      });
      TE.$toggler.text( (TE.$toggler.text() === "HIDE") ? "SHOW" : "HIDE" );
    }
    
  }

  TE.init();
})