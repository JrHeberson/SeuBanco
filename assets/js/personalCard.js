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
                //console.log(token);
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
                 
                 setTimeout(checkMission(data, "completarBuscaCartoes"),1000);
                 },
             error: function ajaxError(jqXHR, textStatus, errorThrown) {
                 console.error('Error requesting insertProfile: ', textStatus, ', Details: ', errorThrown);
                 console.error('Response: ', jqXHR.responseText);
                 
                 window.location.reload();
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
    
        if(questionsAnswered === 5){   
            
            $("#btnCalcular").hide();
            $("#loadingGif").show();

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
                    
                    window.location.reload();
                }
            });

            
            var ocupationStatus = $('input[name="answer1"]:checked').val();
            var grossIncome = $('input[name="answer2"]:checked').val();
            var hasRewardProgram = $('input[name="answer3"]:checked').val();            
            var annualCardFee = $('input[name="answer4"]:checked').val();
            var needGoodCredit = $('input[name="answer5"]:checked').val();

            var queryString = "?";

            queryString+="ocupationStatus="+ocupationStatus;
            queryString+="&grossIncome="+grossIncome;
            queryString+="&hasRewardProgram="+hasRewardProgram;
            queryString+="&annualCardFee="+annualCardFee;
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
                 
                    printCardData(data);
                    },
                error: function ajaxError(jqXHR, textStatus, errorThrown) {
                    console.error('Error requesting insertProfile: ', textStatus, ', Details: ', errorThrown);
                    console.error('Response: ', jqXHR.responseText);
                    
                    //window.location.reload();
                },
                
            });


        }else{
            alert("Por favor, preencha todas as perguntas antes de executar a busca!");
        }
    }

    function printCardData(data){

        if(data.Count > 1){
            $("#cardCount").html("Encontramos "+data.Count+" cartões compatíveis com sua busca!");
        }else if(data.Count == 1){
            $("#cardCount").text("Encontramos 1 cartão compatível com sua busca!");
        }else{
            $("#cardCount").html("Desculpe... não encontramos nenhum cartão compatível com sua busca. <br> Que tal revisar suas respostas?");
        }
        

        $("#cards").html("");
        
        var bankList = [];
        var productList = [];

        data.Items.forEach(element => {
            
            
            bankList.push( element.pc_brand_name);
            productList.push( element.pc_product_type);
                
                        
            var divContent = "";

            divContent+='<div data-bank="'+element.pc_brand_name+'" data-product="'+element.pc_product_type.toUpperCase()+'" id="'+element.pc_id+'" class="card-div">'
            divContent+='<div class="panel">'
            if(element.pc_product_type.toUpperCase() == 'PLATINUM'){
                divContent+='<div class="card card--front" style="background:silver">'
            }else if(element.pc_product_type.toUpperCase() == 'GOLD'){
                divContent+='<div class="card card--front" style="background:#caad17">'
            }
            else if(element.pc_product_type.toUpperCase() == 'BLACK'){
                divContent+='<div class="card card--front" style="background:black; color:white">'
            }else{
                divContent+='<div class="card card--front">'
            }            
            divContent+='<div class="card__product">'+element.pc_product_type.toUpperCase()+'</div>'
            divContent+='<div class="card__bank">'+element.pc_brand_name+'</div>'            
            divContent+='<div class="card__number">1111 2222 3333 4444</div>'
            divContent+='<div class="card__expiry-date">XX/XX</div>'
            divContent+='<div class="card__owner">'+element.pc_product_name+'</div>'
            divContent+='<img width="90px" class="card__logo" src="assets/images/logos/'+element.pc_card_scheme.toLowerCase()+'.png" alt="'+element.pc_card_scheme+'"/>'
            divContent+='</div>'
            divContent+='</div>'                        
            if(element.hasOwnProperty('pc_annualCardFee')){
                divContent+="<span>Anuidade: </span>"+new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(element.pc_annualCardFee)+"<br>"
            }else{
                divContent+="<span>Anuidade: </span>Não informado pelo<br>"
            }
            divContent+="<span>Renda mínima: </span>"+new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(element.pc_min_gross_income)+"<br>"
            var needGoodCredit = "Não"
            if(element.pc_needGoodCredit){
                needGoodCredit = "Sim"
            }
            divContent+="<span>Sujeito a análise de crédito?: </span>"+needGoodCredit+"<br>"
            var hasRewardProgram = "Não"
            if(element.pc_hasRewardProgram){
                hasRewardProgram = "Sim"
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

            
            
            divContent+='</div>'
            
            $("#cards").append(divContent);

        });

        console.log(bankList);

        var bankUniq = bankList.filter((v, i, a) => a.indexOf(v) === i); 

        console.log(bankUniq);

        var bankFilterSelect = '<label for="bankFilter">Bancos</label>'
        bankFilterSelect +='<select style="margin-bottom:20px;" onchange="filterSelect(this,\'data-bank\')" id="bankFilter" class="form-select" aria-label="">';
        bankFilterSelect += '<option value="all">Mostrar Todos</option>';
        bankUniq.forEach(element1 => {
            bankFilterSelect += '<option value="'+element1+'">'+element1+'</option>';
        });
        bankFilterSelect += '</select>';
        $("#filters").append(bankFilterSelect);

        console.log(productList);

        var productUniq = productList.filter((v, i, a) => a.indexOf(v) === i); 

        console.log(productUniq);

        var productFilterSelect = '<label for="productFilter">Produto</label>'
        productFilterSelect +='<select style="margin-bottom:20px;" onchange="filterSelect(this,\'data-product\')" id="productFilter" class="form-select" aria-label="">';
        productFilterSelect += '<option value="all">Mostrar Todos</option>';
        productUniq.forEach(element1 => {
            productFilterSelect += '<option value="'+element1+'">'+element1+'</option>';
        });
        productFilterSelect += '</select>';
        $("#filters").append(productFilterSelect);
        
        $("#formDiv").hide();
        $("#pageTitle").hide();
        $("#cardList").show();

        $("#btnCalcular").show();
        $("#loadingGif").hide();

        $('html,body').animate({
            scrollTop: $("#cardList").offset().top - 200
        },
        'slow');

        

    }
      

}(jQuery));