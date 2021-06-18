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

        setupAvatar();

        setupInterest();

        getUser();        

        setTimeout(function(){
            if($("#userId").text() == ""){
                $("#subscribeAlertButton").click();
                $(".avatar-box").hide();
            }            

        },1000);
        

        

    });


    function setupInterest(){
        var interest = ["Artes","Cozinha","Redes_Sociais","Voluntariado","Esportes","Música","Viagens","Idiomas","Cinema","Natureza","Fotografia","Pets"];        
        
        var newElement = "";

        interest.forEach(element => {
            newElement = '<label data-select="interest" style="border-color: #0d6efd; width: fit-content;" onclick="tgInterestButton(this,event)" class="btn btn-outline-primary" for="'+element+'">'+element+'</label>';

            newElement += '<label data-select="interest" style="border-color: #0d6efd; width: fit-content; display:none" onclick="tgInterestButton(this,event)" class="btn btn-outline-primary active" for="'+element+'">'+element+'</label>';
                                                
            $("#interesses").append(newElement);

            newElement = "";
        });
    };

    function setupAvatar(){
        var avatarSettings = "";
		avatarSettings +='[{"label":"cor do fundo","settings":"background","options":"black,silver,gray,white,maroon,red,purple,pink,fuchsia,green,lime,olive,yellow,navy,blue,teal,aqua,aliceblue,antiquewhite,aquamarine,azure,beige,bisque,blanchedalmond,blueviolet,brown,burlywood,cadetblue,chartreuse,chocolate,coral,cornflowerblue,cornsilk,crimson,cyan,darkblue,darkcyan,darkgoldenrod,darkgray,darkgreen,darkgrey,darkkhaki,darkmagenta,darkolivegreen,darkorange,darkorchid,darkred,darksalmon,darkseagreen,darkslateblue,darkslategray,darkslategrey,darkturquoise,darkviolet,deeppink,deepskyblue,dimgray,dimgrey,dodgerblue,firebrick,floralwhite,forestgreen,gainsboro,ghostwhite,gold,goldenrod,greenyellow,grey,honeydew,hotpink,indianred,indigo,ivory,khaki,lavender,lavenderblush,lawngreen,lemonchiffon,lightblue,lightcoral,lightcyan,lightgoldenrodyellow,lightgray,lightgreen,lightgrey,lightpink,lightsalmon,lightseagreen,lightskyblue,lightslategray,lightslategrey,lightsteelblue,lightyellow,limegreen,linen,magenta,mediumaquamarine,mediumblue,mediumorchid,mediumpurple,mediumseagreen,mediumslateblue,mediumspringgreen,mediumturquoise,mediumvioletred,midnightblue,mintcream,mistyrose,moccasin,navajowhite,oldlace,olivedrab,orange,orangered,orchid,palegoldenrod,palegreen,paleturquoise,palevioletred,papayawhip,peachpuff,peru,plum,powderblue,rosybrown,royalblue,saddlebrown,salmon,sandybrown,seagreen,seashell,sienna,skyblue,slateblue,slategray,slategrey,snow,springgreen,steelblue,tan,thistle,tomato,turquoise,violet,wheat,whitesmoke,yellowgreen"},';
        avatarSettings +='{"label":"tom de pele","settings":"skin","options":"tanned,yellow,pale,light,brown,darkBrown,black"},';
        avatarSettings +='{"label":"cabelo e acessórios","settings":"top","options":"dreads01,dreads02,frizzle,shaggyMullet,shaggy,shortCurly,shortFlat,shortRound,sides,shortWaved,theCaesarAndSidePart,theCaesar,bigHair,bob,bun,curly,curvy,dreads,frida,froAndBand,fro,longButNotTooLong,miaWallace,shavedSides,straightAndStrand,straight01,straight02,eyepatch,turban,hijab,hat,winterHat01,winterHat02,winterHat03,winterHat04"},';
        avatarSettings +='{"label":"cor do cabelo","settings":"hairColor","options":"auburn,black,blonde,blondeGolden,brown,brownDark,pastelPink,platinum,red,silverGray"},';        
        avatarSettings +='{"label":"cor do acessório","settings":"hatColor","options":"black,blue01,blue02,blue03,gray01,gray02,heather,pastelBlue,pastelGreen,pastelOrange,pastelRed,pastelYellow,pink,red,white"},';        
        avatarSettings +='{"label":"óculos","settings":"accessories","options":"none,kurt,prescription01,prescription02,round,sunglasses,wayfarers"},';
        avatarSettings +='{"label":"cor do óculos","settings":"accessoriesColor","options":"black,blue01,blue02,blue03,gray01,gray02,heather,pastelBlue,pastelGreen,pastelOrange,pastelRed,pastelYellow,pink,red,white"},';        
        avatarSettings +='{"label":"barba","settings":"facialHair","options":"none,beardLight,beardMagestic,beardMedium,moustaceFancy,moustacheMagnum"},';
        avatarSettings +='{"label":"cor da barba","settings":"facialHairColor","options":"auburn,black,blonde,blondeGolden,brown,brownDark,pastelPink,platinum,red,silverGray"},';
        avatarSettings +='{"label":"roupa","settings":"clothing","options":"blazerAndShirt,blazerAndSweater,collarAndSweater,graphicShirt,hoodie,overall,shirtCrewNeck,shirtScoopNeck,shirtVNeck"},';
        avatarSettings +='{"label":"cor da roupa","settings":"clothingColor","options":"black,blue01,blue02,blue03,gray01,gray02,heather,pastelBlue,pastelGreen,pastelOrange,pastelRed,pastelYellow,pink,red,white"},';
        avatarSettings +='{"label":"estampa da Roupa","settings":"clothingGraphic","options":"skrullOutline,skrull,resist,pizza,hola,diamond,deer,dumbia,bear,bat"},';        
        avatarSettings +='{"label":"olhos","settings":"eyes","options":"squint,closed,cry,default,eyeRoll,happy,hearts,side,surprised,wink,winkWacky,xDizzy"},';
        avatarSettings +='{"label":"sombrancelhas","settings":"eyebrows","options":"angryNatural,defaultNatural,flatNatural,frownNatural,raisedExcitedNatural,sadConcernedNatural,unibrowNatural,upDownNatural,raisedExcited,angry,default,sadConcerned,upDown"},';
        avatarSettings +='{"label":"boca","settings":"mouth","options":"concerned,default,disbelief,eating,grimace,sad,screamOpen,serious,smile,tongue,twinkle,vomit"}]';

        var jsonSettings = JSON.parse(avatarSettings);
        
        var newSelect = "";

        newSelect = '<select id="settings" class="form-select" aria-label="">'
        jsonSettings.forEach(element1 => {
            
            newSelect += '<option value="'+element1.settings+'">'+element1.label+'</option>';

        });
        newSelect += '</select>';
        $("#avatar-settings").append(newSelect);

        newSelect = "";

        jsonSettings.forEach(element1 => {
            console.log(element1.settings);
            var label = element1.label;
            var settings = element1.settings;
            var options = element1.options.split(",");            
            newSelect += '<select hidden id="'+settings+'" class="form-select" aria-label="">';
            options.forEach(element2 => {
                newSelect += '<option value="'+element2+'">'+element2+'</option>';
            });
            newSelect += '</select>';
            $("#avatar-settings").append(newSelect);
        });

    }


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
               
                window.location.reload();
            },
            
        });
        
    }
    
    function insertUserProfile(event) {

        event.preventDefault(); 
        
            var avatarJSON = "";

            if($("#jsonSVG").val() == ""){
                avatarJSON = {};
                $(".avatar-box").show();

            }else{
                avatarJSON = JSON.parse($("#jsonSVG").val());
            }

            var interestsList = [];
            $('label:visible[data-select=interest]').each(function(){ 
                if($(this).hasClass('active')){ 
                    interestsList.push($(this).text());
                }
            });

            

            var formData = {firstName : $("#firstName").val(),
            lastName : $("#lastName").val(),
            phoneNumber : $("#phoneNumber").val(),
            address : $("#address").val(),
            zipcode : $("#zipcode").val(),
            province : $("#province").val(),
            friend : emailToUser($("#friend").val()),
            avatar : avatarJSON,
            interests : interestsList
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
                    
                    window.location.reload();
                }
            });
        
    };
    
    function setUserData(data){

        if(data.hasOwnProperty("Item")){
                    
            var email =  userToEmail(data.Item.email);
            var avatar =  data.Item.avatar;
            var firstName = data.Item.firstName; 
            var lastName = data.Item.lastName;
            var phoneNumber = data.Item.phoneNumber;
            var address = data.Item.address;
            var zipcode = data.Item.zipcode;
            var province = data.Item.province;
            var missions = data.Item.missions;
            var interests = data.Item.interests;
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

            var svg = Avataaars.create(avatar);

            

           interests.forEach(element => {
                
                console.log(element);

                $('label:visible[for='+element+']').each(function(){ 
                    if(!$(this).hasClass('active')){ 
                        $(this).click();
                    }
                });

            });

            $(".avatar-box").html(svg);
            $("#jsonSVG").text(JSON.stringify(avatar));
            $("#jsonSVG_bkp").text(JSON.stringify(avatar));            
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
    };
    
    function emailToUser(email){
        return email.replace('@', '-at-');
    };
      

}(jQuery));