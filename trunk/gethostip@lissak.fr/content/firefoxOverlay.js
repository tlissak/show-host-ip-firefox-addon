var nsGhipUtil = {		
	c:function(s){
		gBrowser.selectedBrowser.contentWindow.console.log(s) ;
	}
	,_cache : {}
	, $ : function(_id){ return document.getElementById(_id) ; }
	, LabelState : function(key ) { 
		this.$('gethostip-panel').setAttribute('class', 'ghip-' + key );
	}
	, GetCurrentHost : function(){  return gBrowser.selectedBrowser.contentWindow.location.hostname  ;	}
	, Process: function(_host,useCache){
		if (!_host){
			this.LabelState( "empty" ) ;
			this.$('gethostip-panel').label =  "-"  ; 
			return ;
		}
		if (useCache && (_host in this._cache)){
			this.LabelState( "cache" ) ;
			this.$('gethostip-panel').label =  this._cache[_host] ; 
			return ;
		}
		var cls = Cc['@mozilla.org/network/dns-service;1'];
		var dns = cls.getService(Ci.nsIDNSService ); // ( iface ) 

		dns.asyncResolve( _host , 5 , new nsGhipUtil.nsResolveListner(_host) ,null ); //resolve hostname : 5 is not ipv6 		
	}
	,nsResolveListner : function(_host){
		this.host = _host; //host context
		this.onLookupComplete = function( aRequest, aRecord, aStatus ){
			if (aRecord){ 
				record = aRecord.getNextAddrAsString() ; 				
				nsGhipUtil.LabelState( "resolved" ) ; 				
				nsGhipUtil._cache[this.host] = record ;				
				nsGhipUtil.$('gethostip-panel').label = record ;				
			}else{
				nsGhipUtil.$('gethostip-panel').label = "0.0.0.0" ;
			}
		}
	}
	,load:function(event){
		window.removeEventListener("load", nsGhipUtil.load, false); 
		if(!gBrowser) return ;	//firefox only
		gBrowser.addProgressListener({
		  onLocationChange: function(aProgress, aRequest, aURI){  
			nsGhipUtil.Process(nsGhipUtil.GetCurrentHost(), true );  
		}});
	}
	,whoislookup: function(){	
		var tBrowser = top.document.getElementById("content");	
		var tab = tBrowser.addTab('http://who.is/whois-ip/ip-address/'+ nsGhipUtil.$('gethostip-panel').label );
		tBrowser.selectedTab = tab;
	}
	,update:function (){
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebNavigation).QueryInterface(Components.interfaces.nsIDocShellTreeItem).rootTreeItem.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindow);
		var host = mainWindow.getBrowser().selectedBrowser.contentWindow.location.hostname;	
		nsGhipUtil.Process(host,false ); // no cache
	}
	,ip2clipboard:function(){
		var clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"];
		var clipboardHelperService = clipboardHelper.getService(Components.interfaces.nsIClipboardHelper);
		clipboardHelperService.copyString(nsGhipUtil.$('gethostip-panel').label);
	}
	
} ;

window.addEventListener("load", nsGhipUtil.load ,false);