getLanguage = ->
  lang = readCookie 'lang'
  if lang then lang else 'en'

setLanguage = (lang) ->
  eraseCookie "lang"
  createCookie "lang", lang, 9001

getSection = ->
  section = readCookie "section"
  if section then section else $("#section-tabs a").first().attr('data-section')

setSection = (section) ->
  eraseCookie "section"
  createCookie "section", section, 9001

getContent = ->
  lang = getLanguage()
  section = getSection()
  sectionNumber = /^[0-9]+/.exec(section) if section

  $("#content").fadeOut 200, ->
    $("#content").html "<h3>Loading...</h3>"
    $("#content").fadeIn 200, ->
      $.ajax(
        url: "json.php?lang=" + lang + "&section=" + section
        dataType: "json"
      ).done (json) ->
        if json
          decoded = Base64.decode(json.content).replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/,'') # Delete HTML comments
          html = "<div class=\"tab-pane\" id=\"section-#{sectionNumber}\">#{markdown.toHTML(decoded)}</div>"
          $("#content").fadeOut 200, ->
            $("#content").html html

            # Slide toggle
            $('.tab-pane h2').first().toggleClass 'first-question'
            $('h2').nextUntil('h2').toggleClass 'hide'
            $('h2').click ->
                $(this).nextUntil('h2').slideToggle 250
                $(this).toggleClass 'open'

            $("#section-tabs a[href=\"#section-#{sectionNumber}\"]").tab "show"
            $("#content").fadeIn 200


getSections = ->
  lang = getLanguage()

  $("#content").fadeOut 200
  $("#section-tabs").fadeOut 200, ->
    $.ajax(
      url: "json.php?lang=" + lang
      dataType: "json"
    ).done (json) ->
      $("#content").html json
      if json
        html = "<li class=\"nav-header\">Sections</li>"
        $.each json, (index, item) ->
          unless /.md/.test(item.name) then return true
          sectionNumber = /^[0-9]+/.exec(item.name)
          html += "<li><a href=\"#section-#{sectionNumber}\" data-section=\"#{item.name}\">#{/[^0-9-].*(?=.md)/.exec(item.name)[0].replace(/-/g, ' ')}</a></li>"

        $("#section-tabs").html html
        $("#section-tabs").fadeIn 200
        $("#section-tabs a").click (e) ->
          e.preventDefault()
          $("html, body").animate({ scrollTop: 0 }, 400)
          setSection $(this).attr('data-section')
          getContent()
        getContent()

createCookie = (name, value, days) ->
  if days
    date = new Date()
    date.setTime date.getTime() + (days * 24 * 60 * 60 * 1000)
    expires = "; expires=" + date.toGMTString()
  else
    expires = ""
  document.cookie = name + "=" + value + expires + "; path=/"

readCookie = (name) ->
  nameEQ = name + "="
  ca = document.cookie.split(";")
  i = 0

  while i < ca.length
    c = ca[i]
    c = c.substring(1, c.length)  while c.charAt(0) is " "
    return c.substring(nameEQ.length, c.length)  if c.indexOf(nameEQ) is 0
    i++
  return null

eraseCookie = (name) ->
  createCookie name, "", -1

$(document).ready ->
  $window = $(window)

  # side bar
  setTimeout (->
    $("#section-tabs").affix offset:
      top: 40
      bottom: 0
  ), 100

  getSections()

  $("#lang-menu a").click (e) ->
    e.preventDefault()
    setLanguage $(this).attr('data-language')
    eraseCookie 'section'
    getSections()

