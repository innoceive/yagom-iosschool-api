function sendFeedback(channel) {
    var text = channel==0?$('#issueText').val():$('#suggestText').val();
    var payload = { channel: channel, text: text}

    $.ajax({
        url: '/api/feedback',
        type: 'post',
        data: JSON.stringify(payload),
        contentType:'application/json',
        success: function(data){
            console.log(data)
            if(channel==0){
                $('#feedbackIssue').modal('hide');
            } else {
                $('#feedbackSuggest').modal('hide');
            }
        }
    })
}