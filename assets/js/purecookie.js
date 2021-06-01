// --- Config --- //
var purecookieTitle = "Cookies"; // Title
var purecookieDesc = "Este site utiliza cookies para te proporcionar uma melhor experiência. Ao continuar navegando, você aceita nossa"; // Description
var purecookieLink = '<a href="politica_de_privacidade.html" target="_blank">Política de Privacidade</a>'; // Cookiepolicy link
var purecookieButton = "Aceitar"; // Button text
var purecookieName = "MyBankingBrasilConsent";
// ---        --- //


function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + ";" + expires + ";path=/";
    
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

function cookieConsent() {
  if (!getCookie(purecookieName)) {    
	  $("#cookieConsentContainer").fadeIn();
  }
}

function purecookieDismiss() {
  setCookie(purecookieName,'1',7);
  $("#cookieConsentContainer").fadeOut();
}

window.onload = function() {cookieConsent(); };
