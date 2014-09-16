function process(){
	veUtil.populateMenu(document.getElementById("viewextMenu"));
}

var veUtil = {	
	c:function(s){
		gBrowser.selectedBrowser.contentWindow.console.log(s) ;
	}	
	,getAppInfo: function() {
		return Components.classes['@mozilla.org/xre/app-info;1'].
		createInstance(Components.interfaces.nsIXULAppInfo);
	}
	,getWin: function(name) {
		return Components.classes["@mozilla.org/appshell/window-mediator;1"].
		getService(Components.interfaces.nsIWindowMediator).
		getMostRecentWindow(name);
	}
	,getFrames: function(win) {
		if (!win) return [];
		var frms = [win];
		for (var i=0; i<frms.length; ++i) {
			for (var j=0; j<frms[i].frames.length; ++j) {
				frms.push(frms[i].frames[j]);
			}
			//we break after reaching 50 to avoid a possible endless loop from
			//occurring if the website has coded frames within frames.........
			if (i >= 50) break;
		}
		return frms;
	}
	,getImportedCSS: function(css) {
		var urls = [];
		var sheets = [css];

		for (var i=0; i<sheets.length; ++i) {
			for (var j=0; j<sheets[i].cssRules.length; ++j) {
				if (sheets[i].cssRules[j].type != 3) break;

				if (sheets[i].cssRules[j].styleSheet &&
				    sheets[i].cssRules[j].styleSheet.href) {
					//we need to make sure all anchors are removed from the urls
					urls.push(sheets[i].cssRules[j].styleSheet.href.replace(/#.*$/,''));
					sheets.push(sheets[i].cssRules[j].styleSheet);
				}
			}
			//we break after reaching 50 to avoid a possible endless loop from
			//occurring if a stylesheet tries to import itself over and over...
			if (i >= 50) break;
		}
		return urls;
	}
	,getStr:function(s){return s ;}
	
	,populateMenu: function(menu) {
		while (menu.firstChild) {
			menu.removeChild(menu.firstChild);
		}
		
		var uri,attrs,fname,cname,size,entry,cacheKey;
				
		var js = this.getExternalJS(window.content,false,true,true,true,true,true,true);
		var css = this.getExternalCSS(window.content,false,true,true,true,true,true,true);
		

		//get string translations
		
		var jsnf = this.getStr('Js NF');
		var cssnf = this.getStr('Css NF');
		var noname = this.getStr('No Name');
		var kb = this.getStr('KB');
		var bytes = this.getStr('Bytes');
		var jsall = this.getStr('View All Js');
		var cssall = this.getStr('View All Css');

		if (js.length < 1) {
			attrs = ['menuitem',  ['label',jsnf],
				  ['tooltiptext',jsnf], ['disabled','true'], ['class','menuitem-iconic jsview-none']];
			menu.appendChild(this.makeElement(attrs));
		} else {
			attrs = ['menuitem',
				  ['label',jsall],  ['tooltiptext',jsall], ['oncommand',"veUtil.viewAll('js',window.content);"],
				  ['class','menuitem-iconic jsview-js jsview-boldNormal']];
			menu.appendChild(this.makeElement(attrs));
		}
		
		
		for (var i=0; i<js.length; ++i) {
			//get filename from url
			fname = (js[i].fileName) ? js[i].fileName : noname;

			//add italic for chrome urls
			cname = (js[i].scheme.search(/^chrome$|^resource$/) > -1) ? 'jsview-js jsview-italic' : 'jsview-js';

			//get filesize for url if cached
			
			size = this.getCacheSize(js[i].spec)
			
			attrs = this.buildMenuAttrArray(fname , size ,js[i].spec , cname ) ;
			
			menu.appendChild(this.makeElement(attrs));
		}

		menu.appendChild(this.makeElement(['menuseparator']));
		
		
		if (css.length < 1) {
			attrs = ['menuitem',
				  ['label',cssnf],
				  ['tooltiptext',cssnf],
				  ['disabled','true'],
				  ['class','menuitem-iconic jsview-none']];
			menu.appendChild(this.makeElement(attrs));
		} else {
			attrs = ['menuitem',
				  ['label',cssall],
				  ['tooltiptext',cssall],
				  ['oncommand',"veUtil.viewAll('css',window.content);"],
				  ['class','menuitem-iconic jsview-css jsview-boldNormal']];
			menu.appendChild(this.makeElement(attrs));
		}

		for (var i=0; i<css.length; ++i) {
			//get filename from url
			fname = (css[i].fileName) ? css[i].fileName : noname;

			//add italic for chrome urls
			cname = (css[i].scheme.search(/^chrome$|^resource$/) > -1) ? 'jsview-css jsview-italic' : 'jsview-css';

			//get filesize for url if cached
			size = this.getCacheSize(css[i].spec)			
			attrs = this.buildMenuAttrArray(fname , size ,css[i].spec , cname ) ;			
			menu.appendChild(this.makeElement(attrs));
		}
	},
	
	makeElement: function(attrs) {
		var elem = document.createElement(attrs[0]);
		for (var i=1; i<attrs.length; ++i) {
			elem.setAttribute(attrs[i][0],attrs[i][1]);
		}
		return elem;
	}
	
	,buildMenuAttrArray:function(fname,size,spec,cname){
		return ['menuitem',
				  ['label',fname + size],
				  ['value',spec],
				  ['statustext',spec],
				  ['tooltiptext',spec],
				  ['oncommand','veUtil.viewSource(this.value,4);'],
				  ['class','menuitem-iconic ' + cname]];
	}
	
	//todo :
	// get cache service failed !
	,getCacheSize:function(spec){
		return "";
	}
	
	,viewAll: function(type,win) {
		var uris = (type == 'js') ? this.getExternalJS(win,false,true,true,true,true,true,true) : this.getExternalCSS(win,false,true,true,true,true,true,true);
		for (var i=0; i<uris.length; ++i) {
			setTimeout("veUtil.viewSource('"+uris[i].spec+"','4')",i*500);
		}
	}
	,viewSource: function(url,type) {
	
		var brows = this.getAppInfo();
		var win = this.getWin('navigator:browser');
		
		//url = 'view-source:' + url;
		var newTab = win.getBrowser().addTab(url);
		win.getBrowser().selectedTab = newTab;
		 
		//todo:
		//open in external editor		
		//	jsviewExternal.openInExternalEditor(url,null,null);
		
	}
	,getExternalCSS: function(win,embd,srt,fdup,curis,fuft,fwl,fcu) {
		var sheets,loc,uri;
		var styleUrls = [];
		var io = this.getIOService();

		//get a reference to all dom windows in current page
		var wins = this.getFrames(win);

		for (var i=0; i<wins.length; ++i) {
			sheets = wins[i].document.styleSheets;
			for (var j=0; j<sheets.length; ++j) {
				if (sheets[j].ownerNode &&
				    sheets[j].ownerNode instanceof Components.interfaces.nsIDOMHTMLStyleElement) {
					//save embedded stylesheets for page info window
					if (embd) styleUrls.push(sheets[j].ownerNode);
				} else if (sheets[j].href) {
					//we need to make sure all anchors are removed from the urls
					styleUrls.push(sheets[j].href.replace(/#.*$/,''));
				}
				styleUrls = styleUrls.concat(this.getImportedCSS(sheets[j]));
			}
		}

		//we sort the urls to ensure that chrome urls appear at top of menupopup
		if (srt) styleUrls.sort();

		//check for duplicate entries and remove them
		if (fdup) styleUrls = this.removeDuplicates(styleUrls);

		//we create the uris here instead of the previous loop since the urls
		//need to be sorted and duplicates removed before the uris can be created
		if (curis) {
			for (var i=0; i<styleUrls.length; ++i) {
				try {
					uri = io.newURI(styleUrls[i],null,null);
					uri.QueryInterface(Components.interfaces.nsIURL);
					styleUrls[i] = uri;
				} catch(e) {
					styleUrls.splice(i,1);
					--i;
				}
			}
		}

		

		//filter the styleUrls array for any urls that match window locations
		if (fwl) {
			for (var i=0; i<wins.length; ++i) {
				loc = wins[i].location.href.replace(/#.*$/,'');
				if (curis) {
					styleUrls = styleUrls.filter(function(value) { return value.spec != loc; });
				} else {
					styleUrls = styleUrls.filter(function(value) { return value != loc; });
				}
			}
		}

		//filter the styleUrls array for chrome urls
		if (curis && fcu) {
			if (false) {
				styleUrls = styleUrls.filter(function(value) {
					return value.scheme != 'chrome' && value.scheme != 'resource';
				});
			}
		}

		return styleUrls;
	},

	getExternalJS: function(win,embd,srt,fdup,curis,fuft,fwl,fcu) {
		var scriptUrls = [];
		var io = this.getIOService();
		var scripts,loc,source,srcAttr,uri;

		//get a reference to all dom windows in current page
		var wins = this.getFrames(win);

		for (var i=0; i<wins.length; ++i) {
			scripts = wins[i].document.getElementsByTagName('script');
			for (var j=0; j<scripts.length; ++j) {
				if (scripts[j].hasAttribute('src')) {
					//use getAttribute for xul script elements
					//use .src for html script elements
					srcAttr = scripts[j].getAttribute('src');
					source = (srcAttr.search(/^chrome\:|^resource\:/) > -1) ? srcAttr : scripts[j].src;
					if (source) {
						//we need to make sure all anchors are removed from the urls
						scriptUrls.push(source.replace(/#.*$/,''));
					}
				} else if (embd) { //save embedded scripts for page info window
					scriptUrls.push(scripts[j]);
				}
			}
		}

		//we sort the urls to ensure that chrome urls appear at top of menupopup
		if (srt) scriptUrls.sort();

		//check for duplicate entries and remove them
		if (fdup) scriptUrls = this.removeDuplicates(scriptUrls);

		//we create the uris here instead of the previous loop since the urls
		//need to be sorted and duplicates removed before the uris can be created
		if (curis) {
			for (var i=0; i<scriptUrls.length; ++i) {
				try {
					uri = io.newURI(scriptUrls[i],null,null);
					uri.QueryInterface(Components.interfaces.nsIURL);
					scriptUrls[i] = uri;
				} catch(e) {
					scriptUrls.splice(i,1);
					--i;
				}
			}
		}

		

		//filter the scriptUrls array for any urls that match window locations
		if (curis && fwl) {
			for (var i=0; i<wins.length; ++i) {
				loc = wins[i].location.href.replace(/#.*$/,'');
				scriptUrls = scriptUrls.filter(function(value) { return value.spec != loc; });
			}
		}

		//filter the scriptUrls array for chrome urls
		if (curis && fcu) {
			if (false) {
				scriptUrls = scriptUrls.filter(function(value) {
					return value.scheme != 'chrome' && value.scheme != 'resource';
				});
			}
		}

		return scriptUrls;
	}
	,getIOService: function(url) {
		return Components.classes["@mozilla.org/network/io-service;1"].
		getService(Components.interfaces.nsIIOService);
	}
	,
	removeDuplicates: function(arrOld) {
		var arrNew = [];
		for (var i=0; i<arrOld.length; ++i) {
			if (arrNew.indexOf(arrOld[i]) == -1) {
				arrNew.push(arrOld[i]);
			}
		}
		return arrNew;
	}
} ;
