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

        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
          })

        $('#userProfile').submit(insertUserProfile);

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

        getUser();        

        setTimeout(function(){if($("#userId").text() == ""){$("#subscribeAlertButton").click();}},1000);
        
        

    });

    function getUser(){
        
       $.ajax({
            async: false,
            crossDomain: true,
            method: 'GET',                 
            url: _config.api.invokeUrl + '/userprofile',
            headers: {
                Authorization: authToken
            },            
            success: function(data){ 
                console.log(data);                        
                setTimeout(setUserData(data),1000);
                },
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting insertProfile: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when requesting to insertProfile:\n' + jqXHR.responseText);
            },
            
        });
        
    }
    
    function insertUserProfile(event) {

        event.preventDefault();                    

            var formData = {firstName : $("#firstName").val(),
            lastName : $("#lastName").val(),
            phoneNumber : $("#phoneNumber").val(),
            address : $("#address").val(),
            zipcode : $("#zipcode").val(),
            province : $("#province").val(),
            };

            $.ajax({
                method: 'POST',
                dataType: 'json',
                url: _config.api.invokeUrl + '/userprofile',
                headers: {
                    Authorization: authToken
                },
                data: JSON.stringify(formData)
                ,
                contentType: 'application/json',
                success: setTimeout(function(){getUser()},1500),
                error: function ajaxError(jqXHR, textStatus, errorThrown) {
                    console.error('Error requesting insertProfile: ', textStatus, ', Details: ', errorThrown);
                    console.error('Response: ', jqXHR.responseText);
                    alert('An error occured when requesting to insertProfile:\n' + jqXHR.responseText);
                }
            });
        
    }
    
    function setUserData(data){

        if(data.hasOwnProperty("Item")){
                    
            var email =  userToEmail(data.Item.email);
            var firstName = data.Item.firstName; 
            var lastName = data.Item.lastName;
            var phoneNumber = data.Item.phoneNumber;
            var address = data.Item.address;
            var zipcode = data.Item.zipcode;
            var province = data.Item.province;
            var missions = data.Item.missions;
            var points = 0;

            $('html,body').animate({
                scrollTop: $("#contact").offset().top -50},
            'slow');

            missions.forEach(element => {
                points+= parseInt(element.points);
            });
            
            $("#points").prop('Counter',0).animate({
                Counter: points
            }, {
                duration: 2000,
                easing: 'swing',
                step: function (now) {
                    $(this).text(Math.ceil(now));
                }
            });            

            $("#points").text(points);
            $("#userId").text(email);
            $("#username").text(firstName);
            $("#firstName").val(firstName);
            $("#lastName").val(lastName);
            $("#phoneNumber").val(phoneNumber);
            $("#address").val(address);
            $("#zipcode").val(zipcode);
            $("#province").val(province);
        }

    };

    function userToEmail(user){
        return user.replace('-at-', '@');
    }
      

}(jQuery));