Delicious.Assistant = Class.create({
	
	showLoader: function()
	{
		this.showNightShade();
		this.cleanNightShade();
		this.addToNightShade('<div class="loader"></div>');
	},
	
	hideLoader: function()
	{
		this.hideNightShade();
	},
	
	showLoading: function()
	{
		this.showNightShade();
		this.cleanNightShade();
		this.addToNightShade('<div class="loading"></div>');
	},
	
	hideLoading: function()
	{
		this.hideNightShade();
	},
	
	showNightShade: function()
	{
		if (!this.nightShade)
		{
			this.nightShade = new Element('div' , {id:'nightShade' , className: 'palm-scrim'});
		}
		this.nightShade.show();
		if (!this.nightShade.parentNode)
		{
			this.controller.sceneElement.appendChild(this.nightShade);
		}
	},
	
	hideNightShade: function()
	{
		if (this.nightShade && this.nightShade.parentNode)
		{
			this.nightShade.remove();
		}
		if (this.overNightShade && this.overNightShade.parentNode)
		{
			this.overNightShade.remove();
		}
	},
	
	addToNightShade: function(elt)
	{
		if (!this.overNightShade)
		{
			this.overNightShade = new Element('div' , {id:'overNightShade'});
		}
		
		this.overNightShade.show();
		if (!this.overNightShade.parentNode)
		{
			this.controller.sceneElement.appendChild(this.overNightShade);
		}
		
		
		this.overNightShade.insert(elt);
		this.centerOverNightShade();
	},
	
	centerOverNightShade: function()
	{
		var height = this.overNightShade.offsetHeight;
		var width = this.overNightShade.offsetWidth;
		
		var hh = this.nightShade.offsetHeight;
		var ww = this.nightShade.offsetWidth;
		
		if (width > ww || height > hh) return;
		
		var middleTop = Math.floor((hh/2)-(height/2));
		var middleLeft = Math.floor((ww/2)-(width/2));
		
		this.overNightShade.setStyle({position:'absolute' , top: middleTop + 'px' , left: middleLeft + 'px'});
	},
	
	cleanNightShade: function()
	{
		if (this.overNightShade)
		{
			this.overNightShade.innerHTML = "";
		}
	},
	
	popScene: function(o)
	{
		o = o || {};
		this.controller.stageController.popScene(o);
	},
	
	errorDialog: function(msg , cb)
	{
		cb = cb || function() {};
		this.msgDialog("Error" , msg , cb);
	},
	
	msgDialog: function(titleText , msg , cb)
	{
		titleText = titleText || "Title";
		msg = msg || "message alert text";
		cb = cb || function() {};
		this.controller.showAlertDialog({
			    onChoose: cb ,
			    title: titleText,
			    message: msg,
			    choices:[
			         {label:$L('continue')} 
			    ]
			   });
	},
	
	posNegDialog: function(titleText , msg , pos , neg , cb)
	{
		this.questionDialog(titleText , msg , pos , 'affirmative' , neg , 'dismiss' , cb);
	},
	
	questionDialog: function(titleText , msg , posText , posClassName, negText , negClassName , cb)
	{
		titleText = titleText || "Title";
		msg = msg || "message alert text";
		posText = posText || "Continue";
		posClassName = posClassName || '';
		negText = negText || "cancel";
		negClassName = negClassName || '';
		cb = cb || function() {};
		this.controller.showAlertDialog({
			    onChoose: cb ,
			    title: titleText,
			    message: msg,
			    choices:[
			         {label:posText , value:true , type:posClassName},
			         {label:negText , value:false , type:negClassName}
			    ]
			   });
	},
	
	activateScrollTop: function()
	{
		var main = this.controller.get('main-header');
		if (main)
		{
			this._scrollToTop = this._scrollToTop || this.scrollToTop.bindAsEventListener(this);
			main.observe(Mojo.Event.tap , this._scrollToTop);
		}
	},
	
	deactivateScrollTop: function()
	{
		var main = this.controller.get('main-header');
		if (main)
		{
			main.stopObserving(Mojo.Event.tap , this._scrollToTop);
		}
	},
	
	activateWindow: function()
	{
		Feeds.Notifications.close();
	},
	
	deactivateWindow: function()
	{
		var notify = Feeds.Preferences.getNotificationSettings();
		if (notify.enabled)
		{
			Feeds.Notifications.enable();
		}
		else
		{
			Feeds.Notifications.disable();
		}
	},
	
	scrollToTop: function()
	{
		var scroller = this.controller.getSceneScroller();
		var distance;
		//scroller.scrollTop = (0);
		var func = (function(el , distance) { 
			var cur = el.scrollTop;
			cur -= distance;
			if (cur < 5)
			{
				el.scrollTop = 0;
				return;
			}
			else
			{
				el.scrollTop = cur;
				window.setTimeout(arguments.callee.bind({}, el , distance) , 50);
			}
		});
		
		distance = Math.ceil(scroller.scrollTop/10);
		if (distance < 30) distance = 30;
		func(scroller , distance);
	},
	
	handleCommand: function(event)
	{
		this.doHandleCommand(event);
	},
	
	doHandleCommand: function(event)
	{
		if (event.type == Mojo.Event.commandEnable && (event.command == Mojo.Menu.helpCmd || event.command == Mojo.Menu.prefsCmd)) 
		{
         	event.stopPropagation(); // enable help. now we have to handle it
		}
		
		if (event.type == Mojo.Event.command) 
		{
			switch (event.command) 
			{
				case Mojo.Menu.helpCmd:
					this.controller.stageController.pushScene('support');
				break;
				
				case Mojo.Menu.prefsCmd:
					this.controller.stageController.pushScene('preferences');
				break;			
				
				case "logout":
					if (Feeds.GoogleAccount)
					{
						Feeds.GoogleAccount.logout();
						Feeds.StageManager.close('main');
					}
				break;
				
				case "login":
					this.controller.stageController.pushScene('login');
				break;
				
				case "goOnline":
					window.setTimeout(this.goOnline.bind(this) , 500);
				break;
				
				case "goOffline":
					window.setTimeout(this.goOffline.bind(this) , 500);
				break;
				
			}
		}
	},
	
	getAppMenu: function()
	{
		var appmenu = [];
		if (Feeds.GoogleAccount.isLoggedIn())
		{
			appmenu.push({label: $L("Logout") , command: "logout"});
		}
		else
		{
			appmenu.push({label: $L("Login") , command: "login"});
		}
		
		return appmenu;
	},
	
	orientationChanged: function(orientation)
	{
		var landscape = Feeds.Preferences.getLandscapeSettings();
		if (this._orientation === orientation || !landscape.enabled)
		{
			return;
		}
		
		this._orientation = orientation;
		this.controller.window.PalmSystem.setWindowOrientation(this._orientation);
	},
	
	isOffline: function()
	{
		return window.browseOffline;
	},
	
	goOffline: function()
	{
	
	},
	
	goOnline: function()
	{
		
	}
	
});