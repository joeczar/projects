(function () {
    ////////////// Handlebars Boilerplate DO NOT TOUCH!!! ///////////
    Handlebars.templates = Handlebars.templates || {};
    var templates = document.querySelectorAll(
        'script[type="text/x-handlebars-template"]'
    );
    Array.prototype.slice.call(templates).forEach(function (script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });
    ////////////// Handlebars Boilerplate DO NOT TOUCH!!! ///////////

    var win = $(window);
    var doc = $(document);
    var url = "https://spicedify.herokuapp.com/spotify";
    var container = $("#results-container");
    var input;
    var nextUrl;
    // var pageOne = false;

    $("#go").on("click", function (e) {
        container.html("");
        input = getUserInput();
        spicedifyRequest(url, input[0], input[1]);
    });

    function getUserInput() {
        var input = $("input[name=user-input]").val();
        var albumOrArtist = $("select").val().toLowerCase();
        return [input, albumOrArtist];
    }

    function spicedifyRequest(url, query, type) {
        $.ajax({
            url: url,
            method: "GET",
            data: {
                query: query,
                type: type,
            },
            success: function (response) {
                response = response.artists || response.albums;
                // updatePage(response);
                updateHandlebars(response);
                getNextUrl(response);

                // return response;
            },
            error: function (err) {
                console.log(err);
            },
        });
    }
    function updateHandlebars(response) {
        response.searchTerm = input[0];
        var handlebars = Handlebars.templates.spotiBars(response);
        isInfinite() ? container.append(handlebars) : container.html(handlebars);
        console.log(response);
    }
    // function updatePage(response) {
    //     var responseHtml = "";
    //     if (pageOne === false) {
    //         responseHtml = "";
    //         if (response.items.length === 0) {
    //             responseHtml =+
    //             '<span id="noResults">No results for ' + input[0] + "</span>";
    //             container.html(responseHtml);
    //         } else {
    //             responseHtml +=
    //             '<h1 id="responseHeader">Results for ' + input[0] + "</h1>";
    //         }
    //     }

    //     for (var i = 0; i < response.items.length; i++) {
    //         var url = response.items[i].external_urls.spotify;
    //         var name = response.items[i].name;
    //         var img = response.items[i].images[0]
    //             ? response.items[i].images[0].url
    //             : "https://www.svgrepo.com/show/55272/spotify.svg";
    //         responseHtml +=
    //     '<div class="items"><a href="' +
    //     url +
    //     '" target="blank"><div class="imgWrapper"><img src="' +
    //     img +
    //     '"></div><div class="itemName"><h2 class="name">' +
    //     name +
    //     "</h2></div></div>";
    //     }
    //     isInfinite() ? container.append(responseHtml) : container.html(responseHtml);
    //     pageOne = true;

    // }

    function getNextUrl(response) {
        nextUrl =
      response.next &&
      response.next.replace(
          "api.spotify.com/v1/search",
          "spicedify.herokuapp.com/spotify"
      );
        if (nextUrl && isInfinite()) {
            checkScroll();
        } else if (nextUrl) {
            nextResultsBtn(nextUrl, response);
        }
    }
    function nextResultsBtn(url, response) {
        var btn =
      '<button id="next">More</button><span id="howMany">Showing ' +
      response.offset +
      " - " +
      (response.limit + response.offset) +
      " of " +
      response.total +
      "</span>";
        container.append(btn);
        $("#results-container").on("click", "button", function (e) {
            spicedifyRequest(url, input[0], input[1]);
        });
    }

    function isInfinite() {
        var regex = new RegExp("^\\?scroll=infinite$");
        var queryString = $(location).attr("search");
        var test = regex.test(queryString);
        console.log(test);

        return test;
    }
    function checkScroll() {
        if (hasReachedBottom()) {
            // do same thing as in more except append new results
            console.log("bottmoned out");
            spicedifyRequest(nextUrl);
        } else {
            setTimeout(checkScroll, 500);
        }
    }
    /* 
        hwindow height, doc height, scroll top
    */
    function hasReachedBottom() {
        var winHeight = win.height();
        var docHeight = doc.height();
        var scrollTop = doc.scrollTop();
        if (docHeight - scrollTop <= winHeight + 200) {
            return true;
        } else {
            return false;
        }
    }
})();
