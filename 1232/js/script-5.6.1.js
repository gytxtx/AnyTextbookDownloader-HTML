function init_color_scheme(auto){
	// 鐩戝惉棰滆壊妯″紡鍙樺寲
	if(auto && window.matchMedia){
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detect_color_scheme);
	}

	detect_color_scheme();
}

function detect_color_scheme(auto=false){
	// 妫€鏌� localStorage 涓槸鍚﹀瓨鍦ㄧ敤鎴疯缃殑鏆楅粦妯″紡
	const mode = localStorage.getItem('dark_mode');

	// 濡傛灉涓嶅瓨鍦ㄧ敤鎴疯缃殑鏆楅粦妯″紡锛屼娇鐢ㄨ澶囩殑棰滆壊妯″紡璁剧疆
	if(mode === null && auto){
		const mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	if(mode !== null){
		if(mode === 'true'){
			document.body.classList.add('dark-mode');
		}else{
			document.body.classList.remove('dark-mode');
		}
	}
}

function toggle_color_scheme() {
	const mode = localStorage.getItem('dark_mode');

	localStorage.setItem('dark_mode', (mode === 'true' ? 'false' : 'true'));

	detect_color_scheme();
}

jQuery(function($){

	//渚ф爮璺熼殢
	var marginTop = 30;

	if ($('body').hasClass('navbar-sticky_transparent') || $('body').hasClass('navbar-sticky')) {
		marginTop += 69;
	}

	if ($('#wpadminbar').length) {
		marginTop += 32;
	}
	$('.site-content > .row > .col-lg-3').theiaStickySidebar({
		additionalMarginTop: marginTop,
		additionalMarginBottom: 30,
	});
	//渚ф爮璺熼殢 缁撴潫

	$('.main-menu .nav-list').slicknav({
		label: '',
		appendTo: '.off-canvas'
	});

	$('.site-content .widget-area').clone().appendTo('.off-canvas');

	$('.hamburger').on('click  touchstart', function(){
		$('body').addClass('canvas-open');
	});

	$('.off-canvas').on('click touchstart', '.close', function() {
		$('body').removeClass('canvas-open');
	});

	// $(document).keyup(function(e){
	// 	if(27 == e.keyCode && $('body').hasClass('canvas-open')){
	// 		$('body').removeClass('canvas-open');
	// 	}
	// });

	// $(document).mouseup(function(e){
	// 	if($('.off-canvas').is(e.target) 
	// 		|| $('.off-canvas').has(e.target).length !== 0
	// 		|| $('.hamburger').is(e.target) 
	// 		|| $('.hamburger').has(e.target).length !== 0
	// 		|| !$('body').hasClass('canvas-open')
	// 	){
	// 		$('body').removeClass('canvas-open');
	// 	}
	// });

	//杩斿洖椤堕儴
	$(window).on('scroll', function () {
		if ($(this).scrollTop() > 200) {
			$('.gotop').fadeIn();
		} else {
			$('.gotop').fadeOut();
		}
	});
	$('.gotop').on('click', function () {
		$("html, body").animate({
			scrollTop: 0
		}, 1000);
		return false;
	});

	// 鏆楅粦妯″紡鍒囨崲
	$('.dark-switch').on('click', toggle_color_scheme);

	//绉诲姩绔粴鍔ㄧ┛閫忥紝铏界劧杩欒繖骞舵病鏈夌敤...
	$('.canvas-open').on('touchmove',function(){
銆€銆€銆€銆€event.preventDefault();
	});

	//鎵嬫満绔簳閮ㄨ彍鍗� 閫変腑鏃跺€欓珮浜樉绀�
	var urlstr = location.href;
	//alert(urlstr);
	var urlstatus=false;
	$(".mobile_btn li a").each(function () {
	if ((urlstr + '/').indexOf($(this).attr('href')) > -1&&$(this).attr('href')!='') {
			$(this).addClass('active');
			urlstatus = true;
	} else {
			$(this).removeClass('active');
	}
	});
	if (!urlstatus) {$(".mobile_btn li a").eq(0).addClass('active');}


	$('body').on('click', '.load-posts', function(e){
		e.preventDefault();

		let button	= $(this);

		button.addClass('loading');
		button.find('span').html('鍔犺浇涓�...');

		$(this).wpjam_action(function(data){
			if(data.errcode != 0){
				alert(data.errmsg);
			}else{
				if(data.posts){
					button.parent().before(data.posts);
				}

				if(data.next_paged){
					button.removeClass('loading');
					button.find('span').html('鍔犺浇鏇村');
					button.data('data', data.data);
				}else{
					button.parent().remove();
				}
			}
		});
	});

	if($('body').hasClass('infinite-scroll')){
		$(window).scroll(function(){
			if($(document).scrollTop() > ($(document).height() - 1200)){
				let button	= $('.load-posts');

				if(button.length && !button.hasClass('loading')){
					button.click();
				}
			}
		});
	}

	//鎶曠ǹ
	$(document).on('click', '.publish_post', function(event) {
	    event.preventDefault();
	    var title = $.trim($('#post_title').val());
	    var status = $(this).data('status');
	    $('#post_status').val(status);
	    var editor = tinymce.get('editor'); 
	    var content = editor.getContent();
	    $('#editor').val(content);

	    if( !content ){
	        alert('璇峰～鍐欐枃绔犲唴瀹癸紒');
	        return false;
	    }

	    if( title == 0 ){
	        alert('璇疯緭鍏ユ枃绔犳爣棰橈紒');
	        return false;
	    }

	    $.ajax({
	        url: ajaxurl,
	        type: 'POST',
	        dataType: 'json',
	        data: $('#post_form').serializeArray(),
	    }).done(function( data ) {
	        if( data.state == 200 ){
	            alert(data.tips);
	            window.location.href = data.url;
	        }else{
	            alert(data.tips);
	        }
	    }).fail(function() {
	        alert('鍑虹幇寮傚父锛岃绋嶅€欏啀璇曪紒');
	    });
	    
	});

	$(document).on('click', '.select-img', function(event) {
		event.preventDefault();
		
		var upload_img;  
	    if( upload_img ){   
	        upload_img.open();   
	        return;   
	    }   
	    upload_img = wp.media({   
	        title: '閫夋嫨鍥剧墖',   
	        button: {   
	        text: '娣诲姞涓哄皝闈㈠浘',   
	    },   
	        multiple: false   
	    });   
	    upload_img.on('select',function(){   
	        thumbnail_img = upload_img.state().get('selection').first().toJSON(); 
	        if( thumbnail_img.subtype == 'png' || thumbnail_img.subtype == 'jpeg' || thumbnail_img.subtype == 'gif' ){
	            $('img.thumbnail').attr('src', thumbnail_img.url ).show();
	            $('input.thumbnail').val(thumbnail_img.id);
	        }else{
	            alert('璇烽€夋嫨鍥剧墖锛�'); 
	        }  
	    });   
	    upload_img.open(); 
	});


	//textarea 鍓嶇鍙戝竷甯栧瓙 鏍规嵁鍐呭鑷姩澧炲姞楂樺害
	$('.topic_content').on('input', function(){
		this.style.height = 'auto';
		this.style.height = this.scrollHeight + "px";
	});
});


/* copy from wpjam-basic/static/ajax.js */
jQuery(function($){
	if(window.location.protocol == 'https:'){
		ajaxurl	= ajaxurl.replace('http://', 'https://');
	}

	$.fn.extend({
		wpjam_submit: function(callback){
			let _this	= $(this);

			$.post(ajaxurl, {
				action:			$(this).data('action'),
				_ajax_nonce:	$(this).data('nonce'),
				data:			$(this).serialize()
			},function(data, status){
				callback.call(_this, data);
			});
		},
		wpjam_action: function(callback){
			let _this	= $(this);

			$.post(ajaxurl, {
				action:			$(this).data('action'),
				_ajax_nonce:	$(this).data('nonce'),
				data:			$(this).data('data')
			},function(data, status){
				callback.call(_this, data);
			});
		}
	});
});
/* end of copy from wpjam-basic/static/ajax.js */

/* copy from wpjam-toc.php */
jQuery(document).ready(function(){
  jQuery('#toc span').on('click',function(){
      if(jQuery('#toc span').html() == '[鏄剧ず]'){
          jQuery('#toc span').html('[闅愯棌]');
      }else{
          jQuery('#toc span').html('[鏄剧ず]');
      }
      jQuery('#toc ul').toggle();
      jQuery('#toc small').toggle();
  });
});
/* end of copy from wpjam-toc.php */


/* copy from wpjam-comment/static/ajax-action.js */
jQuery(function($){
	$('body').on('click', '.post-action', function(e){
		e.preventDefault();

		$(this).wpjam_action(function(data){
			if(data.errcode != 0){
				alert(data.errmsg);
			}else{
				$(this).removeClass().addClass(data.class).data('data', data.data);
				$(this).find('i').removeClass().addClass(data.icon);
				$(this).find('span.post-action-count').html(data.count);

				$('body').trigger('wpjam_post_action_success', data);
			}
		});
	});

	$('body').on('click', '.comment-digg', function(e){
		e.preventDefault();

		$(this).wpjam_action(function(data){
			if(data.errcode != 0){
				alert(data.errmsg);
			}else{
				$(this).removeClass().addClass(data.class).data('data', data.data);
				$(this).find('.comment-digg-count').html(data.count);
				$(this).find('i').removeClass().addClass(data.icon);
			}
		});
	});
});
/* end of copy from wpjam-comment/static/ajax-action.js */

/* copy from wpjam-owl-carousel.php */
jQuery(function($){
	$('.owl-carousel').not('.owl-loaded').each(function(){
		$(this).owlCarousel($(this).data('options'));
	});
});
/* end of copy from wpjam-owl-carousel.php */

/* copy from clipboard.js */
jQuery(function($){
	let clipboard = new ClipboardJS('body .clipboard-btn', {
		target: function(trigger){
			if(trigger.hasAttribute('data-clipboard-text')){
				let temp_element = document.createElement('span');
				temp_element.textContent = trigger.getAttribute('data-clipboard-text');

				return temp_element;
			}else if(trigger.hasAttribute('data-clipboard-target')){
				return document.querySelector(trigger.getAttribute('data-clipboard-target'));
			}else{
				return trigger.nextElementSibling;
			}
		}
	});

	clipboard.on('success', function(e){
		$(e.trigger).find('i').removeClass('ri-file-copy-fill').addClass('ri-check-fill');

		e.clearSelection();
	});

	clipboard.on('error', function(e) {
		console.error('Action:', e.action);
		console.error('Trigger:', e.trigger);
	});
});
/* end of copy from clipboard.js */


/* copy from modal.js */
jQuery(function($){
	$.extend({
		wpjam_show_modal: function(target){
			if(target && $(target).length){
				window.location.hash	= 'modal'+target;

				$('.modal-overlay').removeClass('hidden');
				$(target).addClass('modal-wrap').removeClass('hidden');
				$('.modal-close').removeClass('hidden').prependTo($('.modal-wrap'));

				$('body '+target).trigger('modal_popuped');
			}
		}
	});

	$('body').on('click touchstart', '.weixin-share-button', function(e){
		$('.share-box-qrcode').toggleClass('hidden');
	});

	$('body').on('modal_popuped', '.search-box', function(e){
		let terms	= localStorage.getItem('search_terms');

		if(terms){
			terms	= JSON.parse(terms);

			let search_history	= $('body .search-box .search-history');
			let home_url		= $('body .search-box form').prop('action');

			search_history.removeClass('hidden').html('鎼滅储鍘嗗彶锛�');

			terms.forEach(function(term){
				$('<a href="'+home_url+'?s='+term+'">'+term+'</a>').appendTo(search_history);
			});
		}
	});

	$('body').on('modal_popuped', '.poster-box', function(e) {
    if ($('.poster-box > img').length) {
        return;
    }

    // 璁剧疆1绉掕秴鏃�
    //setTimeout(function() {
        console.time('canvas');

        $('.poster-content').removeClass('hidden');

        html2canvas($('body .poster-content')[0], {
            proxy: $('.modal-wrap').data('proxy'),
            ignoreElements: (el) => el.tagName === 'IFRAME' // 蹇界暐 iframe
        }).then(canvas => {
            $('.poster-content').addClass('hidden');

            // 灏� canvas 杞崲涓� Blob 瀵硅薄
            canvas.toBlob(blob => {
                var url = URL.createObjectURL(blob);

                // 鍒涘缓 img 鏍囩
                var img = new Image();
                img.src = url;
                img.alt = 'Poster Image';

                // 娣诲姞鍒� .poster-box 涓�
                $('.poster-box').append(img);

                // 鍒涘缓涓嬭浇閾炬帴
                $('.poster-box a').attr('href', url);

                console.timeEnd('canvas');
            }, 'image/png');
        });
    //}, 1000); // 1绉掑悗鎵ц鎴浘
});


	$('body').on('click touchstart', '.show-modal', function(e){
		e.preventDefault();

		$.wpjam_show_modal($(this).data('target'));
	});

	$('body').on('click touchstart', '.modal-close', function(){
		let href	= window.location.href;
		let index	= href.indexOf('#');

		if(index != -1){
			window.history.pushState({}, '', href.substring(0, index));
		}

		$('.modal-overlay').addClass('hidden');
		$('.modal-close').addClass('hidden').insertAfter($('.modal-overlay'));
		$('.modal-wrap').addClass('hidden').removeClass('modal-wrap');
	});

	$('body').on('submit', '.search-box form', function(){
		let term 	= $('.search-input').val();
		let terms	= localStorage.getItem('search_terms');

		if(terms){
			terms	= JSON.parse(terms);
		}else{
			terms	= [];
		}

		terms.unshift(term);

		if(terms.length > 10){
			terms.pop();
		}

		localStorage.setItem('search_terms', JSON.stringify(terms));
	});

	$('body .qrcode').each(function(){
		let text	= $(this).data('text');
		let size	= $(this).data('size');

		if(text && $.trim($(this).html()) == ''){
			size	= size ? size : 200;

			new QRCode($(this)[0], {
				text		: text,
				width		: size,
				height	: size
			});
		}
	});

	let hash = window.location.hash;

	if(hash && hash.startsWith('#modal')){
		$.wpjam_show_modal(hash.substring('#modal'.length));
	}
});
//鎶樺彔鏀剁缉
jQuery(document).ready(
	function(jQuery){
	jQuery('.collapseButton').click(
	function(){
	jQuery(this).parent().parent().find('.xContent').slideToggle('slow');
	});
});
/* end of copy from modal.js */