getLanguage = ->
  console.log "Getting language."
  lang = readCookie 'lang'
  if lang then lang else 'en'

setLanguage = (lang) ->
  console.log "Setting language."
  eraseCookie "lang"
  $("#pdf-download").attr "href", "/content/#{lang}/The-Way-#{lang}.pdf"
  $("#current-language").html($("a[data-language=\"#{lang}\"]").text() + "<b class=\"caret\"></b>")
  createCookie "lang", lang, 9001

getSection = ->
  console.log "Getting section."
  section = readCookie "section"
  if section then section else "index"

setSection = (section) ->
  console.log "Setting section."
  eraseCookie "section"
  createCookie "section", section, 9001

getContent = ->
  console.log "Getting content."
  lang = getLanguage()
  section = getSection()

  if section is "index"
    sectionNumber = "index"
  else
    sectionNumber = /^[0-9]+/.exec(section) if section

  $("#content").fadeOut 200, ->
      $("#spinner").spin({
        lines: 9
        length: 2
        width: 10
        radius: 20
      })

      $.ajax(
        url: "json.php?lang=" + lang + "&section=" + section
        dataType: "json"
      ).done (json) ->
        console.log json
        if json
          md = json.content.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/,'') # Delete HTML comments
          html = "<div class=\"tab-pane\" id=\"section-#{sectionNumber}\">#{md}</div>"
          $("#content").html html

          # Slide toggle
          $('.tab-pane h2').first().toggleClass 'first-question'
          $('h2').nextUntil('h2').toggleClass 'hide'
          $('h2').click ->
            $(this).nextUntil('h2').slideToggle 250
            $(this).toggleClass 'open'

          $("a[href=\"#section-#{sectionNumber}\"]").tab "show"
          $('#spinner').spin(false)
          $("#content").fadeIn 200


getSections = ->
  console.log "Getting sections."
  lang = getLanguage()
  setLanguage lang

  $("#content").fadeOut 200
  $("#sidebar").fadeOut 200, ->
    $.ajax(
      url: "json.php?lang=" + lang
      dataType: "json"
    ).done (json) ->
      $("#content").html json
      if json
        html = "<li class=\"nav-header\">Sections</li>"
        $.each json.items, (index, item) ->
          sectionNumber = /^[0-9]+/.exec(item.meta.slug)
          html += "<li><a href=\"#section-#{sectionNumber}\" data-section=\"#{item.meta.slug}\">#{/[^0-9-].*/.exec(item.meta.slug)[0].replace(/-/g, ' ')}</a></li>"

        $("#section-tabs").html html
        $("#sidebar").fadeIn 200
        $("a[data-section]").click (e) ->
          e.preventDefault()
          if $(this).parent().hasClass 'active' then return else $("a[data-section]").parent().removeClass 'active'
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
    return c.substring(nameEQ.length, c.length) if c.indexOf(nameEQ) is 0
    i++
  return null

eraseCookie = (name) ->
  createCookie name, "", -1

$(document).ready ->
  $("#spinner").spin({
    lines: 9
    length: 2
    width: 10
    radius: 20
  })

  $window = $(window)

  # side bar
  setTimeout (->
    $("#sidebar").affix offset:
      top: 40
      bottom: 0
  ), 100

  getSections()

  $("#lang-menu a").click (e) ->
    e.preventDefault()
    lang = $(this).attr('data-language')
    setLanguage lang
    eraseCookie 'section'
    getSections()
