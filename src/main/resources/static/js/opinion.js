(function() {
    var issueId = parseInt($("input[name=issue]").val());
    var token = $("input[name=token]").val();
    var isLoading = false;
    var isPageEnd = false;
    var autoRefresh = false;
    var maxCommentLength = 300;
    var minCommentLength = 10;

    if(!$.cookie('dpn_p_ar')) {
        $.cookie('dpn_p_ar', autoRefresh);
    }
    autoRefresh = $.cookie('dpn_p_ar') == "true" ? true:false;
    if(autoRefresh == true) {
        $(".btn-refresh").addClass("active");
    } else {
        $(".btn-refresh").removeClass("active");
    }

    var reloadOpinion = function() {
        if(autoRefresh == true) {
            var afterId = $(".opinion-list li:first").data('opinion');
            if(!afterId) {
                afterId = 0;
            }

            if(issueId != undefined && issueId != null && afterId != undefined && afterId != null && token != undefined && token != null) {
                $.ajax({
                    url:'/api/opinion/reload/'+issueId+'/'+afterId+'?token='+token,
                    method:'get'
                }).done(function(response) {
                    if(response.result == 'success') {
                        for(var i = 0; i < response.opinion.length; i++) {
                            prependOpinion(response.opinion[i]);
                        }
                        updatePoll(response.poll);
                    }
                });
            }
        }
    }
    setInterval(reloadOpinion, 60*1000);    // 1분 간격 새로고침

    var toggleAutoRefresh = function() {
        if($(".btn-refresh").hasClass("active")) {
            $(".btn-refresh").removeClass("active");
            autoRefresh = false;
        } else {
            $(".btn-refresh").addClass("active");
            autoRefresh = true;
        }
        $.cookie('dpn_p_ar', autoRefresh);
    }

    $(".btn-refresh").click(function() {
        toggleAutoRefresh();
    });

    var showAjax = function() {
        $("body").css('overflow', 'hidden');
        $("#ajax").show();
    }

    var hideAjax = function() {
        $("body").css('overflow', '');
        $("#ajax").hide();
    }


    var updatePoll = function(poll) {
        var type = ['primary','danger','success','warning','info'];
        poll.sort(function(a, b) {
            return parseFloat(b.count) - parseFloat(a.count);
        });


        $(".progress-wrapper").html('');

        for(var i = 0; i < poll.length; i++) {
            var pollPercent = parseInt(poll[i].count);
            var guide = poll[i].poll+" (&nbsp;&asymp;&nbsp;"+pollPercent+"% )";
            var label = $("<h4>").html('<i class="fa fa-check-square-o" aria-hidden="true"></i> '+guide);
            var root = $("<div>").addClass('progress');
            var bar = $('<div aria-valuemin="0" aria-valuemax="100" role="progressbar">')
                .addClass('progress-bar progress-bar-'+type[i]).attr('aria-valuenow', pollPercent).css('width', pollPercent+'%').html(guide);
            root.append(bar);
            $(".progress-wrapper").append(label).append(root);
        }

    }

    var loadOpinion = function(issueId, beforeId, token) {
        isLoading = true;
        if(!beforeId) {
            beforeId = 0;
        } else {
            showAjax();
        }
        $.ajax({
            url: '/api/opinion/more/'+issueId+'/'+beforeId+'?token='+token,
            method: 'get'
        }).done(function(response) {
            if(response.opinion.length < 1) {
                isPageEnd = true;
            }
            for(var i = 0; i < response.opinion.length; i++) {
                appendOpinion(response.opinion[i]);
            }
            if(response.poll) {
                updatePoll(response.poll);
            }
            hideAjax();
            isLoading = false;
        });
    }



    $(".opinion-wrapper input[type=text]").focusin(function() {
        var text = $(".opinion-wrapper textarea").val();
        $(this).val(text.length + "/" + maxCommentLength);
        $(".opinion-wrapper .textarea-wrapper").show().find('textarea').focus();
    });

    $("textarea").keyup(function(e) {
        var text = $(this).val();
        if(text.length > maxCommentLength) {
            alert("최대 " + maxCommentLength + "까지만 입력 가능합니다.");
            text = text.substring(0, maxCommentLength);
            $(this).val(text).focus();
        }
        $(".opinion-wrapper input[type=text]").val(text.length + "/" + maxCommentLength);
    });

    $("button[type=submit]").click(function() {
        var lastId = $('.opinion-list li:first').data('opinion');

        var opinion = $("textarea").val();
        var poll = $(".selection-wrapper td.selected").html();
        var payload = {token: token, issueId: issueId, poll: poll, opinion: opinion, lastId: lastId};

        if(!poll) {
            alert('선택지를 반드시 선택해주세요.');
            return false;
        }

        if(opinion.trim().length < minCommentLength) {
            alert('최소 ' + minCommentLength + '자 이상 입력해주세요.');
            $("textarea").focus();
            return false;
        }

        if(!isLoading) {
            isLoading = true;
            showAjax();
            $.ajax({
                url:'/api/opinion',
                method: 'post',
                contentType:'application/json',
                data: JSON.stringify(payload)
            }).done(function(response) {
                isLoading = false;
                hideAjax();
                if(response.result == 'success') {
                    $("textarea").val('');
                    for(var i = 0; i < response.opinion.length; i++) {
                        prependOpinion(response.opinion[i]);
                    }
                    updatePoll(response.poll);
                } else {
                    if(response && response.message && response.message.length > 0) {
                        alert(response.message);
                    }
                }
            });
        }
    });

    $(window).scroll(function() {
        var beforeId = $(".opinion-list li:last").data('opinion');
        var offset = 100;
        var $w = $(window);
        if($w.scrollTop() + $w.height() > $(document).height() - offset) {
            if(!isPageEnd && !isLoading){
                loadOpinion(issueId, beforeId, token);
            }
        }
    });

    (function() {
        loadOpinion(issueId, 0, token);
    })();



    var generateOpinionElement = function(data) {
        if(data.content.trim().length < 10) {
            return;
        }
        /* root */
        var root = $("<li>").attr("data-opinion", data.id);

        /* head wrapper */
        var head = $("<div>").addClass("opinion-head");
        var nickname = $("<div>").addClass("opinion-nickname").html((data.user.anonymous?'<i class="fa fa-user-secret" aria-hidden="true"></i>':'<i class="fa fa-check-circle" aria-hidden="true"></i>') +'&nbsp;' + data.user.nickname);
        var datetime = $("<div>").addClass("opinion-datetime").html(moment(data.createDate).locale('ko').fromNow());

        head.append(nickname);
        if(data.user.mine) {
            head.append(close);
        }
        head.append(datetime);

        var tool = $("<div>").addClass("opinion-tool");
        if(data.user.mine) {
            var close = $("<a href='javascript:;'>").addClass("opinion-delete").html('<i class="fa fa-times" aria-hidden="true"></i>&nbsp;삭제하기');
            tool.append(close);
        } else {
            var report = $("<a href='javascript:;'>").addClass("opinion-report").html('<i class="fa fa-ban" aria-hidden="true"></i>&nbsp;신고하기');
            tool.append(report);
        }

        /* body wrapper */
        var body = $("<div>").addClass("opinion-body").html(data.content);

        /* like wrapper */
        var like = $("<div>").addClass("like-wrapper")
            .append('<a class="btn-like'+ (data.recommended?' active':'') + '" href="javascript:;"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i><span class="lbl">공감</span><span class="cnt">'+data.recommendCount+'</span></a>')
            .append('<a class="btn-dislike'+ (data.unrecommended?' active':'') + ''+''+'" href="javascript:;"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i><span class="lbl">비공감</span><span class="cnt">'+data.unrecommendCount+'</span></a>');

        return root.append(head).append(body).append(tool).append(like);
    }

    var prependOpinion = function(data) {
        $(".opinion-list").prepend(generateOpinionElement(data));
    }
    var appendOpinion = function(data) {
        $(".opinion-list").append(generateOpinionElement(data));
    }



})();