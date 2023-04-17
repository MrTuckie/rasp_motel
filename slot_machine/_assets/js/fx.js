'use strict';

$(document).ready(function()
{	
	var lights		= setInterval('slotMachine.sideLights()',1000);
	
	// Set modal Height
	var alt 	= window.innerHeight;
	$('#modal_background').css('height',alt + 'px');
});


var slotMachine = {	
    
    sideLights: function() {	
    	
    	// Left lights
    	$("#left_light img:nth-child(1)" ).fadeOut( 500 );
    	$("#left_light img:nth-child(2)" ).fadeIn( 500 );
    	$("#left_light img:nth-child(2)" ).fadeOut( 500 );
    	$("#left_light img:nth-child(1)" ).fadeIn( 500 );
    	
    	// Right lights
    	$("#right_light img:nth-child(1)" ).fadeOut( 500 );
    	$("#right_light img:nth-child(2)" ).fadeIn( 500 );
    	$("#right_light img:nth-child(2)" ).fadeOut( 500 );
    	$("#right_light img:nth-child(1)" ).fadeIn( 500 );
		
    },
    
    openModal: function(id_modal) {
	    $('#modal_background').fadeIn();
		$('#' + id_modal).fadeIn();
		return false;
    },
    
    closeModal: function() {
	    $('#modal_background').fadeOut();
		$('.modal_window').fadeOut();
    },
    
    modalWindow: function() {
	    
	    $('.close-modal').click(function()
		{
			$('#modal_background').fadeOut();
			$('.modal_window').fadeOut();
		});
		
    }
    
}