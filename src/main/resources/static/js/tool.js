(function() {
    $(".opinion-list-wrapper").delegate('.opinion-delete', 'click', function() {
        var parent = $(this).parents('li');
        var iid = parseInt($("input[name=issue]").val());
        var oid = $(this).parents("li").data('opinion');
        var token = $("input[name=token]").val();
        var payload = {opinionId:oid, issueId:iid, token: token};

        if(confirm('댓글을 삭제하시겠습니까?')) {
            $.ajax({
                url:'/api/opinion',
                method:'delete',
                data: JSON.stringify(payload),
                contentType:'application/json'
            }).done(function(response) {
               if(response && response.result && response.result == "success") {
                   parent.remove();
               } else {
                   var message ="삭제에 실패하였습니다.";
                   if(response.message && response.message.length > 0) {
                       message = message + "\n["+response.message +"]";
                   }

                   alert(message);
               }
            });
        }
    });
    $(".opinion-list-wrapper").delegate(".opinion-report", 'click', function() {
        var iid = parseInt($("input[name=issue]").val());
        var oid = $(this).parents("li").data('opinion');
        var token = $("input[name=token]").val();
        var payload = {opinionId:oid, issueId:iid, token: token};

        if(confirm('댓글을 신고하시겠습니까?')) {
            $.ajax({
                url:'/api/report/opinion',
                method:'post',
                data: JSON.stringify(payload),
                contentType:'application/json'
            }).done(function(response) {
                if(response && response.result && response.result == "success") {
                    alert("정상적으로 접수되었습니다.");
                } else {
                    var message ="신고에 실패하였습니다.";
                    if(response.message && response.message.length > 0) {
                        message = message + "\n["+response.message +"]";
                    }

                    alert(message);
                }
            });
        }

    });
})();