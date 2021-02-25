layui.use(['jquery', 'layer' ,'element','form'], function(){ 
    var $ = layui.$ //重点处
    ,layer = layui.layer
    ,element = layui.element
    ,form = layui.form;
    
    //控制滚动条高度
    $(window).resize(function(){
    	var _leftCd = $(".content-right").height() - $(".top-menu").outerHeight();
        $(".tkct-left").height(parseInt(_leftCd));
    })
    var _leftCd = $(".content-right").height() - $(".top-menu").outerHeight();
    $(".tkct-left").height(parseInt(_leftCd));
    
    $(".tkct-left p").click(function(){
        $(this).css("background-color","#ecf5f6").siblings().css("background-color","#fff")
        var _cateId = $(this).attr('data');
        errorList(_cateId);
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
    	$.post(_url,{'queId':_queId,'cateId':_cateId,'scFlag':_scFlag},function(resp){

    	},'json');
    }
	//添加笔记
	$(document).on('click','.biji-icon',function(){
		var _this = $(this);
        var _cateId = _this.attr('data-cateId');
        var _queId = _this.attr('data-queId'); 
        var _url = _showNote;
        $.post(_url,{'cateId':_cateId,'queId':_queId},function(resp){
            if(resp.status==0){
                $('.tjbi-content').html(resp.data);
            }
        },'json'); 
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
    	$.post(_url,{'queId':_queId,'cateId':_cateId,'note':_note},function(resp){
    		if(resp.status==0){
    			$(".tjbj-chuangkou").fadeOut();
    		}
    	},'json'); 
    }

	$(".tjbj-chuangkou .close").click(function(){
		$(".tjbj-chuangkou").fadeOut();
	})
	//纠错
	$(".jiucuo-icon").click(function(){
		$(".jiucuo-chuangkou").fadeIn();
	})
	$("#tijiao").click(function(){
		var _title = $("#linshi-bianliang2").text();
		if(_title == "纠错"){
			$("#linshi-bianliang2").text("已纠错").css({"background-color":"#009fa8","color":"#fff"});
		}else{
			$("#linshi-bianliang2").text("纠错").css({"background-color":"#fff","color":"#6c6c6c"});
		}
		$(".jiucuo-chuangkou").fadeOut();
	})
	$(".jiucuo-chuangkou .close").click(function(){
		$(".jiucuo-chuangkou").fadeOut();
	})


   // errorList(_fstId);
    function errorList(_cateId){
    	if(_cateId>0){
    		$.post(_errorList,{'cateId':_cateId},function(resp){
    			if(resp.status==0){
    				$('.tkct-right').html(resp.data);
    			}
    		},'json')
    	} 
    }

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
			return false;
		}
		var _pd = 2;
		showResult(_queId,_xh,_pd,_uAnswer,_answer,_prompt,_cateId); 
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
	});

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
		    _html = _html+"<p>解析："+_prompt+"</p>";
		$('#showResult'+_xh).html(_html).css('display','block'); 
        //保存做題結果
        saveYtLog(_queId,_pd,_uAnswer,_cateId);

        //监控试用最后一题跳转购买界面
        /*if(shiyong==1 && _xh>=5){
        	$$("#dialoge").show();
        }*/
	}

	//保存题库做题结果
    function saveYtLog(_queId,_pd,_uAnswer,_cateId){
        var _url = _saveTkLog;
        $.post(_url,{'queId':_queId,'pd':_pd,'uAnswer':_uAnswer,'cateId':_cateId},function(resp){

        },'json');
    }
});