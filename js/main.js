// Generated by CoffeeScript 1.4.0
(function() {
  var createCookie, eraseCookie, getContent, getLanguage, getSection, getSections, readCookie, setLanguage, setSection;

  getLanguage = function() {
    var lang;
    lang = readCookie('lang');
    if (lang) {
      return lang;
    } else {
      return 'en';
    }
  };

  setLanguage = function(lang) {
    eraseCookie("lang");
    return createCookie("lang", lang, 9001);
  };

  getSection = function() {
    var section;
    section = readCookie("section");
    if (section) {
      return section;
    } else {
      return $("#section-tabs a").first().attr('data-section');
    }
  };

  setSection = function(section) {
    eraseCookie("section");
    return createCookie("section", section, 9001);
  };

  getContent = function() {
    var lang, section, sectionNumber;
    lang = getLanguage();
    section = getSection();
    if (section) {
      sectionNumber = /^[0-9]+/.exec(section);
    }
    return $("#content").fadeOut(200, function() {
      $("#content").html("<h3>Loading...</h3>");
      return $("#content").fadeIn(200, function() {
        return $.ajax({
          url: "json.php?lang=" + lang + "&section=" + section,
          dataType: "json"
        }).done(function(json) {
          var decoded, html;
          if (json) {
            decoded = Base64.decode(json.content).replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/, '');
            html = "<div class=\"tab-pane\" id=\"section-" + sectionNumber + "\">" + (markdown.toHTML(decoded)) + "</div>";
            return $("#content").fadeOut(200, function() {
              $("#content").html(html);
              $("#section-tabs a[href=\"#section-" + sectionNumber + "\"]").tab("show");
              return $("#content").fadeIn(200);
            });
          }
        });
      });
    });
  };

  getSections = function() {
    var lang;
    lang = getLanguage();
    $("#content").fadeOut(200);
    return $("#section-tabs").fadeOut(200, function() {
      return $.ajax({
        url: "json.php?lang=" + lang,
        dataType: "json"
      }).done(function(json) {
        var html;
        $("#content").html(json);
        if (json) {
          html = "<li class=\"nav-header\">Sections</li>";
          $.each(json, function(index, item) {
            var sectionNumber;
            sectionNumber = /^[0-9]+/.exec(item.name);
            return html += "<li><a href=\"#section-" + sectionNumber + "\" data-section=\"" + item.name + "\">" + (/[^0-9-].*(?=.md)/.exec(item.name)[0].replace(/-/g, ' ')) + "</a></li>";
          });
          $("#section-tabs").html(html);
          $("#section-tabs").fadeIn(200);
          $("#section-tabs a").click(function(e) {
            e.preventDefault();
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
    $window = $(window);
    setTimeout((function() {
      return $("#section-tabs").affix({
        offset: {
          top: 40,
          bottom: 0
        }
      });
    }), 100);
    getSections();
    return $("#lang-menu a").click(function(e) {
      e.preventDefault();
      setLanguage($(this).attr('data-language'));
      eraseCookie('section');
      return getSections();
    });
  });

}).call(this);
