
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $images = $('#outputDiv')

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    $images.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    //var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    //var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to check out ' + cityStr + '?');

    // var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    //$body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // Your NYTimes AJAX request goes here
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=Te7ZJ3ErPD4AvK5OIs8NbGxZJZ7c0MZo'
    $.getJSON(nytimesUrl, function (data) {
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + '<a href="' + article.web_url + '">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
        };
    }).error(function (e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    // Wikipedia AJAX request goes here
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function () {
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        // jsonp: "callback",
        success: function (response) {
            var articleList = response[1];
            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }

    });


    var flickerAPI = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=" + cityStr;
    $.ajax({
        url: flickerAPI,
        dataType: "jsonp", // jsonp
        jsonpCallback: 'jsonFlickrFeed', // add this property
        success: function (result, status, xhr) {
            $.each(result.items, function (i, item) {
                $("<img>").attr("src", item.media.m).appendTo("#outputDiv");
                if (i === 20) {
                    return false;
                }
            });
        },
        error: function (xhr, status, error) {
            console.log(xhr)
            $("#outputDiv").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
    });


    $.getJSON("https://api.openweathermap.org/data/2.5/weather?q=" + cityStr + "&units=metric&appid=32b8cd17f2ff5d84d72342dd7408bab2", function (data) {
        console.log(data);
        var icon = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
        var weather = data.weather[0].main;
        var desc = data.weather[0].description;
        var temp = data.main.temp;
        var min = data.main.temp_min;
        var max = data.main.temp_max;
        var temp1 = temp + "℃";
        var min1 = min + "℃";
        var max1 = max + "℃";
        $("#icon").attr("src", icon);
        document.getElementById('weather').innerHTML = weather;
        document.getElementById('desc').innerHTML = desc;
        document.getElementById('temp').innerHTML = temp1;
        document.getElementById('min').innerHTML = min1;
        document.getElementById('max').innerHTML = max1;
    });








    return false;
};

$('#form-container').submit(loadData);
