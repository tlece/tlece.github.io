//modal
function Modal() {
	var  moviestart;
	$('.js-modal-open').each(function () {
		$(this).on('click', function () {
			scrollPos = $(window).scrollTop();
			var target = $(this).data('target');
			var movietarget = $(this).data('movienum');
			var modal = document.getElementById(target);
			moviestart = document.getElementById(movietarget);

			$(modal).fadeIn();
			$('html').addClass('scroll-lock').css({ 'margin-right': '17px' });
			$('.header_wrap').css({ zIndex: 1 });
			startmovie();

			//close
			$('.js-modal-close').on('click', function () {
				if (moviestart != null) {
					stopmovie();
				}
				return false;
			});
			return false;
		});
	});
	//close
	$('.js-modal-close').on('click', function () {
		$('.modal').fadeOut();
		stopmovie();
		$('html').removeClass('scroll-lock').css({ 'margin-right': '0px' });
		$('.header_wrap').css({ zIndex: 998 });
		$(window).scrollTop(scrollPos);
		return false;
	});
	function startmovie() {
		var playerWindow = moviestart.contentWindow;
		playerWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
	}
	function stopmovie() {
		var playerWindow = moviestart.contentWindow;
		playerWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
	}
}

var timer = null;
$(window).scroll(function () {
	clearTimeout(timer);
	timer = setTimeout(function () {
		Modal();
	}, 300);
});


//smooth scroll
function AncerLinkAnim() {
	$('a[href^="#"]').click(function () {
		var speed = 500;
		var href = $(this).attr("href");
		console.log(headerSize);
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top;
		var headerSize = $('.header_wrap').height();
		position = position - headerSize;
		$("html, body").animate({ scrollTop: position }, speed, "swing");
		return false;
	});
}

//device check
function PcSpChangeFlg() {
	if (window.matchMedia('(max-width: 767px)').matches) {
		// SP
		$("#nav").removeClass("nav_pc").addClass("nav_sp");

		if ($(".menu_open").hasClass('active')) {
			$(".nav_sp").css("display", "flex");
			$('html').addClass('scroll-lock');
		} else {
			$(".nav_sp").css("display", "none");
		}

	} else {
		// PC
		$("#nav").removeClass("nav_sp").addClass("nav_pc");

		if ($(".menu_open").hasClass('active')) {
			$(".nav_pc").css("display", "flex");
			$('html').removeClass('scroll-lock');
		} else {
			$(".nav_pc").css("display", "flex");
		}
	}
}

$(function () {
	AncerLinkAnim();
	PcSpChangeFlg();
	Modal();

	//__________ Humberger Menu __________//

	$('.menu_open').click(function (e) {
		$(this).toggleClass('active');
		$('.nav').slideToggle('2000');
		$('html').toggleClass('scroll-lock');
	});
	$('nav a[href^="#"]').on('click', function (e) {
		e.stopPropagation();
		if (window.innerWidth <= 767) {
			$('.menu_open').trigger('click');
		}
	});
});


$(window).on("orientationchange resize", function () {
	PcSpChangeFlg();
});


