/*global MyBanking _config AmazonCognitoIdentity AWSCognito*/


var MyBanking = window.MyBanking || {};

(function scopeWrapper($) {
    var signinUrl = 'signin.html';
    var indexUrl = 'index.html';

    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool;

    if (!(_config.cognito.userPoolId &&
          _config.cognito.userPoolClientId &&
          _config.cognito.region)) {
        $('#noCognitoMessage').show();
        return;
    }

    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config.cognito.region;
    }

    MyBanking.signOut = function signOut() {
        userPool.getCurrentUser().signOut();
        window.location.href = indexUrl;
    };

    MyBanking.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            resolve(null);
        }
        
    });


    /*
     * Cognito User Pool functions
     */

    function userToEmail(user){
        return user.replace('-at-', '@');
    }

    function register(email, nickname, phone_number, password, onSuccess, onFailure) {
        var dataEmail = {
            Name: 'email',
            Value: email
        };
        var dataPhoneNumber = {
            Name: 'phone_number',
            Value: phone_number
        };
        var dataNickname = {
            Name: 'nickname',
            Value: nickname
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
        var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);
        var attributeNickname = new AmazonCognitoIdentity.CognitoUserAttribute(dataNickname);

        userPool.signUp(toUsername(email), password, [attributeEmail,attributePhoneNumber,attributeNickname], null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            }
        );
    }

    function signin(email, password, onSuccess, onFailure) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: toUsername(email),
            Password: password
        });

        var cognitoUser = createCognitoUser(email);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    }

    function verify(email, code, onSuccess, onFailure) {
        createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        });
    }

    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: toUsername(email),
            Pool: userPool
        });
    }

    function toUsername(email) {
        return email.replace('@', '-at-');
    }

    function forgotPwd(email, onSuccess, onFailure){
        
        var cognitoUser = createCognitoUser(email);  
                
         cognitoUser.forgotPassword({
             onSuccess: onSuccess,
             onFailure: onFailure,
             inputVerificationCode: function(data) {
                alert("Código enviado com sucesso! Verifique seu email!");
                window.location.href = 'newPassword.html';
             }
         })
                
    }

    function updatePwd(email, code, password, onSuccess, onFailure) {

        var cognitoUser = createCognitoUser(email);
        cognitoUser.confirmPassword(code, password, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    }

    /*
     *  Event Handlers
     */

    $(function onDocReady() {
        var cognitoUser = userPool.getCurrentUser();
        $('#signinForm').submit(handleSignin);
        $('#registrationForm').submit(handleRegister);
        $('#verifyForm').submit(handleVerify);
        $('#forgotPwdForm').submit(handleForgotPwd);
        $('#newPwdForm').submit(handleUpdatePwd);
        if(cognitoUser ==  null){
            console.log("No user logged!");
            $("#login-btn").attr("data-content","Acesse aqui!");            
        }else{
            var username = cognitoUser.username;
            var clientId = cognitoUser.pool.clientId;
            $("#login-btn").attr("data-content",userToEmail(cognitoUser.username));
            
    
            $("#signin-link").attr("href","userProfile.html");

            $("#menuMain").html('<li class="active"><a href="index.html">Home</a></li>'+
            '<li class="active"><a href="userProfile.html">Seu Perfil</a></li>'+          
            '<li class="active"><a href="profileTest.html">Teste de Perfil Financeiro</a></li>'+
            '<li class="active"><a href="findPersonalCard.html">Encontre seu Cartão!</a></li>'+
            '<li class="active"><a href="#" onclick="MyBanking.signOut();">Sair</a></li>')
            
            $('#indexContact').hide();


        }
        
        $("#login-btn").popover('show');
        $("#inviteFriend").popover('show');            
                    
        setTimeout(function(){ $("#login-btn").popover('hide');$("#inviteFriend").popover('hide');},5000);

        
    });

    function handleSignin(event) {
        var email = $('#emailInputSignin').val();
        var password = $('#passwordInputSignin').val();
        event.preventDefault();
        signin(email, password,
            function signinSuccess() {
                console.log('Successfully Logged In');
                window.location.href = 'userProfile.html';
            },
            function signinError(err) {
                alert("Não autorizado!\nUsuário ou senha incorreta!");
            }
        );
    }

    function handleUpdatePwd(event) {
        var email = $('#emailInputNewPwd').val();
        var code = $('#codeInputNewPwd').val();
        var password = $('#passwordInputNewPwd').val();
        event.preventDefault();
        updatePwd(email, code, password,
            function updatePwdSuccess() {
                console.log('Password update!');
                window.location.href = 'signin.html';
            },
            function updatePwdError(err) {
                alert("Código inválido ou expirado!\nSolicite um novo código de verificação!");
            }
        );
    }

    function handleRegister(event) {
        var email = $('#emailInputRegister').val();
        var nickname = $('#nicknameInputRegister').val();
        var phone_number = "+55"+$('#phone_numberInputRegister').val().replace("(","").replace(")","").replace("-","");
        var password = $('#passwordInputRegister').val();
        var password2 = $('#password2InputRegister').val();

        var onSuccess = function registerSuccess(result) {
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            var confirmation = ('Registro realizado com sucesso. Verifique sua caixa de entrada de e-mail ou pasta de spam para obter o código de verificação.');//('Registration successful. Please check your email inbox or spam folder for your verification code.');
            if (confirmation) {
                window.location.href = 'verify.html';
            }
        };
        var onFailure = function registerFailure(err) {
            
            alert("Usuário já cadastrado!\nAcesse a tela de login para cadastrar nova senha");
            
            
        };
        event.preventDefault();

        if (password === password2) {
            register(email, nickname, phone_number, password, onSuccess, onFailure);
        } else {
            alert('Senhas diferentes');
        }
    }

    function handleVerify(event) {
        var email = $('#emailInputVerify').val();
        var code = $('#codeInputVerify').val();
        event.preventDefault();
        verify(email, code,
            function verifySuccess(result) {
                console.log('call result: ' + result);
                console.log('Verificado com sucesso!'); //('Successfully verified');
                alert('Verificado com sucesso! Muito obrigado pelo seu pré-cadastro! Você será redirecionado a nossa pagina principal!');
                window.location.href = signinUrl;
            },
            function verifyError(err) {
                alert("Código de verificação inválido!\nPor favor, tente novamente.");
            }
        );
    }

    function handleForgotPwd(event) {
        var email = $('#emailInputForgotPwd').val();        

        var onSuccess = function forgotPwdSuccess(result) {
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());                                    
            
        };
        var onFailure = function forgotPwdFailure(err) {
            alert(err);
        };
        event.preventDefault();
        
        forgotPwd(email, onSuccess, onFailure);
    }

    

}(jQuery));
