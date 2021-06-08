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
        $('#personalCardForm').submit(filterCards);

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

        getUserMission();

    });

    function getUserMission(){
        
        $.ajax({
             async: false,
             crossDomain: true,
             method: 'GET',                 
             url: _config.api.invokeUrl + '/mission',
             headers: {
                 Authorization: authToken
             },            
             success: function(data){ 
                 console.log(data);                        
                 setTimeout(checkMission(data, "completarBuscaCartoes"),1000);
                 },
             error: function ajaxError(jqXHR, textStatus, errorThrown) {
                 console.error('Error requesting insertProfile: ', textStatus, ', Details: ', errorThrown);
                 console.error('Response: ', jqXHR.responseText);
                 alert('An error occured when requesting to insertProfile:\n' + jqXHR.responseText);
             },
             
         });
         
     }

    function checkMission(data, missionName){                
        
        var found = false;

        var testResult = "";

        data.map(function(item){ 
            if(item.mission == missionName){

                found = true;
                testResult = item.result;
                
            }
        });        

        if(!found){
            console.log("missionOpen");
            console.log(missionName);
            $("#challengeAlertButton").click();
        }else{
            console.log("missionComplete");
            $("#rewardsButton").prop("disabled", true);
               

        }

    }

    function filterCards(event) {

        event.preventDefault();

        var questionsAnswered = $('input[type="radio"]:checked').length;
    
        if(questionsAnswered === 4){   
            
            

            //var formData = {resposta1 : $("#profileTitle").text()};            

            var formData = {"missionName" : "completarBuscaCartoes"};

            $("#rewardsButton").click();

            console.log(authToken);

            $.ajax({
                method: 'POST',
                dataType: 'json',
                url: _config.api.invokeUrl + '/mission',
                headers: {
                    Authorization: authToken
                },
                data: JSON.stringify(formData)
                ,
                contentType: 'application/json',
                success: console.log("ok"),
                error: function ajaxError(jqXHR, textStatus, errorThrown) {
                    console.error('Error requesting insertProfile: ', textStatus, ', Details: ', errorThrown);
                    console.error('Response: ', jqXHR.responseText);
                    alert('An error occured when requesting to insertProfile:\n' + jqXHR.responseText);
                }
            });

            
            var ocupationStatus = $('input[name="answer1"]:checked').val();
            var grossIncome = $('input[name="answer2"]:checked').val();
            var hasRewardProgram = $('input[name="answer3"]:checked').val();
            var needGoodCredit = $('input[name="answer4"]:checked').val();

            var queryString = "?";

            queryString+="ocupationStatus="+ocupationStatus;
            queryString+="&grossIncome="+grossIncome;
            queryString+="&hasRewardProgram="+hasRewardProgram;
            queryString+="&needGoodCredit="+needGoodCredit;

            $.ajax({
                async: false,
                crossDomain: true,
                method: 'GET',                 
                url: _config.api.invokeUrl + '/personalcard' + queryString,
                headers: {
                    Authorization: authToken
                },            
                success: function(data){ 
                    console.log(data);                                                                
                    printCardData(data);
                    },
                error: function ajaxError(jqXHR, textStatus, errorThrown) {
                    console.error('Error requesting insertProfile: ', textStatus, ', Details: ', errorThrown);
                    console.error('Response: ', jqXHR.responseText);
                    alert('An error occured when requesting to insertProfile:\n' + jqXHR.responseText);
                },
                
            });


        }else{
            alert("Por favor, preencha todas as perguntas antes de executar a busca!");
        }
    }

    function printCardData(data){

        $("#cards").html("");

        data.Items.forEach(element => {
                        
            var divContent = "";


            divContent+='<div id="'+element.pc_id+'" class="card-div">'
            divContent+="<span>Instituição: </span>"+element.pc_brand_name+"<br>"
            divContent+="<span>Nome do cartão: </span>"+element.pc_product_name+"<br>"
            divContent+="<span>Produto: </span>"+element.pc_product_type+"<br>"
            divContent+="<span>Bandeira: </span>"+element.pc_card_scheme+"<br>"
            divContent+="<span>Renda mínima: </span>"+new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(element.pc_min_gross_income)+"<br>"
            var needGoodCredit = "Sim"
            if(!element.pc_min_gross_income){
                needGoodCredit = "Não"
            }
            divContent+="<span>Sujeito a análise de crédito?: </span>"+needGoodCredit+"<br>"
            var hasRewardProgram = "Sim"
            if(!element.pc_min_gross_income){
                hasRewardProgram = "Não"
                divContent+="<span>Possui programa de recompensas?: </span>"+hasRewardProgram+"<br>"
            }else{
                divContent+="<span>Possui programa de recompensas?: </span>"+hasRewardProgram+"<br>"
                if(element.pc_reward_program_info === 'null'){
                    divContent+="<span>Informações sobre o programa de recompensas: </span><u>Informação não disponível</u><br>"
                }else{
                    divContent+="<span>Informações sobre o programa de recompensas: </span><u><a href='"+element.pc_reward_program_info+"'>"+element.pc_reward_program_info+"</a></u><br>"
                }
                
            }

            if(element.pc_eligibility_criteria.substr(0,4) === 'http'){
                divContent+="<span>Critério de eligibilidade: </span><u><a href='"+element.pc_eligibility_criteria+"'>"+element.pc_eligibility_criteria+"</a></u><br>"
            }else{
                divContent+="<span>Critério de eligibilidade: </span>"+element.pc_eligibility_criteria+"<br>"
            }

            
            
            divContent+='</div><br>'
            
            $("#cards").append(divContent);

        });

        
        $("#formDiv").hide();
        $("#pageTitle").hide();
        $("#cardList").show();

        $('html,body').animate({
            scrollTop: $("#cardList").offset().top - 200
        },
        'slow');

        

    }
      

}(jQuery));