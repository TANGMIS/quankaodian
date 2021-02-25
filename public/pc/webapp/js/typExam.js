layui.use(['jquery', 'layer' ,'element','form'], function(){ 
    var $ = layui.$ //重点处
    ,layer = layui.layer
    ,element = layui.element
    ,form = layui.form;
    
    //滚动条高度
    $(window).resize(function(){
    	var _leftCd = $(".content-right").height() - $(".top-menu").outerHeight() - $(".kstk-caidan").outerHeight();
	    $(".kstk-left").height(parseInt(_leftCd));
	    $(".kstk-mulu").height(parseInt(_leftCd));
    })
	var _leftCd = $(".content-right").height() - $(".top-menu").outerHeight() - $(".kstk-caidan").outerHeight();
	console.log(_leftCd)
    $(".kstk-left").height(parseInt(_leftCd));
    $(".kstk-mulu").height(parseInt(_leftCd));
    
    
    //二级菜单交互
    $(".caidan-yiji").click(function(){
    	var _thisspan = $(this).parent().find("span");
    	var _thisul = $(this).parent().find("ul")
    	if(_thisul.hasClass("hide-ul")){
    		_thisul.removeClass("hide-ul");
    	}else{
    		_thisul.addClass("hide-ul");
    	}
    	if(_thisspan.hasClass("zhankai-arror")){
    		_thisspan.removeClass("zhankai-arror").addClass("bihe-arror");
    		
    	}else{
    		_thisspan.removeClass("bihe-arror").addClass("zhankai-arror");
    	}
    })
    $(".caidan-list li").click(function(){
    	$(".left-caidan").find("li").removeClass("this-cdshow");
    	$(this).addClass("this-cdshow");
    })

    

    //收藏
	$(document).on('click','.shocang-icon',function(){
		var _title = $(this).text();
		var _that = $(this);
		if(_title == "未收藏"){
			$(this).text("已收藏").removeClass('wsc').addClass('ysc');
			shouCang(_that,1);
		}else{
			$(this).text("未收藏").removeClass('ysc').addClass('wsc');
			shouCang(_that,0);
		}
	})
	//收藏行为
    function shouCang(_that,_scFlag){
    	var _queId = _that.attr('data-queId');
    	var _cateId = _that.attr('data-cateId');
    	var _url = _shouCang;
    	$.post(_url,{'queId':_queId,'zid':_cateId,'scFlag':_scFlag,'proType':0},function(resp){

    	},'json');
    }
	//添加笔记
	$(document).on('click','.biji-icon',function(){
		var _this = $(this);
        var _cateId = _this.attr('data-cateId');
        var _queId = _this.attr('data-queId'); 
        //var _url = _showNote;
       // $.post(_url,{'cateId':_cateId,'queId':_queId},function(resp){
        //    if(resp.status==0){
        //        $('.tjbi-content').html(resp.data);
        //    }
		//},'json'); 

		var htmlm='<textarea id="bjContent" rows="7" placeholder="请输入笔记内容！"></textarea>';
		htmlm=htmlm+'<button id="baocun" class="layui-btn layui-btn-fluid" data-queid="'+_queId+'" data-cateId="'+_cateId+'" style="background-color: rgb(0, 159, 168);">保存</button>';


		//console.log(htmlm);
		$('.tjbi-content').html(htmlm);
		$(".tjbj-chuangkou").fadeIn();
	})

	$(document).on('click','#baocun',function(){
		var _that = $(this);
		var _queId = _that.attr('data-queId');
		$('.biji-icon').each(function(){
			if($(this).attr('data-queId')==_queId){
				$(this).text("已有笔记").removeClass('wbj').addClass('ybj'); 
			}
		});
		saveNote(_that);
	})

	function saveNote(_that){
    	var _queId = _that.attr('data-queId');
    	var _cateId = _that.attr('data-cateId');
    	var _note = $('#bjContent').val();
    	var _url = _saveNote;
    	$.post(_url,{'queId':_queId,'zhangjieid':_cateId,'note':_note},function(resp){
    		if(resp.errno==0){
    			$(".tjbj-chuangkou").fadeOut();
    		}
    	},'json'); 
    }
	$(".tjbj-chuangkou .close").click(function(){
		$(".tjbj-chuangkou").fadeOut();
	})
	//纠错
	$(document).on('click','.jiucuo-icon',function(){
		var _this = $(this);
        var _cateId = _this.attr('data-cateId');
        var _queId = _this.attr('data-queId'); 
       // var _url = _showError;
       // $.post(_url,{'cateId':_cateId,'queId':_queId},function(resp){
            //if(resp.status==0){
              
            //}
	   // },'json'); 
	   
		var htmlm='<textarea id="bjContent" rows="7" placeholder="请输入笔记内容！"></textarea>';
		htmlm=htmlm+'<button id="tijiao" class="layui-btn layui-btn-fluid" data-queid="'+_queId+'" data-cateId="'+_cateId+'" style="background-color: rgb(0, 159, 168);">保存</button>';


	  	$('.tjjc-content').html(htmlm);
		$(".jiucuo-chuangkou").fadeIn();
	})
	$(document).on('click','#tijiao',function(){
		var _that = $(this);
		var _title = $("#linshi-bianliang2").text();
		if(_title == "纠错"){
			$("#linshi-bianliang2").text("已纠错").css({"background-color":"#009fa8","color":"#fff"});
		}else{
			$("#linshi-bianliang2").text("纠错").css({"background-color":"#fff","color":"#6c6c6c"});
		}
		saveError(_that); 
	})

	function saveError(_that){
    	var _queId = _that.attr('data-queId');
    	var _cateId = _that.attr('data-cateId');
    	var _queText = _that.attr('data-queText'); 
    	var _conType = _that.attr('data-conType');
    	var _con = $('#con').val();
    	var _tmp = $('[name="conType2"]');
    	var _url = _saveError;
    	var _conType2 = 0;
    	$.each(_tmp,function(){
    		if($(this).is(':checked')){
    			_conType2 = $(this).val();
    		}
    	});
    	if(_conType2==0){
    		layer.msg('请选择纠错类型！',{
    		    time:1000
    	    });
    		return false;
    	}
    	$.post(_url,{'queId':_queId,'cateId':_cateId,'con':_con,'conType':_conType,'conType2':_conType2,'queText':_queText},function(resp){
    		layer.msg(resp.info,{
    		    time:1000
    	    });
    		if(resp.status==0){
    			$(".jiucuo-chuangkou").fadeOut();
    		}
    	},'json'); 
    }

	$(document).on('click','.jiucuo-chuangkou .close',function(){
		$(".jiucuo-chuangkou").fadeOut();
	})

	$(document).on('click','.liebiao-title',function(){
		$(this).siblings('.lebiao-jilu').find('.zuoti-icon').trigger('click');
	});
	//做题交互
	$(document).on('click','.show-kaoshi',function(){
		var _zId = $(this).attr('data');
		var _qxh = $(this).attr('data-ty');
		var page=1;
		tkExamInfo(_zId,page,_qxh);
		$(".top-menu .title").text("题目练习");
		var _settitle = $(this).parents(".kstk-liebiao").find(".timu-title").text();
		$(".set-title").text(_settitle);
	})
	
	$(".content-left ul li").click(function(){
		$(this).children("a").css("background-color",_bgcolor);
		$(this).siblings().children("a").css("background-color","#ecf5f6");
		var dataid = $(this).attr("data-id");
		if(dataid = "tiku"){
			$(".kszn").show();
		    $(".kstk-dati").hide();
		    $(".top-menu .title").text("");
		}
	})
	$(document).on('click','.kstk-return',function(){
		$(".kszn").show();
		$(".kstk-dati").hide();
	})

	function tkExamInfo(_zid,page,_qxh){
		console.log(_qxh);
		$(".kstk-dati").show();
		$('.liebiao-detail').html('');
		$('.liebiao-detail').html('<div style="font-size:18px;line-height:30px;text-align:center;width:100%;">题目加载中...</div>');
		$.post(_tkExamInfo,{'zid':_zid,'page':page,'qxh':_qxh},function(resp){
			console.log(resp);
			$(".liebiao-detail").hide();
			$('.kstk-dati').html(resp.data);
			
			form.render();
		},'json'); 
		//layui.form.render();
	}	
	//if(_qxh!='0'){//学习记录跳入
	//	$(".kszn").hide();
	//	$(".kstk-dati").show();
		//tkExamInfo(_cateId,_qxh);
	//}
	//主观题
	$(document).on('click','.sure4',function(){ //病例分析题-填空题-问答题等主观题
		var _this = $(this);
		var _xh = _this.attr('data'); 
        var _queId = _this.attr('data-id');
        var _cateId = _this.attr('data-cateId');
		var _answer = $('[name="answer'+_xh+'"]').val();
		var _prompt = $('[name="prompt'+_xh+'"]').val();
		var _tmp = $('[name="textarea'+_xh+'"]'); 
		var _uAnswer = _tmp.val();
		if(_uAnswer==''){
			//return false;
		}
		var _pd = 2;
		showResult(_queId,_xh,_pd,_uAnswer,_answer,_prompt,_cateId);
		tjZts();
	});

	//多选点击
	$(document).on('click','.sure',function(){
		var _this = $(this);
		var _xh = _this.attr('data'); 
        var _queId = _this.attr('data-id');
        var _cateId = _this.attr('data-cateId');
		var _answer = $('[name="answer'+_xh+'"]').val();
		var _prompt = $('[name="prompt'+_xh+'"]').val();
		var _tmp = $('[name="checkbox'+_xh+'"]');
		var _arr = [];
		$.each(_tmp,function(){
			if($(this).is(':checked')){
				_arr.push($(this).val());
			}
		});
		var _uAnswer = _arr.join(' ');
		if(_uAnswer==''){
			return false;
		}
		if(_answer==_uAnswer){
			var _pd = 1;
		}else{
			var _pd = 0;
		}
		showResult(_queId,_xh,_pd,_uAnswer,_answer,_prompt,_cateId);
		tjZts();
	});

	//单选点击
	$(document).on('click','.layui-form-radio',function(){
		var _this = $(this).prev();
		var _xh = _this.attr('data');
        var _queId = _this.attr('data-id');
        var _cateId = _this.attr('data-cateId');
		var _uAnswer = _this.val();
		var _answer = $('[name="answer'+_xh+'"]').val();
		var _prompt = $('[name="prompt'+_xh+'"]').val();
		if(_answer==_uAnswer){
			var _pd = 1;
		}else{
			var _pd = 0;
		}
		showResult(_queId,_xh,_pd,_uAnswer,_answer,_prompt,_cateId); 
		tjZts();
	});

	//统计做题数
	function tjZts(){
		var _tmp = $('.dats');
		var _zts = 0;
		$.each(_tmp,function(){
			if($(this).is(':hidden')){

			}else{
				_zts++;
			}
		});
		$('#zts').html(_zts);
	}

	//提示做题结果
	function showResult(_queId,_xh,_pd,_uAnswer,_answer,_prompt,_cateId){
		if(_pd==0){
			var _bgcolor = '#ff0000';
			var _ts = "答题错误，继续努力";
		}else if(_pd==1){
			var _bgcolor = '#000000';
			var _ts = "答题正确";
		}else{
			var _bgcolor = '#000000';
			var _ts = "";
		}
		var _html = "<p><span style='color:"+_bgcolor+"'>您的答案："+_uAnswer+"&nbsp;"+_ts+"</span></p>";
		    _html = _html+"<p>正确答案："+_answer+"</p>";
		    if(_prompt!=''){		    	
		    	_html = _html+"<p>解析："+_prompt+"</p>";
		    }
		$('#showResult'+_xh).html(_html).css('display','block'); 
        //保存做題結果
        saveYtLog(_queId,_pd,_uAnswer,_cateId);
        //if(_shiyong=="1" && _xh>=5){
        //	$('.jihuo-icon').trigger('click');
       // }
        //监控试用最后一题跳转购买界面
        /*if(shiyong==1 && _xh>=5){
        	$$("#dialoge").show();
        }*/
	}

	//保存题库做题结果
    function saveYtLog(_queId,_pd,_uAnswer,_cateId){
       // var _url = _saveTkLog;
       // $.post(_url,{'queId':_queId,'pd':_pd,'uAnswer':_uAnswer,'cateId':_cateId},function(resp){

        //},'json');
    } 
	//form.render("radio");
});