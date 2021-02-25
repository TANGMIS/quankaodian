layui.use(['jquery', 'layer' ,'element','form'], function(){ 
    var $ = layui.$ //重点处
    ,layer = layui.layer
    ,element = layui.element
    ,form = layui.form;
    
    //滚动条高度
    $(window).resize(function(){
    	var _leftCd = $(".content-right").height() - $(".top-menu").outerHeight() - $(".mnkc-ltitle").outerHeight();
   		$(".caidan-list").height(parseInt(_leftCd));
   		$(".mytableMn").height(parseInt(_leftCd));
    
    })
    var _leftCd = $(".content-right").height() - $(".top-menu").outerHeight() - $(".mnkc-ltitle").outerHeight();
    $(".caidan-list").height(parseInt(_leftCd));
    $(".mytableMn").height(parseInt(_leftCd));
    
    //菜单交互
    function caidan(obj){
    	var _this = obj;
    	if(_this.children("span").hasClass("zhankai-arror")){
    		_this.next().hide();
    		_this.children("span").removeClass("zhankai-arror").addClass("bihe-arror");
    	}else if(_this.children("span").hasClass("bihe-arror")){
    		_this.next().show();
    		_this.children("span").removeClass("bihe-arror").addClass("zhankai-arror");
    	}
    }
    $(".candan-erji").click(function(){
    	caidan($(this));
    	
    })
    $(".caidan-yiji").click(function(){
    	caidan($(this));
    })
    $(".caidan-list .layui-form-checkbox").click(function(){
    

    	if($(this).hasClass("layui-form-checked")){
    		$(this).parents("li").css("background","#f2f2f2")
    	}else{
    		$(this).parents("li").css("background","#fff")
    	}
    })




	
	

	 

	$(document).on('blur','.table-input',function(){
		var _tmp = $('.table-input');
		var _queTypeId = [];
		var _flag = 0;
		//校验选择题目数
		$.each(_tmp,function(){
			var _val = $(this).val();
			var _typeId = $(this).attr('data');
			var _com = $(this).parent().next().find('span').text();
			if(parseInt(_val)>0 && parseInt(_val)<=parseInt(_com)){
				_flag = 1;
			}
			var _tt = {'queTypeId':_typeId,'num':_val};
			_queTypeId.push(_tt);
		});
		//$.post(_saveQueTypeId,{'arr':_queTypeId},function(resp){

		//},'json');
	});
	//选择取题范围
	$(document).on('click','.erji-list .layui-form-checkbox',function(){		
		initial1();
	});  
	//初始化加载
	function initial1(){
		var _tmp = $('.erji-list').find('.layui-form-checkbox');
		var _cateId = [];
		$.each(_tmp,function(){
			if($(this).hasClass('layui-form-checked')){
				var _val = $(this).prev().val();
				if(_cateId.length<=5){
					_cateId.push(_val);
				}
			}
		});
		if(_cateId.length>=5){
			alert("最多5个类目,多选无效！");
			return;
		}
		if(_cateId.length==0){//初始化0
			$('.tishu').text('0');
		}else{
			setTiShu(_cateId); 
		}
		return _cateId;
	}

	initial1();



	function setTiShu(_cateId){
		var _url = _getQueTypeNums;
		var timestamp = (new Date()).valueOf();
		let data={'zid':_cateId,"tim":timestamp};
		$.post(_url,data,function(resp){ 
			if(resp.code==200){
				initial(resp.data);
			}
		},"json");
	}

	function initial(_res){
		var _tmp = $('.tishu'); 
		console.log(_res)
		if(_res.length>0){
			$.each(_tmp,function(){
				var _queTypeId = $(this).attr('data');
				var _flag = 0;
				for (var i = 0; i < _res.length; i++) {
					if(_res[i].queTypeId==_queTypeId){
						_flag=1;
						$(this).text(_res[i].num);
					}
				}
				if(_flag==0){
					$(this).text('0');
				}
			});
		}else{
			$('.tishu').text('0');
		}
	}


//开始做题
$(document).on('click','.zuoti-icon',function(){		
	var jhid = $(this).attr('data-id');
	var typeno = $(this).attr('data-typeno');
	var isstart = $(this).attr('data-isstart');
	console.log(isstart)
	if(isstart==1)
	{
		layer.msg('今天已完成此计划，为请明天继续！'); 
		return;
	}
	
	//$(".mnkc").hide();
	$(".exam-chuangkou").show();
	$('.exam-chuangkou').html('<div style="font-size:18px;line-height:30px;text-align:center;width:100%;">题目加载中...</div>');
	var _url=_gettque;
	$.post(_url,{'id':jhid,"typeno":typeno,"isstart":isstart},function(resp){ 

		$('.exam-chuangkou').html(resp);
		form.render();
		$('.dats').css('display','block');
	});
});
	
});