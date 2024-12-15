(function ($, window, document, undefined) {
  var $win = $(window);
  var $doc = $(document);

  // DETECT A USER'S TOUCH EVENT =================
  window.USER_IS_TOUCHING = false;
  window.addEventListener(
    "touchstart",
    function onFirstTouch() {
      window.USER_IS_TOUCHING = true;
      document.body.classList.add("touch");
      window.removeEventListener("touchstart", onFirstTouch, false);
    },
    false
  );

  // DOC. READY ==============================
  $doc.ready(function () {
    var bh = $win.height(),
      bw = $win.width(),
      br = bh / bw,
      body = $("body"),
      domMain = $("main"),
      dpr = window.devicePixelRatio,
      st =
        window.pageYOffset ||
        document.body.scrollTop ||
        document.documentElement.scrollTop,
      lastScrollTop =
        window.pageYOffset ||
        document.body.scrollTop ||
        document.documentElement.scrollTop,
      homeHero = $("#hero"),
      hero = $("#hero .content-holder"),
      heroVid = $("#hero .video"),
      heroLogo = $(".large-logo #hero .logo-holder"),
      slickSlideshow = $(".slickslideshow"),
      $slideshow = slickSlideshow,
      $slide = $(".cell", slickSlideshow),
      gridVid = $(".hover-video"),
      isoGrid = $(".filtergrid"),
      isoImages = isoGrid.find(".photo"),
      // filter = $('#filter'),
      filter = $('#home-nav-holder [data-filter-button="true"]'),
      playBtn = $(".play-icon"),
      projectCells = $(".gridpage .cell"),
      cellNodes = document.querySelectorAll(".gridpage .cell"),
      logoFixedTop,
      logoTopAmt,
      logoScaleAmt;

    // =================================================
    // =================================================
    // FUNCTIONS =======================================
    // =================================================
    // =================================================

    // INTRO LOGO ANIMATION ====================
    if (body.hasClass("home")) {
      var path1 = document.getElementById("animate-1"),
        path2 = document.getElementById("animate-2"),
        path3 = document.getElementById("animate-3"),
        path4 = document.getElementById("animate-4"),
        path5 = document.getElementById("animate-5"),
        path6 = document.getElementById("animate-6"),
        dashes = document.getElementById("dashed-line"),
        scrollCta = document.getElementById("scroll-cta"),
        introTl = new TimelineMax({ onComplete: doneAnim }),
        scrollHintTl = new TimelineMax({ paused: true });

      introTl
        .to(path1, 0.8, { "stroke-dashoffset": 0 })
        .to(path2, 1.5, { "stroke-dashoffset": 0 })
        .to(path3, 0.15, { "stroke-dashoffset": 0 }, "-=0.3")
        .to(path4, 1.2, { "stroke-dashoffset": 0 }, "-=0.3")
        .to(path5, 1, { "stroke-dashoffset": 0 })
        .to(path6, 0.15, { "stroke-dashoffset": 0 }, "-=0.3");

      introTl.pause();

      scrollHintTl
        .to(dashes, 0.6, {
          "clip-path": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: Power2.easeInOut,
        })
        .to(scrollCta, 0.4, { opacity: 1 });

      function enterLogo() {
        /** "done" class triggers static logo swap
         * as well as "cinematographer" fade-on
         */
        //

        /* triggers dashed line anim */
        //scrollHintTl.play();

        setTimeout(function () {
          scrollHintTl.play();
          //homeHero.addClass('done');
        }, 1000);
      }

      function doneAnim() {
        console.log("done");
        homeHero.addClass("done");
      }

      enterLogo();
    }

    function getLogoTransforms(logo) {
      var top_start = logo.position().top,
        //top_end = 10,
        //topDiff = top_start - top_end,
        scale_start = 1,
        scale_end = 0.5,
        scaleDiff = scale_start - scale_end;

      return {
        topAmt: top_start,
        scaleAmt: scaleDiff,
      };
    }

    // IMAGE LOADING ===========================
    function loadImage(image, pixelRatio, selfContained) {
      var devicePixelRatio = !pixelRatio ? dpr : pixelRatio,
        img = image.data("src"),
        newW =
          image.hasClass("bg-loadme") || selfContained === true
            ? image.width() * devicePixelRatio
            : image.parent().width() * devicePixelRatio,
        imgpath = "";

      if (!image.hasClass("gif")) {
        if (newW <= 500) {
          imgpath = "/images/pics/500/" + img;
        } else if (newW > 500 && newW <= 750) {
          imgpath = "/images/pics/750/" + img;
        } else if (newW > 750 && newW <= 1000) {
          imgpath = "/images/pics/1000/" + img;
        } else if (newW > 1000 && newW <= 1536) {
          imgpath = "/images/pics/1536/" + img;
        } else if (newW > 1536 && newW <= 1920) {
          imgpath = "/images/pics/1920/" + img;
        } else {
          imgpath = "/images/pics/" + img;
        }
      } else {
        imgpath = "/images/pics/" + img;
      }

      if (image.hasClass("bg-loadme")) {
        $("<img/>")
          .attr("src", imgpath)
          .on("load", function () {
            $(this).remove();
            image
              .css("background-image", "url(" + imgpath + ")")
              .addClass("loaded");
          });
      } else {
        image
          .on("load", function () {
            image.addClass("loaded");
          })
          .attr("src", imgpath);
      }
    }

    // PROCESS VIDEOS ==========================
    function processVid(element, autoplay) {
      var el = element,
        type = el.data("type"),
        code = el.data("video"),
        id = el.data("id"),
        inject = el.find(".inner"),
        embeddedVid = el.find("iframe"),
        uploadedVid = el.find("video"),
        vidExists =
          type === "file" ? uploadedVid.length > 0 : embeddedVid.length > 0,
        uploadedVideoDOM = undefined,
        theSrc,
        hasQ,
        vid;

      if (type === "embed") {
        if (!vidExists) {
          inject.prepend(code);
        }

        //assign vid, now that code has been injected.
        vid = el.find("iframe");

        resizeFrame(vid);

        if (autoplay === "yes") {
          theSrc = vid.attr("src");
          hasQ = theSrc.indexOf("?");
          if (hasQ >= 0) {
            vid.attr("src", theSrc + "&autoplay=1");
          } else {
            vid.attr("src", theSrc + "?autoplay=1");
          }
        }
      } else {
        if (!vidExists) {
          inject.prepend(code);

          //assign uploadedDOM, now that code has been injected.
          uploadedVideoDOM = document.getElementById("video" + id);
          resizeVid(el);
          if (autoplay === "yes") {
            uploadedVideoDOM.play();
          }
        } else {
          //assign uploadedDOM.
          uploadedVideoDOM = document.getElementById("video" + id);
          if (autoplay === "yes") {
            uploadedVideoDOM.play();
          }
        }
      }
    }

    // RESIZE VIDEOS ===========================
    // Note: this is called within processVid(), but can (and should) also be called if the browser resizes.
    // Element param can be any parent node; usually "$('.cell')" for our purposes.
    function resizeVid(element) {
      var vidType = element.data("type"),
        vid =
          vidType === "file" ? element.find("video") : element.find("iframe"),
        insertionPoint = element.find(".vidHolder"),
        parentWidth = Math.floor(insertionPoint.width()),
        parentHeight = Math.floor(insertionPoint.height()),
        parentRatio = parentHeight / parentWidth,
        ow = element.attr("width"),
        oh = element.attr("height"),
        r = oh / ow;

      if (r >= parentRatio) {
        var newWidth = parentWidth,
          newHeight = Math.floor(newWidth * r);
      } else {
        var newWidth = Math.floor(parentHeight / r),
          newHeight = parentHeight;
      }
      vid.height(newHeight).width(newWidth);
    }

    // RESIZE IMAGES ===========================
    // Function for determining max-width or max-height of a photo based on aspect ratio, relative to parent's aspect ratio. Fill the space w/o it being a background image.
    function resizeImage(parent) {
      var photo = parent.find(".photo"),
        parentWidth = Math.floor(parent.width()),
        parentHeight = Math.floor(parent.height()),
        parentRatio = parentHeight / parentWidth,
        photoRatio = photo.data("aspect-ratio");

      if (photoRatio >= parentRatio) {
        photo.addClass("size-width").removeClass("size-height");
      } else {
        photo.addClass("size-height").removeClass("size-width");
      }
    }

    function resizeFrame(element) {
      var ow = element.attr("width"),
        oh = element.attr("height"),
        r = oh / ow;

      if (bw > 900) {
        if (r < 0.5625) {
          var newWidth = element.parent().width();
          var newHeight = newWidth * r;
        } else {
          newHeight = element.parent().height();
          var newWidth = newHeight / r;
        }
      } else {
        var newWidth = element.parent().width();
        var newHeight = newWidth * r;
      }

      element.width(newWidth).height(newHeight);
    }

    function resizeTextFrame(element) {
      var ow = element.attr("width"),
        oh = element.attr("height"),
        r = oh / ow;

      var newWidth = element.width();
      var newHeight = newWidth * r;

      element.height(newHeight);
    }

    // RATIO SIZING ============================
    function ratioSize(el) {
      el.each(function () {
        var r = $(this).data("ratio"),
          w = $(this).width(),
          h = Math.floor(w * r);
        $(this).height(h);
      });
    }
    function setRatios(el) {
      // if we need all items to be equal, whole-number heights:
      var $master = el.first(),
        r = $master.data("ratio"),
        w = $master.width(),
        h = Math.floor(w * r);
      el.height(h);
    }

    // VIDEO ROLLOVERS =========================
    function loadVideoLoop(element) {
      var holder = element.find(".vidHolder"),
        vidStr = element.data("video"),
        vidId = element.data("id"),
        hasVid = holder.find("video").length > 0;

      if (hasVid) {
        var vid = document.getElementById("video" + vidId);
        vid.play();

        /*
				if (!homeHero.hasClass('done')) {
					// PLAY INTRO TIMELINE
					vid.oncanplaythrough = function() {
						introTl.play();
					};
				}
				*/
      } else {
        holder.html(vidStr);
        setTimeout(function () {
          var vid = document.getElementById("video" + vidId);
          vid.play();
        }, 0);
      }

      element.addClass("playing");
    }

    function unloadVideoLoop(element) {
      var holder = element.find(".vidHolder"),
        vidId = element.data("id"),
        hasVid = holder.find("video").length > 0;

      if (hasVid) {
        var vid = document.getElementById("video" + vidId);
        setTimeout(function () {
          vid.pause();
        }, 300);
      }
      element.removeClass("playing");
    }

    // HOMEPAGE SPOTLIGHT EFFECT ===============
    var spotWrap = document.querySelectorAll(".cell.spotlight");

    // cross-browser prefixing for CSS strings:
    var transformProp = (function () {
      var testEl = document.createElement("div");
      if (testEl.style.transform == null) {
        var vendors = ["Webkit", "Moz", "ms"];
        for (var vendor in vendors) {
          if (testEl.style[vendors[vendor] + "Transform"] !== undefined) {
            return vendors[vendor] + "Transform";
          }
        }
      }
      return "transform";
    })();

    function setStyles(element, styleString, prefix) {
      element.style[prefix] = styleString;
    }

    // convert window's mouse coordinates to element's mouse coordinates:
    function normalizeCoords(element, x, y) {
      var boundingBox = element.getBoundingClientRect();
      return {
        x: x - boundingBox.left,
        y: y - boundingBox.top,
      };
    }

    // FLUID LAYOUT ============================
    function fluid() {
      bh = $win.height();
      bw = $win.width();
      br = bh / bw;
      st = document.body.scrollTop || document.documentElement.scrollTop;

      if (body.hasClass("home")) {
        logoTopAmt = getLogoTransforms(heroLogo).topAmt;
        logoScaleAmt = getLogoTransforms(heroLogo).scaleAmt;
        logoFixedTop = logoTopAmt + bw * 0.0125;
      }

      $(".bheight").css("height", bh);

      // Set min height of <main>, if sticky footer:
      if (body.hasClass("sticky-footer")) {
        domMain.css("min-height", bh);
      }

      $(".resize-image").each(function () {
        var $this = $(this);
        resizeImage($this);
      });

      $(".text-holder iframe").each(function () {
        resizeTextFrame($(this));
      });
    }

    // =================================================
    // =================================================
    // INITIALIZATION ==================================
    // =================================================
    // =================================================

    if (body.hasClass("home")) {
      if (st <= logoFixedTop) {
        body.removeClass("fix large-logo");
      }
      if (st > 20) {
        body.addClass("remove-hint");
      }
    }

    fluid();

    if ($(".social").length) {
      getSocial();
    }

    // SLICK CAROUSEL ==========================

    // Slick carousel events
    if ($slideshow.length) {
      $slideshow.on("init", function (slick) {
        // hide dots if only one slide
        if ($(".slick-slide").length === 1) {
          $(".slick-dots").hide();
        }
      });

      // Before slide changes -------------
      $slideshow.on("beforeChange", function (
        event,
        slick,
        currentSlide,
        nextSlide
      ) {
        // update slide counter and hash
        /*
				var slideCount = nextSlide+1;
				window.location.hash = slideCount;
				*/

        var $curr = $(slick.$slides.get(currentSlide)),
          $next = $(slick.$slides.get(nextSlide)),
          $prev = $curr.prev(".slick-slide"),
          nextVid = $next.data("video"),
          hasVid =
            $next.find("video").length ||
            $next.find("iframe").length ||
            $next.find("embed").length,
          vidType = $next.data("type"),
          id = $next.data("id"),
          currImg = $(".photo", $next),
          nextImg = $(".photo", $next.next(".slick-slide")),
          prevImg = $(".photo", $next.prev(".slick-slide"));

        // if the next slide is a video slide:
        if (nextVid != null) {
          // Check whether there is a video here yet:
          if (hasVid) {
            if (vidType === "file") {
              //document.getElementById('video'+id).play();
            } else {
              // If you want to control playback w/ Vimeo API, put code here.
              // Otherwise, we will leave embeds on slide change.
            }
          } else {
            processVid($next, "no");
          }
        }

        loadImage(currImg);
        loadImage(nextImg);
        loadImage(prevImg);
      });

      // After slide changes -------------
      // We will compare prevSlideIndex with "currentSlide" param to determine direction of slide movement, and be able to target only the slides we need to when it comes to loading images and videos (rather than looping through every single slide each time):
      var prevSlideIndex = 0;

      $slideshow.on("afterChange", function (event, slick, currentSlide) {
        var $incomingSlide = $(
            '.cell[data-slick-index="' + currentSlide + '"]'
          ),
          // figure out direction of slide movement, based on slide index:
          $prevSlide =
            currentSlide > prevSlideIndex
              ? $incomingSlide.prev(".slick-slide")
              : $incomingSlide.next(".slick-slide"),
          prevSlideId = $prevSlide.data("id"),
          prevSlideIsVid = $prevSlide.hasClass("video"),
          prevSlideVidType = prevSlideIsVid ? $prevSlide.data("type") : null,
          prevSlideVid =
            prevSlideVidType === "file"
              ? $prevSlide.find("video")
              : $prevSlide.find("iframe"),
          prevSlideVidExists = prevSlideVid.length > 0;

        // check if prev slide is a video slide,
        // and if so, check if the video is in the DOM:
        if (prevSlideIsVid && prevSlideVidExists) {
          if (prevSlideVidType === "file") {
            document.getElementById("video" + prevSlideId).pause();
            // or prevSlideVid.get(0).play(); if you need to use jQuery.
          } else {
            prevSlideVid.remove();
            // or if you're using the Vimeo API, pause iframe video instead of removing it!!
          }
        }

        //update prevSlideIndex value
        prevSlideIndex = currentSlide;
      });

      $slideshow.slick({
        slide: "figure",
        centerMode: true,
        centerPadding: 0,
        slidesToShow: 1,
        arrows: true,
        dots: true,
        infinite: false,
        speed: 500,
      });

      // slick advance
      if (window.location.hash) {
        var h = window.location.hash;
        var ch = h.replace("#", "");

        if (ch - 1 == 0) {
          var firstPic = $(".slickslideshow .cell").first().find(".photo");
          loadImage(firstPic);
        }

        setTimeout(function () {
          $(".slickslideshow").slick("slickGoTo", ch - 1, true);
        }, 200);
      } else {
        setTimeout(function () {
          $(".slickslideshow").slick("slickGoTo", 0, true);
        }, 200);
      }

      // Scroll functionality
      /*
			function next() {
				$('.next').click();
			}
			function prev() {
				$('.prev').click();
			}
			if ($slideshow.length) {
				$slideshow.scrollsteps({
					up: prev,
					down: next,
					left: prev,
					right: next,
					quietPeriodBetweenTwoScrollEvents: 200
				});
			}
			*/
    }

    // Lightbox pop-ups for GRID modules =======
    // =========================================
    var modGridLink = $("a.mod-link");

    modGridLink.click(function (e) {
      e.preventDefault();
      projectLightbox($(this));
    });

    $("#content").on("click", ".slideshow .closer", closeLightbox);

    function projectLightbox(el) {
      var $this = el,
        $topLevelParent = $this.closest(".module");

      body.addClass("grid-lightbox");

      var id = $topLevelParent.data("id");
      var imgId = $this.data("img-id");
      var $lbox = $(".slideshow#gallery" + id);

      if (!$lbox.hasClass("slick-slider")) {
        // if slickJS has not been initialized on this gallery yet:

        $lbox.slick({
          slide: "figure",
          centerPadding: 0,
          slidesToShow: 1,
          infinite: false,
          prevArrow: ".prev",
          nextArrow: ".next",
          dots: false,
        });
      }

      $lbox.addClass("on");
      $lbox.slick("slickGoTo", imgId);
      $lbox.find(".slick-list").attr("tabindex", 0).focus();

      // if we land on a video, try to autoplay
      var activeSlide = $lbox.find(".slick-current");
      activeSlide.addClass("hello");
      if (activeSlide.find("iframe").length) {
        var iframe = activeSlide.find("iframe");
        resizeFrame(iframe);
        var player = new Vimeo.Player(iframe);

        var promise = player.play();

        if (promise !== undefined) {
          promise
            .catch((error) => {
              // Auto-play was prevented
              // Show a UI element to let the user manually start playback
              console.log(error);
            })
            .then(() => {
              // Auto-play started
              console.log("playing");
            });
        }
      }

      console.log(id, imgId);
    }

    function closeLightbox() {
      var closeId = $(this).data("close"),
        $lbox = $(".slideshow#" + closeId);

      body.removeClass("grid-lightbox");

      $lbox.removeClass("on");
      $("header").removeClass("hide");

      $(".slickslideshow iframe").each(function () {
        var iframe = $(this);
        var player = new Vimeo.Player(iframe);

        player.pause();
      });

      // $lbox.unbind('mousewheel');
    }

    // ISOTOPE FILTER GRID =====================
    if (isoGrid.length) {
      var filterHash = window.location.hash;
      filterValue = filterHash !== "" ? filterHash.replace("#", ".") : "*";

      isoGrid.imagesLoaded(function () {
        isoGrid.isotope({
          itemSelector: ".cell",
          filter: filterValue,
          percentPosition: true,
          masonry: {
            columnWidth: ".grid-sizer",
          },
        });
      });
    }

    // =================================================
    // =================================================
    // EVENTS ==========================================
    // =================================================
    // =================================================

    // INTRO ANIMATION =========================
    $win.load(function () {
      if (body.hasClass("home")) {
        setTimeout(function () {
          introTl.play();
        }, 100);
      }
    });

    // INVIEW PHOTO LOADING ====================
    $("img.loadmeview, .loadbgview").on("inview", function (event, isInView) {
      if (isInView) {
        loadImage($(this));
      }
    });

    // INVIEW HERO LOADING =====================
    /*
		if (hero.length) {

			hero.on('inview', function(event, isInView) {
				var $this = $(this),
					isVideo = $this.hasClass('video'),
					photo = $this.find('.photo');

				if (isInView) {
					loadImage(photo);
					if (isVideo) {
						loadVideoLoop($this);
						resizeVid($this);
					}
				} else {
					if (isVideo) {
						unloadVideoLoop($this);
					}
				}
			});

		}
		*/

    // VIDEO PLAY BUTTON CLICK =================
    $("#content").on("click", ".video .play", function () {
      var $video = $(this).closest(".cell");
      processVid($video, "yes");
      $video.addClass("playing");
    });

    // play button click
    playBtn.click(function (e) {
      // check if parent is mod-single, if so video is handled in lightbox
      if ($(this).closest(".module").hasClass("mod-single")) {
        return false;
      }

      var $video = $(this).parent();

      processVid($video, "yes");
      $video.addClass("playing");
    });

    // HOMEPAGE CELL ROLLOVERS =========================
    function hideCells(element) {
      projectCells.not(element).removeClass("shown");
    }

    function restoreCells(element) {
      projectCells.addClass("shown");
    }

    // HOMEPAGE "HOVER INTENT" =================
    /*
		var hoverDelay = 0,
			setTimeoutConst;

		function homeHoverIN (e) {  
			var $this = $(this);
			setTimeoutConst = setTimeout(function() {
				hideCells($this);
			}, hoverDelay);
		}

		function homeHoverOUT (e) {
			var $this = $(this);
			restoreCells($this);
			clearTimeout(setTimeoutConst);
		}

		if (body.hasClass('home')) {
			projectCells.hover(homeHoverIN, homeHoverOUT);
		}
		*/

    // QUICK VIEW VIDEO BEHAVIOR =========================
    $("#content").on("click", ".quick-view", function (e) {
      var $this = $(this).closest(".cell"),
        $notThis = $(".cell").not($this);

      e.preventDefault();

      if ($this.hasClass("playing")) {
        unloadVideoLoop($this);
        $notThis.removeClass("dim");
        body.removeClass("video-preview");
      } else {
        loadVideoLoop($this);
        resizeVid($this);
        $notThis.addClass("dim");
        body.addClass("video-preview");
      }
    });

    $("#content").on("mouseleave", ".gridpage .cell", function (e) {
      var $this = $(this),
        $notThis = $(".cell").not($this);
      if ($this.hasClass("playing")) {
        unloadVideoLoop($this);
        $notThis.removeClass("dim");
        body.removeClass("video-preview");
      }
    });

    // HOMEPAGE GRID HOVER EFFECTS =============
    function toggleActive(e) {
      if (USER_IS_TOUCHING) {
        var className = "active";

        if ($(this).hasClass(className)) {
          return;
        } else {
          e.preventDefault();
          projectCells.removeClass(className);
          $(this).addClass(className);
        }
      }
    }

    // Touch device behavior ("active" class)
    projectCells.click(function (e) {
      toggleActive.call($(this), e);
    });

    // No-touch device behavior (spotlight effect)
    spotWrap.forEach(function (item) {
      var wrapper = item;
      var circle = wrapper.querySelector(".circle");

      item.onmousemove = function (e) {
        if (!USER_IS_TOUCHING) {
          var x = e.clientX,
            y = e.clientY,
            loc = normalizeCoords(wrapper, x, y),
            styles = "translate(" + loc.x + "px," + loc.y + "px)";

          setStyles(circle, styles, transformProp);
        }
      };
    });

    // OVERLAYS & MENU TOGGLE ==================
    $(".menuBtn").click(function () {
      body.toggleClass("menuOn");
    });

    $slideshow.on("init", function () {
      //add focus to slideshow so arrows, scroll, etc. work:
      $(".slick-list").attr("tabindex", 0).focus();
    });

    // ISOTOPE GRID FILTERING ==================
    filter.on("click", function (e) {
      if (isoGrid.length) {
        var filterValue = $(this).attr("data-filter"),
          viewAll = filterValue.indexOf("*") === 0 ? true : false;

        e.preventDefault();

        // if mobile layout, close menu + scroll user "to":
        if (bw < 900) {
          body.toggleClass("menuOn");
          TweenMax.to(
            window,
            0.4,
            { scrollTo: "#grid-anchor" },
            Power2.EaseInOut
          );
        }

        filter.removeClass("pageOn");
        $(this).addClass("pageOn");

        var filt = viewAll ? "*" : "." + filterValue;

        isoGrid.isotope({ filter: filt });
      }
    });

    // RESIZE ==================================
    $win.resize(function () {
      fluid();
    });

    // "SMART" RESIZE (500ms delay) ============
    $win.smartresize(function () {
      if ($slideshow.length) {
        resizeVid($(".slick-current"));
      }

      /*
			if (heroVid.length) {
				resizeVid(heroVid);
			}
			*/
    });

    var logoHeight = heroLogo.height();

    // SCROLL ==================================
    window.addEventListener(
      "scroll",
      function () {
        st = window.pageYOffset || document.documentElement.scrollTop;

        if (body.hasClass("home")) {
          // Homepage: logo scroll effect
          if (st <= logoFixedTop) {
            var multiplier = (st / logoTopAmt) * 0.53,
              scaleAdjust = (1 - multiplier).toFixed(4),
              scaleValue = "translate(-50%, -50%) scale(" + scaleAdjust + ")";
          } else {
            var scaleValue = "translate(-50%, 0%) scale(0.4435)";
            body.addClass("fix").removeClass("large-logo");
          }

          heroLogo.css("transform", scaleValue);

          // Homepage: get scroll CTA outta there!
          if (st > 20) {
            body.addClass("remove-hint");
          }

          // Homepage: show "circle" nav items
          if (st >= 200) {
            body.addClass("show-nav");
          } else {
            body.removeClass("show-nav");
          }
        }

        lastScrollTop = st;
      },
      false
    );
  }); //end doc ready
})(jQuery, window, document);
