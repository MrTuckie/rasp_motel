/*
	This plugin was developed by 
	
	██╗   ██╗ █████╗ ██╗  ██╗     ██████╗ ██████╗ ██████╗ ███████╗██████╗ ███████╗
	╚██╗ ██╔╝██╔══██╗██║ ██╔╝    ██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝
	 ╚████╔╝ ███████║█████╔╝     ██║     ██║   ██║██║  ██║█████╗  ██████╔╝███████╗
	  ╚██╔╝  ██╔══██║██╔═██╗     ██║     ██║   ██║██║  ██║██╔══╝  ██╔══██╗╚════██║
	   ██║   ██║  ██║██║  ██╗    ╚██████╗╚██████╔╝██████╔╝███████╗██║  ██║███████║
	   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝     ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝
	   
	Yak Coders - Digital Crowd
	http://yak-coders.com
	
	Plugin Name: HTML5 YC Slot Machine
	Plugin URL: http://yak-coders.com/projects/yc-slot-machine
	Description: This plugin puts your YC Slot Machine to work
	Version: 1.0
	Author: Yak Coders Crowd - Sas
	Author URL: http://yak-coders.com
*/

(function( $ ){
    
    var PLUGIN_NS = 'YCSlotMachine';
    
    var Plugin = function ( target, options ) 
    { 
        this.$T = $(target); 
        this._init( target, options );
        return this;
    }
    
    /** #### CONSTANTS #### */
    Plugin.MY_CONSTANT = 'value';

    /** #### INITIALISER #### */
    Plugin.prototype._init = function ( target, opts ) 
    { 
		/** Establish YC Slot Machine default settings **/	
		
        this.options = $.extend(
            true, // deep extend
            {
                DEBUG			: false,
                prizesFolder	: '_assets/prizes/', // Folder name where the prize images are
	            prizesList		: null, // Array of prize images. Must be in PNG, 320px x 90px
	            winMode			: 'random', // random, ratio or attempt
	            winRatio		: 50, // Probability
	            totalAttempts	: 10,
	            attemptsList	: null, // Array of win attempts
	            complete		: null,
	            sound 			: true	            
            },
            opts
        );
        
        // If Prizes option isnt set, the plugin will use these
        if(this.options.prizesList  == null)
        {
	    	var prizes		= ["prize-1.png", "prize-2.png", "prize-3.png", "prize-4.png", "prize-5.png", "prize-6.png", "prize-7.png", "prize-8.png", "prize-9.png"];
	    	this.options.prizesList	= prizes;
        }
        
        // If Attemps list option isnt set, the plugin will use these
        if(this.options.attemptsList  == null)
        {
	    	var attempts	= [3,7,10];
	    	this.options.attemptsList	= attempts;
        }
        
        // If user specifies wrong winRatio, set it as 50
        if(isNaN(this.options.winRatio) || this.options.winRatio > 100 || this.options.winRatio < 0 || this.options.winMode == 'random')
        {
	        this.options.winRatio 	= 50;
        }
        
        if(this.options.DEBUG) { console.log("YC Slot Machine: Initializing...") };
                
        // Private properties
        this._isWinner 	= false;
        this._testProp 	= 'testProp!'; // Private property declaration, underscore optional
        
        // After init, we will load the boards
        this.LoadBoards();
    };
    
    /*
	 * Load Board Method
     */
    Plugin.prototype.LoadBoards = function ()
    {
	    if(this.options.DEBUG) { console.log("YC Slot Machine: Loading Boards...") };
	    
	    var arraySize	= parseInt(this.options.prizesList.length);
	    var randAppend	= 0;
	    var randAppend2	= 0;
	    var randAppend3	= 0;
	    
	    for(var b = 0; b <= 50; b++)
	    {
			randAppend	= Math.floor(Math.random() * arraySize);
			randAppend2	= Math.floor(Math.random() * arraySize);
			randAppend3	= Math.floor(Math.random() * arraySize);
			
			$("#YCSM-list-1").append('<img src="' + this.options.prizesFolder + this.options.prizesList[randAppend] + '" />');
			$("#YCSM-list-2").append('<img src="' + this.options.prizesFolder + this.options.prizesList[randAppend2] + '" />');
			$("#YCSM-list-3").append('<img src="' + this.options.prizesFolder + this.options.prizesList[randAppend3] + '" />');			
	    }
	    
	    this.LoadWinnerPrize();
    }
    
    /*
	 * Load Winner Prize Method
     */
    Plugin.prototype.LoadWinnerPrize = function ()
    {
	    if(this.options.DEBUG) { console.log("YC Slot Machine: Loading Winner Prize...") };
	    if(this.options.DEBUG)
	    {
		    if(this.options.winMode == 'attempt')
		    {
		    	console.log("YC Slot Machine: winMode: " + this.options.winMode);
		    }
		    else
		    {
			    console.log("YC Slot Machine: winMode: " + this.options.winMode + " - winRatio:" + this.options.winRatio);
		    }
	    }
	    
	    var arraySize	= parseInt(this.options.prizesList.length);
	    var winCheck	= 0;
	    var isWinner	= false;
	    
	    /*  Check the Winning Mode */
	    switch( this.options.winMode )
	    {
		    case 'attempt':
		    
		    	if(this.options.DEBUG) { console.log("YC Slot Machine: Entering attempt mode") };
		    	
		    	// The slot machine will read the Play Attempt
		    	var YCAttempt	= parseInt($('#YCplay').val());
		    	
		    	if(this.options.attemptsList.indexOf(YCAttempt) != -1)
		    	{			    	
			    	isWinner	= true;
				}
		        
		        break;
		        
		    default:
		    	
		    	if(this.options.DEBUG) { console.log("YC Slot Machine: Entering ratio/random mode") };
		    
		        winCheck	= Math.floor(Math.random() * 101); // Between 0 and 100
		    	if(winCheck > (100 - this.options.winRatio))
		    	{
			    	isWinner	= true;
		    	}
		}
	    
	    /* Winner-Loser code */
	    if(isWinner)
	    {
		    var randPrize	= Math.floor(Math.random() * arraySize);
	    }
	    else
	    {
		    var randLoser1	= Math.floor(Math.random() * arraySize);
		    var randLoser2	= Math.floor(Math.random() * arraySize);
		    var randLoser3	= Math.floor(Math.random() * arraySize);
		    
		    if(randLoser1 == randLoser2 && randLoser2 == randLoser3)
		    {
			    if(randLoser1 == 0)
			    {
					randLoser2	= 1;
			    }
			    else
			    {
				    randLoser2	= 0;
			    }
			    
		    }
	    }
	    
	    if(isWinner)
	    {
		    $("#YCSM-list-1").append('<img src="' + this.options.prizesFolder + this.options.prizesList[(Math.floor(Math.random() * arraySize))] + '" />');
		    $("#YCSM-list-1").append('<img id="YCSM-winner-1" src="' + this.options.prizesFolder + this.options.prizesList[randPrize] + '" />');
		    $("#YCSM-list-1").append('<img src="' + this.options.prizesFolder + this.options.prizesList[(Math.floor(Math.random() * arraySize))] + '" />');
		    
		    $("#YCSM-list-2").append('<img src="' + this.options.prizesFolder + this.options.prizesList[(Math.floor(Math.random() * arraySize))] + '" />');
		    $("#YCSM-list-2").append('<img id="YCSM-winner-2" src="' + this.options.prizesFolder + this.options.prizesList[randPrize] + '" />');
		    $("#YCSM-list-2").append('<img src="' + this.options.prizesFolder + this.options.prizesList[(Math.floor(Math.random() * arraySize))] + '" />');
		    
		    $("#YCSM-list-3").append('<img src="' + this.options.prizesFolder + this.options.prizesList[(Math.floor(Math.random() * arraySize))] + '" />');
		    $("#YCSM-list-3").append('<img id="YCSM-winner-3" src="' + this.options.prizesFolder + this.options.prizesList[randPrize] + '" />');
		    $("#YCSM-list-3").append('<img src="' + this.options.prizesFolder + this.options.prizesList[(Math.floor(Math.random() * arraySize))] + '" />');
		    
		    this._isWinner	= true;
		    if(this.options.DEBUG) { console.log("YC Slot Machine: The user will win") };
	    }
	    else
	    {
		    $("#YCSM-list-1").append('<img src="' + this.options.prizesFolder + this.options.prizesList[(Math.floor(Math.random() * arraySize))] + '" />');
		    $("#YCSM-list-1").append('<img id="YCSM-winner-1" src="' + this.options.prizesFolder + this.options.prizesList[randLoser1] + '" />');
		    $("#YCSM-list-1").append('<img src="' + this.options.prizesFolder + this.options.prizesList[(Math.floor(Math.random() * arraySize))] + '" />');
		    
		    $("#YCSM-list-2").append('<img src="' + this.options.prizesFolder + this.options.prizesList[(Math.floor(Math.random() * arraySize))] + '" />');
		    $("#YCSM-list-2").append('<img id="YCSM-winner-2" src="' + this.options.prizesFolder + this.options.prizesList[randLoser2] + '" />');
		    $("#YCSM-list-2").append('<img src="' + this.options.prizesFolder + this.options.prizesList[(Math.floor(Math.random() * arraySize))] + '" />');
		    
		    $("#YCSM-list-3").append('<img src="' + this.options.prizesFolder + this.options.prizesList[(Math.floor(Math.random() * arraySize))] + '" />');
		    $("#YCSM-list-3").append('<img id="YCSM-winner-3" src="' + this.options.prizesFolder + this.options.prizesList[randLoser3] + '" />');
		    $("#YCSM-list-3").append('<img src="' + this.options.prizesFolder + this.options.prizesList[(Math.floor(Math.random() * arraySize))] + '" />');
		    
		    this._isWinner	= false;
		    if(this.options.DEBUG) { console.log("YC Slot Machine: The user will lose") };
		}
		
		$('#YCSM-buttons').html('<div id="YCSM-initiate"></div>');
	    this._SlotMachineListener();
	    
	}
	
	/* SlotMachine Listener Method */
	Plugin.prototype._SlotMachineListener = function ()
    {
	    var isDebug		= this.options.DEBUG;
	    var isWinner	= this._isWinner;
	    var thePlug		= this;
	    var theSound	= this.options.sound;
	    
	    var theWinMode	= this.options.winMode;
	    var totalAttempts	= this.options.totalAttempts;
	    
	    $('#YCSM-initiate').click(function()
	    {
		    if(isDebug) { console.log("YC Slot Machine: Start your engines...") };
		    
		    if(theWinMode == 'attempt')
		    {
			    // Read the Attempt number
			    var attemptNum	= parseInt($('#YCplay').val());
			    
			    if(isDebug) { console.log("YC Slot Machine: Attempt #" + attemptNum + " is starting") };
			    
			    if(attemptNum < totalAttempts)
			    {
				    $('#YCplay').val((attemptNum + 1));
			    }
			    else
			    {
				    $('#YCplay').val(1);
			    }
		    }
		    
			SlotMachine( 'YCSM-list-1' , 'YCSM-winner-1' , 5000 );
			SlotMachine( 'YCSM-list-2' , 'YCSM-winner-2' , 7000 );
			SlotMachine( 'YCSM-list-3' , 'YCSM-winner-3' , 10000 );
			
			// Play Game Sound
			var playSound		= document.getElementById('YCSM-game');
			
			playSound.volume	= 1;
			
			if(!theSound)
			{
				playSound.volume	= 0;
			}
			
			playSound.play();
			
			// Play Result Sound
			setTimeout(function(){
				
				var resultSound;
			
				if(isWinner)
				{
					resultSound	= document.getElementById('YCSM-win');
					thePlug._winEvent();
				}
				else
				{
					resultSound	= document.getElementById('YCSM-lose');
					thePlug._loseEvent();
				}
				
				resultSound.volume	= 1;
				
				if(!theSound)
				{
					resultSound.volume	= 0;
				}
				
				resultSound.play();
				
				thePlug._SlotMachineCallback();

			},9500);
			
		});
		
	}
	
	Plugin.prototype._SlotMachineCallback = function ()
	{
		if ( $.isFunction( this.options.complete ) ) {
	        this.options.complete.call( this );
	    }
	}
	
	Plugin.prototype._winEvent = function ()
	{
		$('#YCSM-message').html('<img src="_assets/img/congrats.png"><button id="tryagain">Try Again!</button>');
		this._tryAgain();
		slotMachine.openModal('YCSM-modal');
	}
	
	Plugin.prototype._loseEvent = function ()
	{
		$('#YCSM-message').html('<img src="_assets/img/loser.png"><button id="tryagain">Try Again!</button>');
		this._tryAgain();
		slotMachine.openModal('YCSM-modal');
	}
	
	Plugin.prototype._tryAgain = function ()
	{
		var thePlug		= this;
		$('#tryagain').click(function()
		{
			slotMachine.closeModal();
			thePlug._reloadSlotMachine();
		});
	}
	
	Plugin.prototype._reloadSlotMachine = function ()
	{
		$("#YCSM-list-1").html('<div id="index-1"></div>');
		$("#YCSM-list-2").html('<div id="index-2"></div>');
		$("#YCSM-list-3").html('<div id="index-3"></div>');
		
		$("#YCSM-list-1").animate({scrollTop: $("#index-1").position().top}, 500, 'easeOutCirc');
		$("#YCSM-list-2").animate({scrollTop: $("#index-2").position().top}, 500, 'easeOutCirc');
		$("#YCSM-list-3").animate({scrollTop: $("#index-3").position().top}, 500, 'easeOutCirc');
		this.LoadBoards();
	}
	
	/* SlotMachine Method */
	function SlotMachine( parentid , id , sec )
	{
		$("#" + parentid).animate({scrollTop: $("#" + id).position().top}, sec, 'easeOutCirc');
	}
	
    
    /**
	 * ###########################
	 * YC Slot Machine Plugin Code
	 * ###########################
	 */
    $.fn[ PLUGIN_NS ] = function( methodOrOptions ) 
    {
        if (!$(this).length) {
            return $(this);
        }
        var instance = $(this).data(PLUGIN_NS);            
              
        if ( instance 
                && methodOrOptions.indexOf('_') != 0 
                && instance[ methodOrOptions ] 
                && typeof( instance[ methodOrOptions ] ) == 'function' ) // Action method
        {
            
            return instance[ methodOrOptions ]( Array.prototype.slice.call( arguments, 1 ) );
            
        } 
        else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) // Argument > Options Object or empty
        {

            instance = new Plugin( $(this), methodOrOptions );
            $(this).data( PLUGIN_NS, instance );
            return $(this);
            
        }
        else if ( !instance ) // Method Called before init the plugin
        {
            $.error( 'YC Slot Machine Error: Plugin must be initialised before using method: ' + methodOrOptions );
        
        }
        else if ( methodOrOptions.indexOf('_') == 0 ) // Invalid method
        {
            $.error( 'YC Slot Machine Error: Method ' +  methodOrOptions + ' is private!' );
        }
        else // Method doesnt exist
        {
            $.error( 'YC Slot Machine Error: Method ' +  methodOrOptions + ' does not exist.' );
        }
    };
    
    
    
})(jQuery);