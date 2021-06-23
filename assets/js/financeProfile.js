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
                //console.log(token);
                //displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                //$('.authToken').text(token);
            }
        });

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }

        getUser();

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
              
                 setTimeout(checkMission(data),1000);
                 },
             error: function ajaxError(jqXHR, textStatus, errorThrown) {
                 console.error('Error requesting insertProfile: ', textStatus, ', Details: ', errorThrown);
                 console.error('Response: ', jqXHR.responseText);
                 
                 window.location.reload();
             },
             
         });
         
     }
    

     function checkMission(data){                
        
        var found = false;   
        
        var testResult = "";
        var testDate = "";

        data.Item.missions.map(function(item){ 
            if(item.mission == "completarTestePerfilFinanceiro"){

                found = true;
                testResult = data.Item.financeProfile;
                testDate = item.completedTimestamp;
                var d = new Date(testDate)
                testDate = d.toLocaleString('pt-BR');
                
            }
        });        

        if(!found){
            $("#challengeAlertButton").click();
        }else{
            console.log("missionComplete");
            console.log(testDate);
            $("#rewardsButton").prop("disabled", true);

                var profileTitle = "";
                var profileDesc = "";
                var articleLink = "";
                if (testResult == "Investidor") { // If user chooses the first choice the most, this outcome will be displayed.
                    profileTitle = "Investidor";
                    profileDesc = "Parabéns, você está no caminho certo! O hábito de poupar é o meio para se tornar uma pessoa sustentável financeiramente. É preciso proteger, poupar e guardar parte do dinheiro que passa por suas mãos, pois é por meio dele que você realizará seus sonhos e objetivos.";
                }
                if (testResult == "Equilibrado Financeiramente") { // If user chooses the second choice the most, this outcome will be displayed.
                    profileTitle = "Equilibrado Financeiramente";
                    profileDesc = "Pode parecer que tudo está em plena ordem. O fato de não ter dívidas ou, se as tiver, estarem controladas não pode ser objeto de tranquilidade. Isso porque você não criou o hábito de guardar parte do dinheiro que ganha e, consequentemente, quase não consegue acumular reservas financeiras. Essa situação é conhecida como ‘zona de conforto’, mas você deve assumir uma nova postura em relação à utilização do seu dinheiro. É preciso retomar o comando de sua vida financeira, fazer imediatamente um diagnóstico com a ajuda da família, registrando por 30, 60 ou, no máximo, 90 dias tudo o que gastar, até mesmo as pequenas despesas.";
                    articleLink = 'Quer dicas de como melhorar suas finanças? Veja nosso artigo <a href="6_habitos_para_poupar.html">"6 hábitos para começar a poupar"</a>'
                }
                if (testResult == "Endividado") { // If user chooses the third choice the most, this outcome will be displayed.
                    profileTitle = "Endividado";
                    profileDesc = "Sua situação é delicada, você pode estar inadimplente ou muito próximo disso. É preciso ter muita atenção e não desanimar, porque chegou o momento de levantar a cabeça e saber que sempre existe um caminho. É preciso fazer um diagnóstico financeiro, saber quanto ganha, com o que gasta, descrever e detalhar todos os credores e os valores das dívidas. Mas, atenção, não procure o credor para fazer acordo no primeiro momento; caso ele venha lhe procurar, diga que você está se organizando financeiramente, sabe que deve e pagará quando e como puder. Portanto, tome atitude, tenha disciplina e muita perseverança. Tudo começa com o primeiro degrau e, lembre-se, estar endividado ou inadimplente é uma questão de escolha! Acredite na beleza dos seus sonhos! Boa sorte!";
                }
            
                // If you add more choices, you must add another response below.
                $("#profileTitle").text(profileTitle);
                $("#profileDesc").text(profileDesc);
                $("#articleLink").html(articleLink);
                $("#testDate").text(testDate);
                $("#profileResult").show();
                $("#reset").show();
                $("#formDiv").hide();
                $("#pageTitle").hide();

        }

     }

    function insertUserProfile(event) {

        event.preventDefault();

        var questionsAnswered = $('input[type="radio"]:checked').length;
    
        if(questionsAnswered === 10){         
            tabulateAnswers();

            var formData = {missionName : "completarTestePerfilFinanceiro"};

            $("#rewardsButton").click();
           

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

            formData = {financeProfile : $("#profileTitle").text()};

            $.ajax({
                method: 'POST',
                dataType: 'json',
                url: _config.api.invokeUrl + '/financeprofile',
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

        }else{
            alert("Por favor, preencha todas as perguntas antes de calcular o resultado!");
        }
    }

    function tabulateAnswers() {
        // initialize variables for each choice's score
        // If you add more choices and outcomes, you must add another variable here.
        var mainScore = 0;
    
        // loop through all the radio inputs
        $('input[type="radio"]:checked').each(function(index){ 
            mainScore+=parseInt($(this).val());
        });
    
        console.log(mainScore);
            
        
        // Display answer corresponding to that choice
        var profileTitle = "";
        var profileDesc = "";
        var articleLink = "";
        if ( mainScore > 65) { // If user chooses the first choice the most, this outcome will be displayed.
            profileTitle = "Investidor";
            profileDesc = "Parabéns, você está no caminho certo! O hábito de poupar é o meio para se tornar uma pessoa sustentável financeiramente. É preciso proteger, poupar e guardar parte do dinheiro que passa por suas mãos, pois é por meio dele que você realizará seus sonhos e objetivos.";
        }
        if (mainScore >= 45 && mainScore <= 65) { // If user chooses the second choice the most, this outcome will be displayed.
            profileTitle = "Equilibrado Financeiramente";
            profileDesc = "Pode parecer que tudo está em plena ordem. O fato de não ter dívidas ou, se as tiver, estarem controladas não pode ser objeto de tranquilidade. Isso porque você não criou o hábito de guardar parte do dinheiro que ganha e, consequentemente, quase não consegue acumular reservas financeiras. Essa situação é conhecida como ‘zona de conforto’, mas você deve assumir uma nova postura em relação à utilização do seu dinheiro. É preciso retomar o comando de sua vida financeira, fazer imediatamente um diagnóstico com a ajuda da família, registrando por 30, 60 ou, no máximo, 90 dias tudo o que gastar, até mesmo as pequenas despesas.";
            articleLink = 'Quer dicas de como melhorar suas finanças? Veja nosso artigo <a href="6_habitos_para_poupar.html">"6 hábitos para começar a poupar"</a>'

        }
        if (mainScore < 45) { // If user chooses the third choice the most, this outcome will be displayed.
            profileTitle = "Endividado";
            profileDesc = "Sua situação é delicada, você pode estar inadimplente ou muito próximo disso. É preciso ter muita atenção e não desanimar, porque chegou o momento de levantar a cabeça e saber que sempre existe um caminho. É preciso fazer um diagnóstico financeiro, saber quanto ganha, com o que gasta, descrever e detalhar todos os credores e os valores das dívidas. Mas, atenção, não procure o credor para fazer acordo no primeiro momento; caso ele venha lhe procurar, diga que você está se organizando financeiramente, sabe que deve e pagará quando e como puder. Portanto, tome atitude, tenha disciplina e muita perseverança. Tudo começa com o primeiro degrau e, lembre-se, estar endividado ou inadimplente é uma questão de escolha! Acredite na beleza dos seus sonhos! Boa sorte!";
            
        }

        var d = new Date(Date.now())        
    
        // If you add more choices, you must add another response below.
        $("#profileTitle").text(profileTitle);
        $("#testDate").text(d.toLocaleString('pt-BR'));
        $("#profileDesc").text(profileDesc);
        $("#articleLink").html(articleLink);
        $("#profileResult").show();
        $("#reset").show();
        $("#formDiv").hide();
        $("#pageTitle").hide();
      }            
    
      

}(jQuery));