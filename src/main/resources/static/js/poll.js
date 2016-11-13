(function() {
    if($.cookie(location.pathname)) {
        var payload = JSON.parse($.cookie(location.pathname));
        if(payload && payload.poll) {
            $(".selection-wrapper td.selected").removeClass("selected");
            $(".selection-wrapper").find('td[data-opinion="'+payload.poll+'"]').addClass('selected');
        }
    } else {
        $(".comment-wrapper").hide();
    }

    $(".selection-wrapper td").click(function() {
        console.log();
        if($(".comment-wrapper").not(':visible')) {
            $(".comment-wrapper").show();
        }
        $(".selection-wrapper td.selected").removeClass("selected");
        var payload = {poll: $(this).data('opinion')};
        $.cookie(location.pathname, JSON.stringify(payload));
        $(this).addClass("selected");
    });
})();