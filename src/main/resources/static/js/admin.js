(function() {
    var payload = {
        title:null,
        imageUrl:null,
        option1:null,
        option2:null,
        yonhap:null,
        ytn:null,
        chosun:null,
        khan:null,
        joins:null,
        hani:null,
        donga:null
    };

    var getOpenGraph = function (item) {
        var channel = item.prev().attr('for');
        var $parent = item.parents(".form-group");
        var link = item.val();
        if(!link) {
            $parent.addClass("has-warning");
        } else {
            link = link.trim();
            $parent.removeClass("has-warning");

            $.ajax({
                url:'/api/og?target='+encodeURIComponent(link),
                method: 'get'
            }).done(function(response) {
                $parent.find(".media").remove();
                if(response.result == "success") {
                    $parent.append(ogBuilder(response.data));
                    $parent.removeClass('has-error').removeClass('has-warning').addClass('has-success');
                } else {
                    link = null;
                    $parent.removeClass('has-success').removeClass('has-warning').addClass('has-error');
                }
                payload[channel] = link;
                $.cookie('dpn_a_ic', JSON.stringify(payload));

            });
        }
    }

    if($.cookie('dpn_a_ic')) {
        payload = JSON.parse($.cookie('dpn_a_ic'));
    }

    if(payload.title) {
        $('input[name=title]').val(payload.title);
    }
    if(payload.option1) {
        $('input[name=option1]').val(payload.option1);
    }
    if(payload.option2) {
        $('input[name=option2]').val(payload.option2);
    }

    if(payload.yonhap) {
        $('input[name=yonhap]').val(payload.yonhap);
        getOpenGraph($('input[name=yonhap]'));
    }
    if(payload.ytn) {
        $('input[name=ytn]').val(payload.ytn);
        getOpenGraph($('input[name=ytn]'));
    }
    if(payload.chosun) {
        $('input[name=chosun]').val(payload.chosun);
        getOpenGraph($('input[name=chosun]'));
    }
    if(payload.khan) {
        $('input[name=khan]').val(payload.khan);
        getOpenGraph($('input[name=khan]'));
    }
    if(payload.hani) {
        $('input[name=hani]').val(payload.hani);
        getOpenGraph($('input[name=hani]'));
    }
    if(payload.joins) {
        $('input[name=joins]').val(payload.joins);
        getOpenGraph($('input[name=joins]'));
    }
    if(payload.donga) {
        $('input[name=donga]').val(payload.donga);
        getOpenGraph($('input[name=donga]'));
    }

    var isLoading = false;

    var showAjax = function() {
        $("body").css('overflow', 'hidden');
        $("#ajax").show();
    }

    var hideAjax = function() {
        $("body").css('overflow', '');
        $("#ajax").hide();
    }

    var ogBuilder = function (data) {
        var img = $('<img>').attr('src', data.imageUrl).css('max-height', '98px');
        var link = $('<a target="_blank">').attr('href', data.url).append(img);
        var left = $('<div class="media-left">').append(link);
        var title = $('<h4 class="media-heading">').html(data.title);
        var body = $('<div class="media-body">').append(title).append(data.description);
        var el = $('<div class="media">').append(left).append(body);

        return el;
    }

    $("input[name=title]").focusout(function() {
        payload.title = $(this).val().trim();
        $.cookie('dpn_a_ic', JSON.stringify(payload));
    });

    $("input.issue-option").focusout(function(e) {
        var label = $(this).attr('name');
        payload[label] = $(this).val();
        $.cookie('dpn_a_ic', JSON.stringify(payload));
    });

    $(".news-link").focusin(function() {
        $(this).removeClass("has-error").removeClass("has-warning").removeClass("has-success");
    }).focusout(function() {
        getOpenGraph($(this));
    });

    $("form[name=link-form]").submit(function(e) {
        e.preventDefault();
        isLoading = true;
        showAjax();
        $.ajax({
            url:'/api/orwell/issue',
            method: 'post',
            contentType:'application/json',
            data: JSON.stringify(payload)
        }).done(function(response) {
            isLoading = false;
            hideAjax();
            if(response.result == "success") {
                alert("성공");
                $("input").val('').removeClass("has-success").removeClass("has-error").removeClass("has-warning");
                $(".media").remove();
                $("input[type=hidden][name=imageUrl]").val('');
                $("#upload-image-viewer img").remove();
                payload = {
                    title:null,
                    imageUrl:null,
                    option1:null,
                    option2:null,
                    yonhap:null,
                    ytn:null,
                    chosun:null,
                    khan:null,
                    joins:null,
                    hani:null,
                    donga:null
                };
                $.cookie('dpn_a_ic', JSON.stringify(payload));
            } else {
                alert("실패");
            }
            console.log(response);
        });
    });

    $(".btn-close").click(function() {
        var $parent = $(this).parents(".issue-pannel");
        var issueId = $parent.data('issue');
        var enabled = $parent.data('enabled');

        if(!enabled) {
            alert("이미 비공개된 이슈입니다.");
            return false;
        }

        $.ajax({
            url:'/api/orwell/issue/'+issueId+'/enabled',
            method:'delete'
        }).done(function(response) {
            if(response && response.result == "success") {
                $parent.data("enabled", false);
                $parent.find(".issue-enabled").html("closed");
            } else {
                var message = "실패";
                if(response.message && response.message.length > 0) {
                    message = message + "[" +response.message + "]";
                }
                alert(message);
            }
        });
    });
    $("input[name=thumbnail]").change(function() {
        if(!$('form[name=link-form] input[type=file]')[0].files) {
            return false;
        }
        var data = new FormData();
        data.append('thumbnail', $('form[name=link-form] input[type=file]')[0].files[0]);

        $.ajax({
            url: '/api/orwell/upload/thumbnail',
            type: "post",
            data: data,
            processData: false,
            contentType: false
        }).done(function(response) {
            if(response.filename) {
                payload.imageUrl = response.filename;
                $("input[type=hidden][name=imageUrl]").val(response.filename);
                $("#upload-image-viewer img").remove();
                $("#upload-image-viewer").append($("<img>").attr("src", response.filename))
            } else {
                alert("실패");
            }
        });
    });

    $(".btn-open").click(function() {
        var $parent = $(this).parents(".issue-pannel");
        var issueId = $parent.data('issue');
        var enabled = $parent.data('enabled');

        if(enabled) {
            alert("이미 공개된 이슈입니다.");
            return false;
        }

        $.ajax({
            url:'/api/orwell/issue/'+issueId+'/enabled',
            method:'post'
        }).done(function(response) {
            if(response && response.result == "success") {
                $parent.data("enabled", true);
                $parent.find(".issue-enabled").html("open");
            } else {
                var message = "실패";
                if(response.message && response.message.length > 0) {
                    message = message + "[" +response.message + "]";
                }
                alert(message);
            }
        });
    });

    $(".btn-tag").click(function(e) {
        var $parent = $(this).parents(".issue-pannel");
        var issueId = $parent.data('issue');
        var tag = $(this).parent().prev().val().trim();
        var payload = {tag:tag, issueId: issueId};
        if(tag && tag.length > 0) {
            if(confirm('['+tag+']를 추가하시겠습니까?')) {
                $.ajax({
                    url:'/api/orwell/issue/'+issueId+"/tag",
                    method:'post',
                    contentType:'application/json',
                    data:JSON.stringify(payload)
                }).done(function(response) {
                    if(response && response.result == "success") {
                        var tagLabel = $("<span class='label label-default' data-tag='"+response.tag.id+"'>").html(tag+'&nbsp;<i class="fa fa-times" aria-hidden="true"></i>');
                        $parent.find("h3").append(tagLabel);
                    } else {
                        var message = "실패";
                        if(response.message && response.message.length > 0) {
                            message = message + "[" +response.message + "]";
                        }
                        alert(message);
                    }
                })
            }
        }
    });
    $(".panel-body").delegate('.label', 'click', function() {
        var $this = $(this);
        var tag = $(this).text().trim();
        var id = $(this).data('tag');
        if(confirm('['+tag+']를 삭제하시겠습니까?')) {
            $.ajax({
                url:'/api/orwell/tag/'+id,
                method:'delete'
            }).done(function(response) {
                if(response && response.result == "success") {
                    $this.remove();
                } else {
                    var message = "실패";
                    if(response.message && response.message.length > 0) {
                        message = message + "[" +response.message + "]";
                    }
                    alert(message);
                }
            })
        }
    });

})();