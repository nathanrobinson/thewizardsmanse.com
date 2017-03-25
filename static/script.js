if (Running != 10) {
    var message = "<p>This site uses non-intrusive advertisements to fund free content, please consider disabling your ad blocking software or whitelisting www.thewizardsmanse.com.</p>";
    var list = document.getElementsByTagName("article");
    for(var c=0; c<list.length; c++) {
        list[c].innerHTML = message;
    }
}
