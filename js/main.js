$(document).ready(function () {
    "use strict";

    $("nav > a").click(function (event) {
        var link = $(event.target),
            target = $(link.attr('href'));
        $(window).scrollTo(target, 500);
        event.stopPropagation();
        event.preventDefault();
    });
});
