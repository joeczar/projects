(function () {
    // Get links
    getLinks("./ticker/links.json", "#headlines", tick);
    getLinks("./ticker/bLinks.json", "#bottomHeadlines", bottomTick);

    function getLinks(url, linkDiv, animate) {
        $.ajax({
            url: "/" + url,
            method: "GET",
            success: function (response) {
                var html = "";
                for (var i = 0; i < response.length; i++) {
                    var link =
                        '<a id="link_' +
                        i +
                        ' href="' +
                        response[i].link +
                        '" > ' +
                        response[i].headline +
                        "</a>";
                    html += link;
                }
                $(linkDiv).html(html);
                animate();
            },
            error: function (err) {
                console.log("Ajax Error:", err);
            },
        });
    }

    function tick() {
        var headlines = $("#headlines");
        var links = headlines.find("a");
        var left = headlines.offset().left;
        var step;
        // top event listeners
        headlines.on("mouseover", function (e) {
            $(e.target).css({ color: "red" });
            cancelAnimationFrame(step);
        });
        headlines.on("mouseout", function (e) {
            $(e.target).css({
                textDecoration: "none",
                color: "white",
            });
            window.requestAnimationFrame(moveHeadlines);
        });

        var count = 0;
        function moveHeadlines() {
            left--;
            var width = links.eq(count).outerWidth();

            // move top headlines
            if (left <= -width) {
                left += width;
                headlines.append(links.eq(count));
                count++;
                if (count > links.length - 1) {
                    count = 0;
                }
            }
            headlines.css({ left: left + "px" });
            step = window.requestAnimationFrame(moveHeadlines);
        }
        step = window.requestAnimationFrame(moveHeadlines);
    }
    //bottomTick()
    function bottomTick() {
        // Bottom Ticker
        var headlines = $("#bottomHeadlines");
        var links = headlines.find("A");

        var right = -headlines.outerWidth();
        var lastLink = links.length - 1;

        function moveHeadlines() {
            right++;

            var width = links.eq(lastLink).outerWidth();

            if (right >= -width) {
                right -= width;
                headlines.prepend(links.eq(lastLink));
                lastLink--;
                width = links.eq(lastLink).outerWidth();
                if (lastLink === 0) {
                    lastLink = links.length - 1;
                }
            }

            headlines.css({ left: right + "px" });
            step = window.requestAnimationFrame(moveHeadlines);
        }
        step = window.requestAnimationFrame(moveHeadlines);
    }

    var degrees = 0;
    var pentagram = $("#pentagram");

    window.requestAnimationFrame(spinPentagram);
    function spinPentagram() {
        degrees++;
        if (degrees > 360) {
            degrees = 0;
        }

        pentagram.css({ transform: "rotate(" + degrees + "deg)" });
        pentagram.css({ "-moz-transform": "rotate(" + degrees + "deg)" });
        window.requestAnimationFrame(spinPentagram);
    }
})();
