"use strict";

// PCの場合True
function isPc() {
  return window.innerWidth > 768;
} // Mobileの場合True


function isMobile() {
  return !isPc();
}

var headerHeight = jQuery('.js-header').outerHeight();
document.documentElement.style.setProperty('--header-height', "".concat(headerHeight, "px"));
/**
 * スクロールバーを除いた画面幅の取得
 */

jQuery(window).on('load resize', function () {
  var vw = document.body.clientWidth; // スクロールバーを除いた幅を取得

  var vh = window.innerHeight; // アドレスバーを覗いた画面高さ

  headerHeight = jQuery('.js-header').outerHeight();
  document.documentElement.style.setProperty('--vw', "".concat(vw, "px"));
  document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
  document.documentElement.style.setProperty('--header-height', "".concat(headerHeight, "px"));
});
/**
 * 指定の要素のテキストを1文字ずつspanで囲む
 */

var wrapSpan = function wrapSpan() {
  var textWrap = document.querySelectorAll('.js-wrapSpan');
  textWrap.forEach(function (t) {
    return t.innerHTML = t.textContent.replace(/\S/g, '<span>$&</span>');
  });
};
/**
 * アンカーリンク
 */


function scrollHash() {
  var hash = location.hash;

  if (hash) {
    var offset = jQuery(hash).offset().top;
    var scrollto = offset - ("fixed" !== jQuery("#header").css("position") ? headerHeight + 20 : 0);
    jQuery('html, body').animate({
      scrollTop: scrollto
    }, 500);
  }
} // ローディング判定


jQuery(window).on("load", function () {
  jQuery("body").attr("data-loading", "true");
});
/**
 * フェードしたページに戻るときに白飛びする対応
 */

jQuery(window).on("pageshow", function () {
  if (event.persisted) {
    window.location.reload();
  }
});
wrapSpan();
jQuery(function () {
  scrollHash(); // 画面遷移

  jQuery('a:not([href*="#"]):not([target]):not([href*="mailto"]):not([href*="tel"])').on('click', function (event) {
    event.preventDefault();
    var url = jQuery(this).attr('href');

    if (event.ctrlKey && !event.metaKey || !event.ctrlKey && event.metaKey) {
      // ctrl(command) + click 時に別ウィンドウで開く処理
      window.open(url, '_blank');
      return false;
    }

    if (url !== '') {
      jQuery('body').fadeOut(500);
      setTimeout(function () {
        window.location = url;
      }, 500);
    }
  }); // スクロール判定

  jQuery(window).on("scroll", function () {
    var scrollTop = jQuery(this).scrollTop();
    var windowHeight = jQuery(this).height();
    var documentHeight = jQuery(document).height();

    if (100 < scrollTop) {
      jQuery("body").attr("data-scroll", "true");
    } else {
      jQuery("body").attr("data-scroll", "false");
    }

    if (documentHeight - (windowHeight + scrollTop) <= 0) {
      jQuery("body").attr("data-scroll-bottom", "true");
    } else {
      jQuery("body").attr("data-scroll-bottom", "false");
    }
    /**
     * トップに戻るボタン
     */


    var totop = jQuery('.js-totop');
    var totopTarget = jQuery(".".concat(totop.data("target")));

    if ((totopTarget.length ? totopTarget.innerHeight() : headerHeight) < scrollTop) {
      totop.addClass('is-active');
    } else {
      totop.removeClass('is-active');
    }
  });
  /* ヘッダ */

  jQuery(window).on('load scroll', function () {
    // if (jQuery('body').hasClass('home')) {
    var $header = jQuery('.js-header');

    if ($header.length) {
      var target = jQuery(".".concat(jQuery($header).data('target')));
      var targetHeight = target.length ? target.innerHeight() : headerHeight * 2.1;
      var position = jQuery(this).scrollTop();

      if (position > targetHeight - headerHeight) {
        $header.addClass('is-fixed');
        jQuery('.js-fv').addClass('is-fixed');
        headerHeight = jQuery('.js-header').outerHeight();
        document.documentElement.style.setProperty('--header-height', "".concat(headerHeight, "px"));
      } else if (position == 0) {
        $header.removeClass('is-fixed');
        jQuery('.js-fv').removeClass('is-fixed');
        headerHeight = jQuery('.js-header').outerHeight();
        document.documentElement.style.setProperty('--header-height', "".concat(headerHeight, "px"));
      }
    } // }

  });
  /* ドロワー */

  jQuery(".js-drawer").on("click", function (event) {
    event.preventDefault();
    var targetClass = jQuery(this).attr("data-target");
    var ariaControls = jQuery(this).attr("aria-controls");
    var addClass = 'is-opened'; // targetのクラス名をトグル

    jQuery(".".concat(targetClass)).toggleClass(addClass); // 制御対象のaria-hidden属性を操作

    jQuery("#".concat(ariaControls)).attr("aria-hidden", jQuery("#".concat(ariaControls)).hasClass(addClass) ? 'false' : 'true'); // 同じ制御対象を持つ要素全てに対して制御対象の状態に応じてaria-expanded属性を操作

    jQuery("[aria-controls=".concat(ariaControls, "]")).each(function () {
      jQuery(this).attr("aria-expanded", jQuery("#".concat(ariaControls)).hasClass(addClass) ? 'false' : 'true');
    }); // ドロワー開時にbody要素がスクロールしないように

    jQuery(".".concat(targetClass)).hasClass(addClass) ? jQuery('body').addClass('u-overflowHidden') : jQuery('body').removeClass('u-overflowHidden');
    return false;
  });
  /* スムーススクロール */

  jQuery('a[href*="#"]:not(".js-tabIndex, .js-modal, .js-accordion")').on('click', function (e) {
    // e.preventDefault();
    var currentUrl = location.protocol + '//' + location.host + location.pathname; // 現在のURL

    var href = jQuery(this).prop("href");
    var hrefUrl = href.split('#')[0]; // リンク先のURL

    if (currentUrl == hrefUrl) {
      var id = '#' + href.split('#')[1]; // リンク先のアンカー

      var speed = 300;
      var target = jQuery("#" == id ? "html" : id);
      var position = target.offset().top - headerHeight;

      if ("fixed" !== jQuery("#header").css("position")) {
        position = target.offset().top;
      }

      if (0 > position) {
        position = 0;
      }

      jQuery("html, body").animate({
        scrollTop: position
      }, speed);
      jQuery(this).blur(); // return false;
    }
  });
  /* モーダル */

  jQuery('.js-modal').on('click', function (e) {
    e.preventDefault();
    var target = jQuery(this).data('target');

    if (jQuery(".".concat(target)).hasClass('is-opened')) {
      jQuery(".".concat(target)).fadeOut(300).removeClass('is-opened');
      jQuery('body').removeClass('u-overflowHidden');
    } else {
      jQuery(".".concat(target)).fadeIn(300).addClass('is-opened');
      jQuery('body').addClass('u-overflowHidden');
    }

    return false;
  }); // accordion を閉じておく

  /* jQueryが動作しなかった場合のためにCSSではdisplay none をせずにjqueryで閉じる */

  jQuery('.js-accordion').each(function (index, element) {
    jQuery(this).next().hide();
    jQuery(this).removeClass('is-opened');
  }); // accordion

  jQuery('.js-accordion').on('click', function () {
    var $target = jQuery(this).data("target");

    if (jQuery(this).hasClass('is-opened')) {
      jQuery(this).nextAll('.' + $target).slideUp();
      jQuery(this).removeClass('is-opened');
    } else {
      jQuery(this).nextAll('.' + $target).slideDown();
      jQuery(this).addClass('is-opened');
    }
  });
  /* 電話リンク */

  var $ua = navigator.userAgent;

  if ($ua.indexOf("iPhone") < 0 && $ua.indexOf("Android") < 0) {
    // PCのとき
    jQuery('a[href^="tel:"]') // 電話リンク
    .css("cursor", "default") // カーソルをポインターにしない
    .css('pointer-events', 'none') // ホバーなども動作しない
    .on("click", function (e) {
      e.preventDefault();
    });
  }
  /* tab */


  jQuery('.js-tabIndex').on('click', function (e) {
    e.preventDefault();
    var index = jQuery(this).parent().index();
    var targets = jQuery(this).data('target');
    var target = jQuery(this).attr('href');
    jQuery('.js-tabIndex.is-active').removeClass('is-active');
    jQuery(this).addClass('is-active'); // 現在表示しているものを非表示にする

    jQuery(".".concat(targets, ".is-active")).hide().removeClass('is-active'); // クリックしたタブのターゲットを表示

    jQuery(target).fadeIn(300).addClass('is-active');
    return false;
  });
});
var fvSlider = new Swiper('.js-fvSlider', {
  loop: true,
  speed: 600,
  slidesPerView: 1,
  autoplay: {
    delay: 3000,
    stopOnLast: false,
    disableOnInteraction: true
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  }
});

//google map
google.maps.event.addDomListener(window, "load", initMap);
function initMap() {
  var latlng_tokyo = new google.maps.LatLng(35.6815558, 139.7601572);//中心の緯度, 経度
  var latlng_bang = new google.maps.LatLng(23.7703281, 90.3453244);//中心の緯度, 経度
  var latlng_NY = new google.maps.LatLng(40.7607986, -73.9743371);//中心の緯度, 経度
  var map_tokyo = new google.maps.Map(document.getElementById('map-tokyo'), {
    zoom: 14,//ズームの調整
    center: latlng_tokyo//上で設定した中心
  });
  var map_bangladesh = new google.maps.Map(document.getElementById('map-bangladesh'), {
    zoom: 14,//ズームの調整
    center: latlng_bang//上で設定した中心
  });
  var map_NY = new google.maps.Map(document.getElementById('map-ny'), {
    zoom: 14,//ズームの調整
    center: latlng_NY//上で設定した中心
  });
  //マーカーの設定
  var marker_tokyo = new google.maps.Marker({
    position: latlng_tokyo,
    map: map_tokyo,
    icon: '../img/common/icon_pin_1.svg'
  });
  var marker_bang = new google.maps.Marker({
    position: latlng_bang,
    map: map_bangladesh,
    icon: '../img/common/icon_pin_1.svg'
  });
  var marker_NY = new google.maps.Marker({
    position: latlng_NY,
    map: map_NY,
    icon: '../img/common/icon_pin_1.svg'
  });
}

var tl = gsap.timeline();
tl.to('.js-fv, .js-header', {
  opacity: 1,
  ease: "power2.inOut",
  duration: 1.5
}).to('.js-fvCopy .js-wrapSpan span', {
  ease: "power4.inOut",
  opacity: 1,
  y: 0,
  stagger: {
    each: 0.02,
    from: "start"
  }
}, ">-0.75");
var fadeInTargets = document.querySelectorAll('.js-fadeInUp');
fadeInTargets.forEach(function (target) {
  gsap.to(target, {
    y: 0,
    opacity: 1,
    scrollTrigger: {
      trigger: target,
      start: 'top 80%' // markers: true

    }
  });
});