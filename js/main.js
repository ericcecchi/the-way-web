// Generated by CoffeeScript 1.9.1
(function() {
  var createCookie, eraseCookie, getContent, getLanguage, getSection, getSections, readCookie, setLanguage, setSection;

  getLanguage = function() {
    var lang;
    console.log("Getting language.");
    lang = readCookie('lang');
    if (lang) {
      return lang;
    } else {
      return 'en';
    }
  };

  setLanguage = function(lang) {
    console.log("Setting language.");
    eraseCookie("lang");
    $("#pdf-download").attr("href", "/content/" + lang + "/The-Way-" + lang + ".pdf");
    $("#current-language").html($("a[data-language=\"" + lang + "\"]").text() + "<b class=\"caret\"></b>");
    return createCookie("lang", lang, 9001);
  };

  getSection = function() {
    var section;
    console.log("Getting section.");
    section = readCookie("section");
    if (section) {
      return section;
    } else {
      return "index";
    }
  };

  setSection = function(section) {
    console.log("Setting section.");
    eraseCookie("section");
    return createCookie("section", section, 9001);
  };

  getContent = function() {
    var lang, section, sectionNumber;
    console.log("Getting content.");
    lang = getLanguage();
    section = getSection();
    if (section === "index") {
      sectionNumber = "index";
    } else {
      if (section) {
        sectionNumber = /^[0-9]+/.exec(section);
      }
    }
    return $("#content").fadeOut(200, function() {
      $("#spinner").spin({
        lines: 9,
        length: 2,
        width: 10,
        radius: 20
      });
      return $.ajax({
        url: "json.php?lang=" + lang + "&section=" + section,
        dataType: "json"
      }).done(function(json) {
        var html, md;
        console.log(json);
        if (json) {
          md = json.content.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/, '');
          html = "<div class=\"tab-pane\" id=\"section-" + sectionNumber + "\">" + md + "</div>";
          $("#content").html(html);
          $('.tab-pane h2').first().toggleClass('first-question');
          $('h2').nextUntil('h2').toggleClass('hide');
          $('h2').click(function() {
            $(this).nextUntil('h2').slideToggle(250);
            return $(this).toggleClass('open');
          });
          $("a[href=\"#section-" + sectionNumber + "\"]").tab("show");
          $('#spinner').spin(false);
          return $("#content").fadeIn(200);
        }
      });
    });
  };

  getSections = function() {
    var lang;
    console.log("Getting sections.");
    lang = getLanguage();
    setLanguage(lang);
    $("#content").fadeOut(200);
    return $("#sidebar").fadeOut(200, function() {
      return $.ajax({
        url: "json.php?lang=" + lang,
        dataType: "json"
      }).done(function(json) {
        var html;
        $("#content").html(json);
        if (json) {
          html = "<li class=\"nav-header\">Sections</li>";
          $.each(json.items, function(index, item) {
            var sectionNumber;
            sectionNumber = /^[0-9]+/.exec(item.meta.slug);
            return html += "<li><a href=\"#section-" + sectionNumber + "\" data-section=\"" + item.meta.slug + "\">" + (/[^0-9-].*/.exec(item.meta.slug)[0].replace(/-/g, ' ')) + "</a></li>";
          });
          $("#section-tabs").html(html);
          $("#sidebar").fadeIn(200);
          $("a[data-section]").click(function(e) {
            e.preventDefault();
            if ($(this).parent().hasClass('active')) {
              return;
            } else {
              $("a[data-section]").parent().removeClass('active');
            }
            $("html, body").animate({
              scrollTop: 0
            }, 400);
            setSection($(this).attr('data-section'));
            return getContent();
          });
          return getContent();
        }
      });
    });
  };

  createCookie = function(name, value, days) {
    var date, expires;
    if (days) {
      date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    } else {
      expires = "";
    }
    return document.cookie = name + "=" + value + expires + "; path=/";
  };

  readCookie = function(name) {
    var c, ca, i, nameEQ;
    nameEQ = name + "=";
    ca = document.cookie.split(";");
    i = 0;
    while (i < ca.length) {
      c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
      i++;
    }
    return null;
  };

  eraseCookie = function(name) {
    return createCookie(name, "", -1);
  };

  $(document).ready(function() {
    var $window;
    $("#spinner").spin({
      lines: 9,
      length: 2,
      width: 10,
      radius: 20
    });
    $window = $(window);
    setTimeout((function() {
      return $("#sidebar").affix({
        offset: {
          top: 40,
          bottom: 0
        }
      });
    }), 100);
    getSections();
    return $("#lang-menu a").click(function(e) {
      var lang;
      e.preventDefault();
      lang = $(this).attr('data-language');
      setLanguage(lang);
      eraseCookie('section');
      return getSections();
    });
  });

}).call(this);
