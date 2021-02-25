/**
首页js 零散js汇总;
*/

$(function(){ 	
	/**回到页面顶部*/
	$(".right_xf_d").click(function(){
	 $('body,html').animate({scrollTop:0},1000);
	}); 
	/**侧边栏开始**/
	$(".rlogin").mousemove(function(){ 
			$('.right').hide();
			$(".right_logink").toggle();
		}); 
		$(".login_xf_close").click(function(){ 
			$(".right_logink").toggle();
		}); 
		$(".ggao").mousemove(function(){ 
		$('.right').hide();
		$(".right_webnk").toggle();
		}); 
		$(".kefu").mousemove(function(){ 
		$('.right').hide();
		$(".right_xf_zxk").toggle();
		}); 
		$(".right_xfzx_span02").click(function(){ 
			$(".right_xf_zxk").toggle();
		});
		$(".right_webn_span02").click(function(){
			$(".right_webnk").toggle();
		});
		$(".xf_close").click(function(){
			$(".gift_xf").show();
			$(".foot_xf").hide();
		});
		$(".gift_xf").click(function(){
			$(".foot_xf").show();
			$(".gift_xf").hide();
		});
		$(".right_logink").mouseleave(function(){ 
			$('.right').hide();
		}); 
		$(".right_webnk").mouseleave(function(){ 
			$('.right').hide();
		}); 
		$(".right_xf_zxk").mouseleave(function(){ 
			$('.right').hide();
		}); 
		 $(".right_login_btn").click(function () {
				var u = $("#userName_r");
				var p = $("#userPwd_r");
				if ($.trim(u.val()) == '' || u.val() == '请输入会员名') {
					$("#userName_rDiv").show();
					$('#userName_rDiv').html("<font color='red'>请输入登录用户名！</font>");	
					u.focus();
					return false;
				}else{
					$("#userName_rDiv").hide();
				}
				if (p.val() == "") {
					$("#userPwd_rDiv").show();
					$('#userPwd_rDiv').html("<font color='red'>请输入登录密码！</font>");			
					p.focus();
					return false;
				}else{
					$("#userPwd_rDiv").hide();
				}
				$.get("/userLoginCL.php",{ userName:  $("#userName_r").val(), userPwd:  $("#userPwd_r").val(),autoLogin:'Y'},function(data){
					if(data=="登录成功"){
							alert('登陆成功！');
							window.top.location.href=location.href;
					}else{
						alert(data);			
					}
				});
		});
		/** 侧边栏结束**/
	//分类二级菜单展示
		$('.left_nav_li').mousemove(function(){
			$('.next_navbox').hide();
			$(this).find('.next_navbox').show();
		//$(this).find('h3').addClass('hover');
		});
		$('.left_nav_li').mouseleave(function(){
		$(this).find('.next_navbox').hide();
		});
		//tab 切换
		$(".cdiv div").mouseover(function(){
				$(this).addClass('on').siblings().removeClass('on');
				var index = $(this).index();
				$('.kaoshi .chan').hide();
				$('.kaoshi .chan:eq('+index+')').show();
		});
		//tab 切换
		$(".tkcon_tit h2").mouseover(function(){
				$(this).addClass('on1').siblings().removeClass('on1');
				var index = $(this).index();
				$('.ttkcon .tkcont').hide();
				$('.ttkcon .tkcont:eq('+index+')').show();
		});
		//tab 切换
		$(".gj").mouseover(function(){
				$(this).addClass('fl_nav_choose').siblings().removeClass('fl_nav_choose');
				var index = $(".gj").index($(this));
				$('.gao').hide();
				$('.gao:eq('+index+')').show();
		});
		//tab 切换
		$(".zhuzhi").mouseover(function(){
				$(this).addClass('fl_nav_choose').siblings().removeClass('fl_nav_choose');
				var index = $(".zhuzhi").index($(this));
				$('.zhu').hide();
				$('.zhu:eq('+index+')').show();
		});
		//tab 切换
		$(".zhiye").mouseover(function(){
				$(this).addClass('fl_nav_choose').siblings().removeClass('fl_nav_choose');
				var index = $(".zhiye").index($(this));
				$('.zhi').hide();
				$('.zhi:eq('+index+')').show();
		});
		
		function showAjaxUserLogin() {
			$("#BgDiv").css({ display: "block", height: $(document).height() });
			var yscroll = document.documentElement.scrollTop;
			$("#ajaxUserLoginDiv").css("display", "block");
			document.documentElement.scrollTop = 0;
			document.body.scrollTop=0;
		}

		function closeAjaxUserLogin() {
			$("#BgDiv").css("display", "none");
			$("#ajaxUserLoginDiv").css("display", "none");
		}
});