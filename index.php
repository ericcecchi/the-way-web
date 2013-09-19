<?php
$expire = time() + 31536000;
function delete_cookies() {
  // unset all cookies
  if (isset($_SERVER['HTTP_COOKIE'])) {
      $cookies = explode(';', $_SERVER['HTTP_COOKIE']);
      foreach($cookies as $cookie) {
          $parts = explode('=', $cookie);
          $name = trim($parts[0]);
          setcookie($name, '', time()-1000);
          setcookie($name, '', time()-1000, '/');
      }
  }
}

if (isset($_GET["js"])) {
  delete_cookies();
  $enable_js = $_GET["js"];
  setcookie('js', $enable_js, $expire, '/');
}
elseif (isset($_COOKIE["js"])) {
  $enable_js = $_COOKIE["js"];
}
else {
  $enable_js = 'true';
  setcookie('js', 'true', $expire, '/');
}

if ($enable_js == 'true') {
  echo file_get_contents('dynamic.html');
}
else {

function get_json($params) {
  $prefix = 'http://';
  $domain = $_SERVER['HTTP_HOST'];
  $path = '/theway/json.php';
  $url = $prefix.$domain.$path.$params;

  $curl = curl_init();

  // Set some options - we are passing in a useragent too here
  curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => $url,
  ));

  // Send the request & save response to $resp
  $resp = curl_exec($curl);
  $json =  json_decode($resp, TRUE);
  curl_close($curl);
  return $json;
}

if (isset($_GET["lang"])) {
  $lang = $_GET["lang"];
  setcookie('lang', $lang, $expire, '/');
}
else {
  $lang = isset($_COOKIE["lang"]) ? $_COOKIE["lang"] : 'en';
  setcookie('lang', $lang, $expire, '/');
}

$sections = get_json('?lang='.$lang);

if (isset($_GET['section'])) {
  $section = $_GET["section"];
}
elseif (isset($_GET["lang"])) {
  $section = $sections['items'][0]['meta']['slug'];
}
else {
  $section = isset($_COOKIE["section"]) ? $_COOKIE["section"] : $sections['items'][0]['meta']['slug'];
}
setcookie('section', $section, $expire, '/');

$content = get_json('?lang='.$lang.'&section='.$section);
$content = $content['content'];

?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>The Way, by GoldenRipe</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/bootstrap-responsive.min.css">
        <link rel="stylesheet" href="css/main-no-js.css">
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an outdated browser. <a href="http://browsehappy.com/">Upgrade your browser today</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to better experience this site.</p>
        <![endif]-->

        <!-- This code is taken from http://twitter.github.com/bootstrap/examples/hero.html -->

        <div class="container">
            <div class="navbar">
                <div class="navbar-inner">
                    <div class="container">
                        <a class="brand" href="#">The Way</a>
                        <ul class="nav pull-right">
                          <li><a href="/theway/?lang=en">English</a></li>
                          <li><a href="/theway/?lang=in" data-language="in">Bahasa Indonesia</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="span3">
                    <div id="sidebar">
                        <ul id="section-tabs" class="nav nav-pills nav-stacked">
                          <li class="nav-header">Sections</li>
                          <?php
                          foreach ($sections['items'] as $a_section) {
                            if ($a_section['meta']['slug'] == $section) {
                              echo '<li class="active">';
                            }
                            else {
                              echo '<li>';
                            }
                          ?><a href="/theway/<?php echo $a_section['meta']['slug']; ?>"><?php echo preg_replace('/-/', ' ', preg_replace('/^[0-9-]*/', '', $a_section['meta']['slug'])); ?></a></li>
                          <?php } ?>
                        </ul>
                        <ul id="links" class="nav nav-pills nav-stacked">
                            <li class="nav-header">Links</li>
                            <li><a id="pdf-download" href="/theway/content/<?php echo $lang; ?>/The-Way-<?php echo $lang; ?>.pdf">Download PDF</a></li>
                            <li><a href="//goldenripe.org/app/ask">Ask a question</a></li>
                            <li><a href="//goldenripe.org/a[[/respond">Learn more</a></li>
                        </ul>
                    </div>
                    <br>
                </div>
                <div id="content" class="tab-content span9">
                  <?php echo $content; ?>
                </div>
            </div>

            <hr>

            <footer>
                <p>Got Javascript? Try switching to the dynamic <a href="/theway/?js=true">web app</a>.</p>
                <p>&copy; 2013 GoldenRipe. Web app developed by <a href="//back3nd.com">Eric Cecchi</a>. Content by <a href="//goldenripe.org">GoldenRipe</a>.</p>
            </footer>

        </div> <!-- /container -->
    </body>
</html>

<?php } ?>