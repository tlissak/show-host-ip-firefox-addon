window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false);
    if(!gBrowser) return ;	
	gBrowser.addProgressListener({
	  onLocationChange: function(aProgress, aRequest, aURI){  nsUtil.Process(nsUtil.GetCurrentHost(), true );  }},
	Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
},false);

var nsUtil = {	
	Cache : {}
	, $ : function(_id){ return document.getElementById(_id) ; }
	, LabelState : function(key ) {  this.$('gethostip-panel-status').label = key[0] ; }
	, GetCurrentHost : function(){  return gBrowser.selectedBrowser.contentWindow.location.hostname  ;	}
	, Process: function(_host,useCache){
		if (!_host){
			this.LabelState( "Empty" ) ;
			this.$('gethostip-panel').label =  "0.0.0.0"  ; return ;
		}
		if (useCache && (_host in this.Cache)){
			this.LabelState( "Cache" ) ;
			this.$('gethostip-panel').label =  this.Cache[_host] ; return ;
			//if (host in nsUtil.Cache) delete nsUtil.Cache[host] //cleanup cache 
		}		
		var record = this.nsResolve(_host); 
		this.LabelState( "Resolved" ) ; 
		this.Cache[_host] = record ;
		this.$('gethostip-panel').label = record ;		
	}
	,nsResolve:function(host){
		var cls = Cc['@mozilla.org/network/dns-service;1'];
		var dns = cls.getService(Ci.nsIDNSService ); // ( iface ) 
		var nsrecord = dns.resolve( host , 5 ); //resolve hostname 5 is not ipv6 //https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIDNSService#Resolve_flag_constants
		if (nsrecord){ return nsrecord.getNextAddrAsString() ; }
		return "-" ;
	}
} ;

function whoislookup(){	
	var tBrowser = top.document.getElementById("content");	
	var tab = tBrowser.addTab('http://who.is/whois-ip/ip-address/'+ nsUtil.$('gethostip-panel').label );
	tBrowser.selectedTab = tab;
}

function update(){
	var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebNavigation).QueryInterface(Components.interfaces.nsIDocShellTreeItem).rootTreeItem.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindow);
	var host = mainWindow.getBrowser().selectedBrowser.contentWindow.location.hostname;	
	nsUtil.Process(host,false ); // no cache
}

function ip2clipboard(){
	var clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"];
	var clipboardHelperService = clipboardHelper.getService(Components.interfaces.nsIClipboardHelper);
    clipboardHelperService.copyString(nsUtil.$('gethostip-panel').label);
}