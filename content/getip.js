window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false);
    myExtension.init(); 
},false);

var myExtension = {
    init: function() {
        if(gBrowser)
			gBrowser.addEventListener("DOMContentLoaded", this.onPageLoad, false);
    },
    onPageLoad: function(aEvent) {
        var doc = aEvent.originalTarget; 
        var win = doc.defaultView; 

         if (doc.nodeName != "#document") return; // only documents
         if (win != win.top) return; //only top window.
         if (win.frameElement) return; // skip iframes/frames
        
		initIP(doc.location.hostname);		
    }
}

function initIP(host){	
	var address= 'http://p.lissak.fr/getip.php?host=' + host ; 
	try	{
		xmlhttp = new XMLHttpRequest();
	}catch (e){
		xmlhttp=false;
	}
	xmlhttp.overrideMimeType("text/xml");
	xmlhttp.open("GET", address, true);
	xmlhttp.onreadystatechange=function()	{
		if(xmlhttp.status!="200"){
			return;
		}
	}
	xmlhttp.send(null);
	xmlhttp.onload = function(){
		var gethostip=xmlhttp.responseText;
		//gethostip = ipFromString(gethostip);
		//if(validateIP(gethostip)){
			document.getElementById('gethostip-panel').label = gethostip;
		//}else{		
		//}
	}
}

function update(){
	var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIWebNavigation)
                   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                   .rootTreeItem
                   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIDOMWindow);
	var host = mainWindow.getBrowser().selectedBrowser.contentWindow.location.hostname;

	document.getElementById('gethostip-panel').label = 'Reload : ' +host;
	initIP(host);
}


function ip2clipboard(){
	var clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"];
	clipboardHelper = clipboardHelper.getService(Components.interfaces.nsIClipboardHelper);
     clipboardHelper.copyString(document.getElementById('gethostip-panel').label);
}


function validateIP(IP){
	var validIpAddress = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
	return validIpAddress.exec(IP);
}

function ipFromString(ipWithin){
	var match = (new RegExp(/\d\d?\d?\.\d\d?\d?\.\d\d?\d?\.\d\d?\d?/)).exec(ipWithin) ;
	if(match==null) return 'error';
	else return match[0];
}
