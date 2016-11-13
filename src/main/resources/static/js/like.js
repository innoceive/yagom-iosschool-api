(function() {
    $(".opinion-list-wrapper").delegate('.btn-like, .btn-dislike', 'click', function() {

        if($(this).siblings().hasClass('active')) {
            alert("이미 "+($(this).hasClass("btn-like")?"비":"")+"공감을 하셨습니다. 취소 후 다시 시도해주세요.");
            return;
        }

        var iId = parseInt($("input[name=issue]").val());
        var oid = $(this).parents("li").data('opinion');
        var token = $("input[name=token]").val();
        var recommend = $(this).hasClass("btn-like")?true:false;
        var method = $(this).hasClass("active")?'delete':'post';
        var count = parseInt($(this).find('.cnt').html());
        var payload = {issueId: iId, opinionId: oid, token: token, recommend: recommend};



        if($(this).hasClass('active')) {
            $(this).removeClass('active');
            if(count > 0) {
                $(this).find('.cnt').html(--count);
            }
        } else {
            $(this).addClass('active');
                $(this).find('.cnt').html(++count);
        }

        $.ajax({
            url:'/api/like',
            method: method,
            data: JSON.stringify(payload),
            contentType:'application/json'
        }).done(function(response) {
            console.log(response);
        });
    });
})();