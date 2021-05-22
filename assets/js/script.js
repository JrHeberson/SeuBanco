"use strict";

(function ($) {
  "use strict";
  /*----------------------------
  Toogle Search
  ------------------------------ */
  // Handle click on toggle search button

  $('.search-box').on('click', function () {
    $('.search').toggleClass('open');
    return false;
  });
  $(window).on('load', function () {
    $('.progress-bar').each(function () {
      var width = $(this).data('percent');
      $(this).css({
        'transition': 'width 3s'
      });
      $(this).appear(function () {
        console.log('hello');
        $(this).css('width', width + '%');
        $(this).find('.count').countTo({
          from: 0,
          to: width,
          speed: 3000,
          refreshInterval: 50
        });
      });
    });
  }); //End On Load Function

  /* ----------------------------------------------------------- */

  /*  Cases SLider
  /* ----------------------------------------------------------- */

  $('.cases-content-slider').owlCarousel({
    loop: true,
    dots: false,
    nav: true,
    autoplayHoverPause: true,
    autoplay: false,
    autoplayTimeout: 6000,
    responsiveClass: true,
    margin: 20,
    navContainer: '#nav-container',
    navText: ["<i class='icofont-thin-left'></i>", "<i class='icofont-thin-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      576: {
        items: 1,
        dots: true,
        nav: false
      },
      768: {
        items: 2,
        dots: true,
        nav: false
      },
      1000: {
        items: 2
      },
      1200: {
        items: 2
      },
      1600: {
        items: 2
      }
    }
  });
  /* ----------------------------------------------------------- */

  /*  Testimonial SLider
  /* ----------------------------------------------------------- */

  $('.testimonials-slides').owlCarousel({
    loop: true,
    dots: false,
    nav: false,
    autoplayHoverPause: true,
    autoplay: false,
    autoplayTimeout: 6000,
    responsiveClass: true,
    navText: ["<i class='icofont-thin-left'></i>", "<i class='icofont-thin-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      576: {
        items: 1,
        dots: true,
        nav: false
      },
      768: {
        items: 1,
        dots: true,
        nav: false
      },
      1000: {
        items: 1
      },
      1200: {
        items: 2
      },
      1400: {
        items: 2
      },
      1600: {
        items: 3
      }
    }
  });
  $('.latest-work-gallery').owlCarousel({
    loop: true,
    dots: false,
    nav: true,
    autoplayHoverPause: true,
    autoplay: false,
    autoplayTimeout: 6000,
    responsiveClass: true,
    margin: 20,
    navText: ["<i class='icofont-thin-left'></i>", "<i class='icofont-thin-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      576: {
        items: 1,
        dots: true,
        nav: false
      },
      768: {
        items: 2,
        dots: true,
        nav: false
      },
      1000: {
        items: 2
      },
      1200: {
        items: 2
      },
      1400: {
        items: 3
      },
      1600: {
        items: 3
      }
    }
  });
  /*----------------------------
    Sidebar Menu
    ------------------------------ */

  function sidebarInfo() {
    var searchTrigger = $('.a-nav-toggle'),
        endTriggersearch = $('.sidebar-close'),
        container = $('.menu ');
    searchTrigger.on('click', function (e) {
      e.preventDefault();
      container.addClass('sidebar-visible');
    });
    endTriggersearch.on('click', function () {
      container.removeClass('sidebar-visible');
    });
  }

  ;
  sidebarInfo();
  /*====== clickable Main Menu active ======*/

  var $clickableMainMenu = $('.clickable-mainmenu-wrap'),
      $clickableSubMenu = $clickableMainMenu.find('.sub-menu-2');
  /*Close Off Canvas Sub Menu*/

  $clickableSubMenu.slideUp();
  /*Category Sub Menu Toggle*/

  $clickableMainMenu.on('click', 'li a, li .menu-expand', function (e) {
    var $this = $(this);

    if ($this.parent('li').hasClass('has-sub-menu') || $this.attr('href') === '#' || $this.hasClass('menu-expand')) {
      e.preventDefault();

      if ($this.siblings('ul:visible').length) {
        $this.parent('li').removeClass('active').children('ul').slideUp().siblings('a').find('.menu-expand i').removeClass('icofont-caret-down ').addClass('icofont-caret-down ');
        $this.parent('li').siblings('li').removeClass('active').find('ul:visible').slideUp().siblings('a').find('.menu-expand i').removeClass(' icofont-caret-down ').addClass('icofont-caret-down ');
      } else {
        $this.parent('li').addClass('active').children('ul').slideDown().siblings('a').find('.menu-expand i').removeClass('icofont-caret-down ').addClass('icofont-caret-down');
        $this.parent('li').siblings('li').removeClass('active').find('ul:visible').slideUp().siblings('a').find('.menu-expand i').removeClass('icofont-caret-down ').addClass('icofont-caret-down ');
      }
    }
  });
  /*---------------------
          Video popup
      --------------------- */

  $('.video-icon a').magnificPopup({
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    zoom: {
      enabled: true
    }
  });
  /* ----------------------------------------------------------- */

  /*  Portfolio  Related sLider
  /* ----------------------------------------------------------- */

  $('.related-works-gallery').owlCarousel({
    loop: true,
    dots: true,
    nav: false,
    autoplayHoverPause: true,
    autoplay: false,
    autoplayTimeout: 6000,
    responsiveClass: true,
    margin: 20,
    // navText : ["<i class='icofont-simple-left'></i>","<i class='icofont-simple-right'></i>"],
    responsive: {
      0: {
        items: 1,
        dots: true,
        nav: false
      },
      576: {
        items: 1,
        nav: false
      },
      768: {
        items: 2,
        nav: false
      },
      1000: {
        items: 3
      },
      1200: {
        items: 3
      }
    }
  });
  $('.post-gallery').owlCarousel({
    loop: true,
    dots: false,
    nav: true,
    autoplayHoverPause: true,
    autoplay: false,
    autoplayTimeout: 4000,
    responsiveClass: true,
    navText: ["<i class='icofont-simple-left'></i>", "<i class='icofont-simple-right'></i>"],
    responsive: {
      0: {
        items: 1,
        dots: true,
        nav: false
      },
      576: {
        items: 1,
        nav: false
      },
      768: {
        items: 1,
        nav: false
      },
      1000: {
        items: 1
      },
      1200: {
        items: 1
      }
    }
  });
  /* ---------------------------------------------
          Projects filtering
  --------------------------------------------- */

  var $portfolio = $('.portfolio-filter-wrap');

  if ($.fn.imagesLoaded && $portfolio.length > 0) {
    imagesLoaded($portfolio, function () {
      $portfolio.isotope({
        layoutMode: 'fitRows',
        itemSelector: '.portfolio-item',
        filter: '*'
      });
      $(window).trigger("resize");
    });
  }

  $('.portfolio-filter').on('click', 'a', function (e) {
    e.preventDefault();
    $(this).parent().addClass('active').siblings().removeClass('active');
    var filterValue = $(this).attr('data-filter');
    $portfolio.isotope({
      filter: filterValue
    });
  });
  /* ----------------------------------------------------------- */

  /*  Map
  /* ----------------------------------------------------------- */

  var map;

  function initialize() {
    var mapOptions = {
      zoom: 13,
      center: new google.maps.LatLng(50.97797382271958, -114.107718560791) // styles: style_array_here

    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }

  var google_map_canvas = $('#map-canvas');

  if (google_map_canvas.length) {
    google.maps.event.addDomListener(window, 'load', initialize);
  }
  /* ---------------------------------------------
         Contact Form
  --------------------------------------------- */


  var form = $('.contact__form'),
      message = $('.contact__msg'),
      form_data; // Success function

  function done_func(response) {
    message.fadeIn().removeClass('alert-danger').addClass('alert-success');
    message.text(response);
    setTimeout(function () {
      message.fadeOut();
    }, 2000);
    form.find('input:not([type="submit"]), textarea').val('');
  } // fail function


  function fail_func(data) {
    message.fadeIn().removeClass('alert-success').addClass('alert-success');
    message.text(data.responseText);
    setTimeout(function () {
      message.fadeOut();
    }, 2000);
  }

  form.submit(function (e) {
    e.preventDefault();
    form_data = $(this).serialize();
    $.ajax({
      type: 'POST',
      url: form.attr('action'),
      data: form_data
    }).done(done_func).fail(fail_func);
  });
})(jQuery);