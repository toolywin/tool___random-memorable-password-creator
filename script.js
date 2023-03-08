"use strict";

let PWDMeter = {
	1: {'class': 'danger',  		'title': L_PWD_STRENGTH_VERY_WEAK},
	2: {'class': 'danger',  		'title': L_PWD_STRENGTH_WEAK},
	3: {'class': 'warning', 		'title': L_PWD_STRENGTH_LOW},
	4: {'class': 'info',    		'title': L_PWD_STRENGTH_FAIR},
	5: {'class': 'secondary',		'title': L_PWD_STRENGTH_STANDARD},
	6: {'class': 'light',    		'title': L_PWD_STRENGTH_GOOD},
	7: {'class': 'primary', 		'title': L_PWD_STRENGTH_STRONG},
	8: {'class': 'primary', 		'title': L_PWD_STRENGTH_VERY_STRONG},
	9: {'class': 'success',    		'title': L_PWD_STRENGTH_EXCELLENT},
};

function updateSliderValue(slider, handle = 0) {
	var children, i, results, val, values;
	children = slider.getElementsByClassName('noUi-handle');
	values = slider.noUiSlider.get();
	//l(values);
	i = 0;
	results = [];
	while (i < children.length) {
		if (children.length === 1) {
			val = parseInt(values);
		} else {
			val = parseInt(values[i]);
		}
		children[i].dataset.value = val;
		results.push(i++);
	}
	return results;
}

//var log_console = true;
function password_streng_meter(str) {
	/* max is 100:
		+ 64 chars
		+ min of 5 chars for A-Z + a-z + 0-9 + !@#
	*/

	let index = 0;
	let arr = [/[a-z]+/g, /[A-Z]+/g, /[0-9]+/g, /[\W]+/g];

	if( typeof log_console != 'undefined' )
		l( 'string length: ' + str.length);

	// max length: 64 chars, index = 76
	// max length may be 64+ then returned index will be 100+
	// then return max is 100
	index += Math.floor(str.length*1.1985);

	if( typeof log_console != 'undefined' )
		l( 'index @ string length: ' + index);

	jQuery.map(arr, function(regexp) {
		// max of each: 6 * 4 = 24
		let count = ((str || '').match(regexp) || []).length;
		if( count>0 )
		{
			index += 1;

			// 5+ chars of each
			if( count>=10 )
				index += 5;
			else if( count>=5 )
				index += 3;
			else if( count>=3 )
				index += 2;

			if( typeof log_console != 'undefined' )
				l( 'index @ regex [' + regexp + '] (count:' + count + '): ' + index);
		}
	});
	return index>100 ? 100 : index;
}

function run_live_mode_pwd_generator(randomize) {
	let ids = ['set', 'full', 'sort', 'text', 'break', 'length', 'quantity'];
	const wordset = Object.keys(MEMORABLE_WORD);
	randomize = randomize!==undefined && randomize ? true : false;

	if( $('#live_mode').is(':checked') )
	{
		// detect inputs if not random
		if( !randomize ) {
			$(ids).each(function(i, e) {
				if( $( "#" + e ).length<=0 ) {
					return;
				}
			});

			if( $('#length').val()<3 || $('#length').val()>MAX_LENGTH || $('#quantity').val()<1 || $('#quantity').val()>MAX_QUANTITY ) {
				return;
			}
		}

		// ok
		$('.pwd_item').eq(0).find('textarea').val('');
		let html = $('.pwd_item').eq(0).prop('outerHTML');

		html = html // remove title to re-init tooltips after created quantity
					.replace(/aria\-label/g, 'title');
					// hide this first to apply slideDown effect
					//.replace(' pwd_item', ' pwd_item d-none');
		html = $.parseHTML( html );

		// create instance
		$('.pwd_container').html( '' );
		let html_appended, new_pwd, container_meter, strength, strength_index;
		let input_quantity = randomize ? RANDOM_QUANTITY : $('#quantity').val();

		const random_sort  = ['az', 'za', '-'],
			  random_text  = ['UPPERCASE', 'lowercase', 'uPPERCASE', 'Uppercase'],
			  random_break = ['-', ',', '|', 'random'];

		let input_set    = $('#set').val(),
			input_length = $('#length').val(),
			input_full   = $('[name="full"]').is(':checked'),
			input_sort   = $('[name="sort"]:checked').val(),
			input_text   = $('[name="text"]:checked').val(),
			input_break  = $('[name="break"]:checked').val();

		for(let i=0; i<input_quantity; i++) {
			html_appended = html;

			if( randomize ) {
				input_set    = wordset[Math.floor(Math.random() * wordset.length)];
				input_length = getRandomInt(3, 26);
				input_full   = getRandomInt(0, 1);
				input_sort   = random_sort[Math.floor(Math.random() * random_sort.length)];
				input_text   = random_text[Math.floor(Math.random() * random_text.length)];
				input_break  = random_break[Math.floor(Math.random() * random_break.length)];
			}

			new_pwd = randomMemorablePassword(input_set, input_length, input_full, input_sort, input_text, input_break);

			$('.pwd_container').append( $(html_appended).prop('outerHTML') );

			/*new Typed($('.pwd_container').find('textarea').last().get(0), {
				strings: [new_pwd, new_pwd],
				typeSpeed: 0,
				cursorChar: ' '
			});*/
			$('.pwd_container').find('textarea').last().get(0).value = new_pwd;

			// password meter
			container_meter = $('.pwd_container .pwd_meter_bar').last();

			// show all meters and remove all meter classes
			$('div', container_meter)
				.removeClass('bg-danger bg-warning bg-info bg-secondary bg-light bg-primary bg-success');

			// calculate strength
			strength = password_streng_meter(new_pwd);
			strength_index = Math.ceil(strength*.09); // 9 levels

			// assign meter color & strength to progress bar
			container_meter.attr('data-meter-color', PWDMeter[strength_index].class);
			container_meter.attr('data-meter-strength', strength);

			// close estimated time
			container_meter.next().slideUp('fast');

			//let c = new bootstrap.Collapse( container );
			/*let c = bootstrap.Collapse.getInstance( container_meter.next() );
			if( c!=null )
				c.dispose();*/
			//c.show();

			// set strength width
			$('div', container_meter)
				.css('width', strength + '%')
				//.text(PWDMeter[strength_index].title + ' (' + strength + ')')
				.addClass('bg-' + PWDMeter[strength_index].class);

			// assign strength + index but hide it
			// only show on hover
			$('span', container_meter)
				.text(PWDMeter[strength_index].title + ' (' + strength + ')')
				.css('display', 'none');

			// destroy click state
			container_meter.removeAttr('data-clicked');
		}

		const tooltipTriggerList = [].slice.call(document.querySelectorAll('.pwd_container [data-bs-toggle="tooltip"]'));
		const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

		const popoverTriggerList = document.querySelectorAll('.pwd_container [data-bs-toggle="popover"]');
		const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl, {trigger: 'focus', html: true}));
	}
}

document.addEventListener("DOMContentLoaded", function(e) {
	// show favorite icon if was in list
	// you do not need to run if use same button with class btn_mark_fav with child icon <i> tag
	/*if( localStorage.getItem("tool_fav")!==null && localStorage.getItem("tool_fav")!='' ) {
		var tool_fav = localStorage.getItem("tool_fav").split(',');
		if( $('.btn_mark_fav').length>0 && tool_fav.includes($('.btn_mark_fav').data('tool-id').toString()) ) {
			$('.btn_mark_fav i').attr('class', FA_CLASS + ' fa-heart-circle-minus fa_class_switcher fs-1 text-danger');
			changeTooltip(document.querySelector('.btn_mark_fav'), L_FAV_REMOVE);
		}
		$('#count_fav').text( tool_fav.length-2 );
    }*/

	// dynamically change options
	$('.options input').on('input', function(e) {
		run_live_mode_pwd_generator();
	});
	$('#length').on('input', function(e) {
		slider_length.noUiSlider.set( this.value );
	});
	$('#quantity').on('input', function(e) {
		slider_quantity.noUiSlider.set( this.value );
	});
	$(document).on({
	    mouseover: function (e) {
	    	if( typeof $(this).attr('data-clicked') != 'undefined' && $(this).attr('data-clicked') )
	    		return false;

			$('span', this).fadeIn();
	    },
	    mouseleave: function () {
	    	if( typeof $(this).attr('data-clicked') != 'undefined' && $(this).attr('data-clicked') )
	    		return false;

			$('span', this).fadeOut();
	    }
	}, '.pwd_meter_bar');

	$(document).on('click', '.btn_pwd_new', function() {
		let s = randomMemorablePassword($('[name="set"]').val(), $('#length').val(), $('[name="full"]').is(':checked'), $('[name="sort"]:checked').val(), $('[name="text"]:checked').val(), $('[name="break"]:checked').val());

		//$(this).closest('div').find('input').val( s );
		//$(this).closest('div').find('input').attr('data-value', s);

		// typewriter effect to show new string
		/*new Typed($(this).closest('div').find('textarea').get(0), {
			strings: [s, s],
			typeSpeed: 0,
			cursorChar: ' '
		});*/
		$(this).closest('div').find('textarea').get(0).value = s;

		// password meter
		let container_meter = $(this).closest('.pwd_item').find('.pwd_meter_bar');

		// show all meters and remove all meter classes
		$('div', container_meter)
			.removeClass('bg-danger bg-warning bg-info bg-secondary bg-light bg-primary bg-success');

		// calculate strength
		let strength = password_streng_meter(s),
			strength_index = Math.ceil(strength*.09); // 9 levels

		// assign meter color & strength to progress bar
		container_meter.attr('data-meter-color', PWDMeter[strength_index].class);
		container_meter.attr('data-meter-strength', strength);

		// close estimated time
		container_meter.next().slideUp('fast');

		// set strength width
		$('div', container_meter)
			.css('width', strength + '%')
			//.text(PWDMeter[strength_index].title + ' (' + strength + ')')
			.addClass('bg-' + PWDMeter[strength_index].class);

		// assign strength + index but hide it
		// only show on hover
		$('span', container_meter)
			.text(PWDMeter[strength_index].title + ' (' + strength + ')')
			.css('display', 'none');

		// destroy click state
		container_meter.removeAttr('data-clicked');
	});
	$(document).on('click', '.pwd_meter_bar', function() {
		// make strength index visible
		$('span', this).css('display', 'block');
		$(this).attr('data-clicked', '1');

		//let c = bootstrap.Collapse.getInstance($(this).closest('.pwd_item').find('.collapse'));
		//l($(this).next());

		// estimate container
		let container = $(this).next('div');

		// init collapse
		/*let c = new bootstrap.Collapse( container );
		//bootstrap.Collapse.getOrCreateInstance( container ).show();
		c.show();*/

		// get meter color of clicked bar
		let color = $(this).data('meter-color');

		// set same width for progress bar to show arrow at same position of text
		$('.progress-bar', container)
			.css('width', $(this).data('meter-strength') + '%');

		// add classes
		$('.pwd_meter_arrow_up', container)
			.removeClass('arrow-bg-danger arrow-bg-warning arrow-bg-info arrow-bg-secondary arrow-bg-light arrow-bg-primary arrow-bg-success')
			.addClass('arrow-bg-' + color);
		$('.card', container)
			.removeClass('border-danger border-warning border-info border-secondary border-light border-primary border-success')
			.addClass('border-' + color);

		// calculate time to brute force
		let second = zxcvbn( $(this).closest('.pwd_item').find('textarea').val() ).crack_times_seconds.offline_slow_hashing_1e4_per_second,
			second_display = '';

		if( second<=1 )
			second_display += L_LESS_THAN_SECOND;
		else
		{
			$.each(secondToTime(second), function(i, v) {
				// only show if time>0
				if( v>0 ) {
					// add number
					second_display += ' ' + v + ' ';

					// add label
					second_display += eval('L_TIME_' + i.toUpperCase() + (i==1?'':'S')) + ', ';
				}
			});
		}

		$('.card-body', container).html( second_display.trim().slice(0, -1) );
		container.removeClass('d-none').slideDown();
	});

	$(document).on('click', '.btn_pwd_qrcode', function() {
		const myPopover = bootstrap.Popover.getInstance( $(this).find('i').get(0), {placement: 'bottom', trigger: 'focus', html: true} );

		const qrcode = kjua({
			text: $(this).closest('div').find('textarea').val(),

			render: 'image',
			back: '#fff',
			size: 250,
			quiet: 0,

			mode: 'label',
			mSize: 20,
		    mPosX: 50,
		    mPosY: 50,

		    // label
		    label: SITE_DOMAIN,
		    fontname: 'Ubuntu Mono',
		    fontcolor: '#ffc700',
		});

		myPopover._config.content = $('<p class="text-center">' + $(this).closest('div').find('textarea').val() + '<br/><br/></p>').append(qrcode);
		myPopover.setContent();
	});

	// handler term
	$(document).on('click', '.btn_term', function() {
		Swal.fire({
			title: '<strong>' + L_TERM_TITLE + '</strong>',
			html: L_TERM_BODY,
			icon: "success",
			buttonsStyling: false,
			confirmButtonText: L_CLOSE,
			showCloseButton: true,
			showClass: {
				popup: 'animate__animated animate__fadeInDown'
			},
			hideClass: {
				popup: 'animate__animated animate__fadeOutUp'
			},
			customClass: {
			    confirmButton: "btn btn-warning"
			}
		});
	});

	// before form submitted
	$(document).on('submit', '#form_tool', function(e) {
		// get user params
		let parameters = $('#form_tool').serialize(),
			random = false;

		if( $(this).find("[type=submit]:focus" ).attr('id')=='randomize' )
		{
			random = true;
			parameters = '';
		}

		// always use Live Mode to show passwords in client only
		// no data sent to any party or server
		run_live_mode_pwd_generator(random);

		// log action only, no data
		$.ajax({
			type: "GET",
			url	: $('#form_tool').prop('action') + '?do=' + $(this).find("[type=submit]:focus" ).attr('id') + '&' + parameters + '&r=' + Date.now()
		});

		return false;
	});

	// handler copy
	let c = new ClipboardJS(".btn_pwd_copy", {
		text: function(trigger) {
			return $(trigger).closest('div').find('textarea').val();
		}
	});
    c.on('success', function(e) {
		toastr.options = T_bottom_center;
		toastr.success(L_COPIED);
	});
	c.on('error', function(e) {
		toastr.options = T_bottom_center;
		toastr.error(L_COPIED_ERROR);
	});

	// handler sliders
    let slider_length = document.querySelector("#slider_length"),
    	slider_quantity = document.querySelector("#slider_quantity");
    noUiSlider.create(slider_length, {
	    start: USER_LENGTH,
	    step: 1,
	    range: {
	        "min": 5,
	        "max": MAX_LENGTH
	    },
	    format: wNumb({
	        decimals: 0, // default is 2
	    }),
	    
	});
    noUiSlider.create(slider_quantity, {
	    start: USER_QUANTITY,
	    step: 1,
	    range: {
	        "min": 1,
	        "max": MAX_QUANTITY
	    },
	    format: wNumb({
	        decimals: 0, // default is 2
	    }),
	    
	});

    // MUST trigger after some seconds
    // to re-init tooltips of each created password
    setTimeout(function() {
		slider_length.noUiSlider.on('update', function(values, handle) {
			$('#length').val( values[handle] );
			run_live_mode_pwd_generator();
		});
		slider_quantity.noUiSlider.on('update', function(values, handle) {
			$('#quantity').val( values[handle] );
			run_live_mode_pwd_generator();
		});
    }, 500);

	if( localStorage.getItem("term_memorable_pwd_creator")==null || !Boolean(localStorage.getItem("term_memorable_pwd_creator")) )
	{
		localStorage.setItem("term_memorable_pwd_creator", true);
		$('.btn_term').trigger('click');
	}

	// run randomize if no parameter
	if( !window.location.href.includes('?') && !window.location.href.includes('&') )
	{
	    setTimeout(function() {
			run_live_mode_pwd_generator(true);
	    }, 1500);
	}
	else {
		let url = new URL(window.location.href),
			u = url.searchParams;

		if( u.get('set')!=null )
			$('#set').val( u.get('set') );
		if( u.get('sort')!=null && u.get('full') )
			$('#full').attr( 'checked', true );

		if( u.get('sort')!=null )
			$('[name="sort"][value="' + u.get('sort') + '"]').attr('checked', true);
		if( u.get('text')!=null )
			$('[name="text"][value="' + u.get('text') + '"]').attr('checked', true);
		if( u.get('break')!=null )
			$('[name="break"][value="' + u.get('break') + '"]').attr('checked', true);

		if( u.get('length')!=null && u.get('length')>2 && u.get('length')<MAX_LENGTH )
			$('#length').val( u.get('length') );
		if( u.get('quantity')!=null && u.get('quantity')>0 && u.get('quantity')<MAX_QUANTITY )
			$('#quantity').val( u.get('quantity') );

		run_live_mode_pwd_generator();
	}
});