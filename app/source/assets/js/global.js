(function(){

	$(document).ready(function(){

		/* reset the height of outer-wrap to enable side nav full height*/

		$("#outer-wrap").css('min-height', pwcUtility.viewport().height);
		$("#nav").css('min-height', pwcUtility.viewport().height);

		var url = window.location.href;
	    $('.nav li a[href="'+url+'"]').parent().addClass('active');

		
	    /* initialize date pickers */
		$('.datePicker').datepicker({ 
			dayNamesMin: [ "S", "M", "T", "W", "T", "F", "S" ],
				onClose: function(dateText, inst) { $(this).removeAttr('disabled') },
     			beforeShow: function(dateText, inst) { $(this).attr('disabled', 'disabled') },
		 });

		/* fix to hide calendar due to conflict with select box*/
		$(document).on("click touchstart",function (e) {
			var ele = $(e.target); 
			if (!ele.hasClass("hasDatepicker") && !ele.hasClass("ui-datepicker") && !ele.hasClass("ui-datepicker-next") && !ele.hasClass("ui-datepicker-prev") && !ele.hasClass("ui-icon") && !$(ele).parent().parents(".ui-datepicker").length)
			    {
			    	$(".hasDatepicker").datepicker("hide");
			    }

			if(ele.hasClass("ui-datepicker-next") && ele.hasClass("ui-datepicker-prev") && ele.hasClass("ui-icon")){
				e.stopPropagation();
				e.preventDefault();
			}     
		});

		/* initialize custom select boxes */
		$('select.customSelect').selectbox();

		var currentPage = $('body').attr('class');

		switch(currentPage){

			case 'checkout-page': $(".navPageTitle").html("Checkout");
									break;

			case 'cart-page': $(".navPageTitle").html("Cart");
									break;
									
			case 'saved-carts-page': $(".navPageTitle").html("Saved Carts");
									break;

			case 'store-page': $(".navPageTitle").html("Buy Online");
									break;												

			default: break;
		}

		/* initialize all switch toggles*/
		$('input.switch').switch();

		/* handler for fav - star icon click */
		$(".favIcon_inactive").click(function(){
			
			if(!$(this).hasClass('favIcon_active')){
				$(this).addClass('favIcon_active');
			}else{
				$(this).removeClass('favIcon_active');
			}
			
		});

		var tabs = $(".tab-menu");
		$(tabs).each(function(index){
			
			var numOfChildren = $(this).children('li').length;
			var width = 100 / numOfChildren;
			$(this).children('li').css('width', (width+'%'));

		});		

		$(".tab-menu > li").click(function(e){

	        $(".tab-content").hide();

	        var selectedTabID = $(this).attr('id');
	        $("#"+selectedTabID+'-content').show();

	        $(".tab-menu").children('li').removeClass('active');
	        $(this).addClass('active');

	    });

		

	});

}());