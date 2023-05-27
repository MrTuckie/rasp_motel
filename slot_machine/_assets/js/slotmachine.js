var lastState = false;
var lastcall = Date.now() - 10000;

function toggleFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
     (!document.mozFullScreen && !document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {  
        document.documentElement.requestFullScreen();  
      } else if (document.documentElement.mozRequestFullScreen) {  
        document.documentElement.mozRequestFullScreen();  
      } else if (document.documentElement.webkitRequestFullScreen) {  
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
      }  
    } else {  
      if (document.cancelFullScreen) {  
        document.cancelFullScreen();  
      } else if (document.mozCancelFullScreen) {  
        document.mozCancelFullScreen();  
      } else if (document.webkitCancelFullScreen) {  
        document.webkitCancelFullScreen();  
      }  
    }  
}

function requestFullScreen() {

    var el = document.body;

    // Supports most browsers and their versions.
    var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen 
    || el.mozRequestFullScreen || el.msRequestFullScreen;

    if (requestMethod) {

      // Native full screen.
      requestMethod.call(el);

    } else if (typeof window.ActiveXObject !== "undefined") {

      // Older IE.
      var wscript = new ActiveXObject("WScript.Shell");

      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
}


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
        console.log("Inicialização...")
        this.options = $.extend(
            true, // deep extend
            {
                DEBUG			: true,
                premiosFolder	: '_assets/premios/', // Folder name where the prize images are
                locaisFolder	: '_assets/locais/',
                tarefasFolder	: '_assets/tarefas/',             
                premiosList		: null, // Array of prize images. Must be in PNG, 320px x 90px
                locaisList      : null,
                tarefasList     : null,
                sound 			: false,
                imgSize         : 'width="320" height="260"'
            },
            opts
        );

        toggleFullScreen();
        
        // If Prizes option isnt set, the plugin will use these
        if(this.options.premiosList  == null || this.options.beermansList  == null || this.options.beergirlsList  == null || this.options.locaisList  == null || this.options.tarefasList  == null)
        {
            console.log("Definindo lista de premios..")
	    	var premios = ["premio-1.png", "premio-2.png", "premio-3.png", "premio-4.png"];
            this.options.premiosList = premios;
            var tarefas = ["tarefa-1.png", "tarefa-2.png", "tarefa-3.png", "tarefa-4.png"];
            this.options.tarefasList = tarefas;            
            var locais = ["local-1.png", "local-2.png", "local-3.png", "local-4.png", "local-5.png"];
            this.options.locaisList = locais;
        }
        
        
        if(this.options.DEBUG) { console.log("Caça Niquel do Amor: Inicializando...") };
                
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
	    
        var tarefasListarraySize = parseInt(this.options.tarefasList.length);
        var locaisListarraySize	= parseInt(this.options.locaisList.length);
        var premiosListarraySize = parseInt(this.options.premiosList.length);
	    var randAppend	= 0;
	    var randAppend2	= 0;
        var randAppend3	= 0;
        var text = "";
	    // Essa função cria uma lista de 50 imagens aleatórias
	    for(var b = 0; b <= 50; b++)
	    {
			randAppend	= Math.floor(Math.random() * tarefasListarraySize);
            randAppend2	= Math.floor(Math.random() * locaisListarraySize);
            randAppend3	= Math.floor(Math.random() * premiosListarraySize);
            text = '<img '+ this.options.imgSize +' src="' + this.options.tarefasFolder + this.options.tarefasList[randAppend] + '" />'
			$("#YCSM-list-1").append(text);
            $("#YCSM-list-2").append('<img '+ this.options.imgSize +' src="' + this.options.locaisFolder + this.options.locaisList[randAppend2] + '" />');	
            $("#YCSM-list-3").append('<img '+ this.options.imgSize +' src="' + this.options.premiosFolder + this.options.premiosList[randAppend3] + '" />');		
	    }
	    console.log(text)
        console.log(this.options.tarefasList[randAppend])
        console.log(this.options.locaisList[randAppend2])
        console.log(this.options.premiosList[randAppend3])
	    this.LoadWinnerPrize();
    }
    
    /*
	 * Load Winner Prize Method
     */
    Plugin.prototype.LoadWinnerPrize = function ()
    {
        // essa função por enquanto é chamada apenas uma vez
	    if(this.options.DEBUG) { console.log("YC Slot Machine: Loading Winner Prize...") };
        
        var tarefasListarraySize	= parseInt(this.options.tarefasList.length);
        var locaisListarraySize	= parseInt(this.options.locaisList.length);
        var premiosListarraySize	= parseInt(this.options.premiosList.length);
        var randTarefas	= Math.floor(Math.random() * tarefasListarraySize);
        var randLocais	= Math.floor(Math.random() * locaisListarraySize);
        var randPremios	= Math.floor(Math.random() * premiosListarraySize);

        var text_1 = '<img '+ this.options.imgSize +' src="' + this.options.tarefasFolder + this.options.tarefasList[(Math.floor(Math.random() * tarefasListarraySize))] + '" />';
        var text_2 = '<img id="YCSM-winner-1" '+ this.options.imgSize +' src="' + this.options.tarefasFolder + this.options.tarefasList[randTarefas] + '" />';
        var text_3 = '<img '+ this.options.imgSize +' src="' + this.options.tarefasFolder + this.options.tarefasList[(Math.floor(Math.random() * tarefasListarraySize))] + '" />';
        $("#YCSM-list-1").append(text_1);
        $("#YCSM-list-1").append(text_2);
        $("#YCSM-list-1").append(text_3);
        
        $("#YCSM-list-2").append('<img '+ this.options.imgSize +' src="' + this.options.locaisFolder + this.options.locaisList[(Math.floor(Math.random() * locaisListarraySize))] + '" />');
        $("#YCSM-list-2").append('<img id="YCSM-winner-2" '+ this.options.imgSize +' src="' + this.options.locaisFolder + this.options.locaisList[randLocais] + '" />');
        $("#YCSM-list-2").append('<img '+ this.options.imgSize +' src="' + this.options.locaisFolder + this.options.locaisList[(Math.floor(Math.random() * locaisListarraySize))] + '" />');

        $("#YCSM-list-3").append('<img '+ this.options.imgSize +' src="' + this.options.premiosFolder + this.options.premiosList[(Math.floor(Math.random() * premiosListarraySize))] + '" />');
        $("#YCSM-list-3").append('<img id="YCSM-winner-3" '+ this.options.imgSize +' src="' + this.options.premiosFolder + this.options.premiosList[randPremios] + '" />');
        $("#YCSM-list-3").append('<img '+ this.options.imgSize +' src="' + this.options.premiosFolder + this.options.premiosList[(Math.floor(Math.random() * premiosListarraySize))] + '" />');
        
        this._isWinner	= true;
        if(this.options.DEBUG) { console.log("YC Slot Machine: The user will win") };
		
		$('#YCSM-buttons').html('<div id="YCSM-initiate"></div>');
	    this._SlotMachineListener();
        console.log(text_1);
        console.log(text_2);
        console.log(text_3);
	    
	}
	
	/* SlotMachine Listener Method */
	Plugin.prototype._SlotMachineListener = function ()
    {
        var isDebug		= this.options.DEBUG;
        var thePlug		= this;
        var theSound	= this.options.sound;

        
        
        // Detectando o click do teclado e verificando se está rodando
        $(document).keypress(function(event){

            // if (event['charCode'] == 97){
            //     premios.push('premio-5.png')
            //     return;
            // }

            if(((Date.now() - lastcall)) < 9000) {
                return;
            }

            lastcall = Date.now();
            setTimeout(function() {  

                if(isDebug) { console.log("YC Slot Machine: Start your engines...") };		    

                SlotMachine( 'YCSM-list-1' , 'YCSM-winner-1' , 4000 );
                SlotMachine( 'YCSM-list-2' , 'YCSM-winner-2' , 6000 );
                SlotMachine( 'YCSM-list-3' , 'YCSM-winner-3' , 8000 );
                
                // Play Game Sound
                var playSound = document.getElementById('YCSM-game');
                
                playSound.volume = 0.7;
                
                if(!theSound)
                {
                    playSound.volume	= 0;
                }
                
                playSound.play();
                // Play Result Sound
                setTimeout(function(){
                    
                    var resultSound;
                
                    resultSound	= document.getElementById('YCSM-win');
                    
                    resultSound.volume	= 1;
                    
                    if(!theSound)
                    {
                        resultSound.volume	= 0;
                    }
                    
                    resultSound.play();
                    
                },10500);
            },10);  
                   
        });
        
            
	    $('#YCSM-initiate').click(function() {

		    if(isDebug) { console.log("YC Slot Machine: Start your engines...") };		    
    
			SlotMachine( 'YCSM-list-1' , 'YCSM-winner-1' , 4000 );
			SlotMachine( 'YCSM-list-2' , 'YCSM-winner-2' , 6000 );
            SlotMachine( 'YCSM-list-3' , 'YCSM-winner-3' , 8000 );
			
			
			// Play Result Sound
			setTimeout(function(){
				
				
				var resultSound;
			
				/*if(isWinner)
				{*/
					resultSound	= document.getElementById('YCSM-win');
					//thePlug._winEvent();
				/*}
				else
				{
					resultSound	= document.getElementById('YCSM-lose');
					thePlug._loseEvent();
				}*/
				
				resultSound.volume	= 1;
				
				if(!theSound)
				{
					resultSound.volume	= 0;
				}
				
				resultSound.play();
								
				var resultSound;
			
				/*if(isWinner)
				{*/
					resultSound	= document.getElementById('YCSM-win');
					//thePlug._winEvent();
				/*}
				else
				{
					resultSound	= document.getElementById('YCSM-lose');
					thePlug._loseEvent();
				}*/
				
				resultSound.volume	= 1;
				
				if(!theSound)
				{
					resultSound.volume	= 0;
				}
				
				resultSound.play();
				
                //thePlug._SlotMachineCallback();
                
                //thePlug._loseEvent();

			},10500);			
		});		
	}


	Plugin.prototype._tryAgain = function ()
	{
        setTimeout(function(){
            slotMachine.closeModal()
        }, 3000);
	}
	
    // Essa porra é nunca chamada kkkkkkkkk vsf
	// Plugin.prototype._reloadSlotMachine = function ()
	// {
    //     console.log('Reloading...')
	// 	$("#YCSM-list-1").html('<div id="index-1"></div>');
	// 	$("#YCSM-list-2").html('<div id="index-2"></div>');
    //     $("#YCSM-list-3").html('<div id="index-3"></div>');

	// 	$("#YCSM-list-1").animate({scrollTop: $("#index-1").position().top}, 500, 'easeOutCirc');
	// 	$("#YCSM-list-2").animate({scrollTop: $("#index-2").position().top}, 500, 'easeOutCirc');
    //     $("#YCSM-list-3").animate({scrollTop: $("#index-3").position().top}, 500, 'easeOutCirc');
    //     this.LoadBoards();   
            
	// }
	
	/* SlotMachine Method */
	function SlotMachine( parentid , id , sec )
	{
        // sec é o tempo, eu acho
        // SlotMachine( 'YCSM-list-1' , 'YCSM-winner-1' , 4000 );
        console.log($("#" + id).position().top)
		// $("#" + parentid).animate({scrollTop: $("#" + id).position().top}, sec, 'easeOutCirc');
        rand_number = Math.floor(Math.random() * 10);
        rand_foto = rand_number*274
        $("#" + parentid).animate({scrollTop: $("#" + id).position().top - rand_foto}, sec, 'easeOutCirc');
        // $("#" + parentid).animate({scrollTop: }, sec, 'easeOutCirc');
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
            $.error( 'CN Do Amor Erro:: Plugin must be initialised before using method: ' + methodOrOptions );
        
        }
        else if ( methodOrOptions.indexOf('_') == 0 ) // Invalid method
        {
            $.error( 'CN Do Amor Erro:: Method ' +  methodOrOptions + ' is private!' );
        }
        else // Method doesnt exist
        {
            $.error( 'CN Do Amor Erro:: Method ' +  methodOrOptions + ' does not exist.' );
        }
    };
    
    
    
})(jQuery);