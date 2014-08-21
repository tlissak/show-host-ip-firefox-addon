window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false);
    if(!gBrowser) return ;
	
	gBrowser.addProgressListener({
	  onLocationChange: function(aProgress, aRequest, aURI){
		DnsCache.get(gBrowser.selectedBrowser.contentWindow.location.hostname);		
		
	  }},
	Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
  
	/*
	return ;	
	gBrowser.addEventListener("DOMContentLoaded", function(aEvent) {
		var doc = aEvent.originalTarget; 
		var win = doc.defaultView; 
		if (doc.nodeName != "#document") return; // only documents
		if (win != win.top) return; //only top window.
		if (win.frameElement) return; // skip iframes/frames
		DnsCache.get(doc.location.hostname);		
	}, false);
	
	gBrowser.tabContainer.addEventListener("TabSelect", function(event){
		DnsCache.get(gBrowser.selectedBrowser.contentWindow.location.hostname) ;
	}, false);
	*/
},false);





var DnsCache = {
  pairs : {}
	,get:function(_host){
		if (!_host){
			$('gethostip-panel').label = "0.0.0.0"  ;
			$('gethostip-panel-status').label = "E"
			return 0 ;
		}
		if (_host in this.pairs){			
			$('gethostip-panel').label = this.pairs[_host] ;
			$('gethostip-panel-status').label = "C"
			return 2 ;			
		}
		this.getIp(_host);
		return 1 ;
	}	
	,getIp:function(host){
		var cls = Cc['@mozilla.org/network/dns-service;1'];
		var iface = Ci.nsIDNSService;
		var dns = cls.getService(iface); //dns object
		//https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIDNSService#Resolve_flag_constants
		var nsrecord = dns.resolve( host , 5 ); //resolve hostname 5 is not ipv6
		
		if (nsrecord){
			var record_1 = nsrecord.getNextAddrAsString() ;
			$('gethostip-panel').label = record_1 ;
			$('gethostip-panel-status').label = "G"
			this.pairs[host] = record_1 ;				
			//while (nsrecord && nsrecord.hasMore()){
				//var record_1 = nsrecord.getNextAddrAsString() ;
				//$('gethostip-panel-status').label += "+";
			//};
		}
		
		
	}
	,provider:'http://p.lissak.fr/getip.php?host=' 
	,getProviderIp:function(host){	
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.overrideMimeType("text/xml");
		xmlhttp.open("GET", this.provider + host, true);
		xmlhttp.send(null);
		that = this ;
		xmlhttp.onload = function(){
			$('gethostip-panel').label = xmlhttp.responseText ;
			$('gethostip-panel-status').label = "I"
			that.pairs[host] = xmlhttp.responseText ;
		}
	}
} ;
function $(_id){ return document.getElementById(_id) ; }

function whoislookup(){
	var myUrl = 'http://who.is/whois-ip/ip-address/'+ $('gethostip-panel').label  ;
	var tBrowser = top.document.getElementById("content");	
	var tab = tBrowser.addTab(myUrl);
	tBrowser.selectedTab = tab;
}

function update(){
	var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIWebNavigation)
                   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                   .rootTreeItem
                   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIDOMWindow);
	var host = mainWindow.getBrowser().selectedBrowser.contentWindow.location.hostname;
	DnsCache.getIp(host); //escape cache 
}

function ip2clipboard(){
	var clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"];
	clipboardHelper = clipboardHelper.getService(Components.interfaces.nsIClipboardHelper);
    clipboardHelper.copyString($('gethostip-panel').label);
}