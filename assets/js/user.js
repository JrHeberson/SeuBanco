/*global MyBanking _config*/

var MyBanking = window.MyBanking || {};
MyBanking.map = MyBanking.map || {};

(function userScopeWrapper($) {
    var authToken;
    MyBanking.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = 'signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = 'signin.html';
    });

    /*
     *  Event Handlers
     */    

    $(function onDocReady() {    
        $('#profileTestForm').submit(insertUserProfile);

        MyBanking.authToken.then(function updateAuthMessage(token) {
            if (token) {
                console.log(token);
                //displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                //$('.authToken').text(token);
            }
        });

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }

    });

    function insertUserProfile(event) {

        var formData = JSON.stringify($("#profileTestForm").serializeArray());

        event.preventDefault();

        console.log(authToken);

        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/insertProfile',
            headers: {
                Authorization: authToken
            },
            data: formData
            ,
            contentType: 'application/json',
            success: console.log("ok"),
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting insertProfile: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting to insertProfile:\n' + jqXHR.responseText);
            }
        });
    }


}(jQuery));