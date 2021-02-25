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


	$(document).on('click','.jiucuo-chuangkou .close',function(){
		$(".jiucuo-chuangkou").fadeOut();
	})

	$(document).on('click','.liebiao-title',function(){
		$(this).siblings('.lebiao-jilu').find('.zuoti-icon').trigger('click');
	});
	//做题交互
	$(document).on('click','.zuoti-icon',function(){
		var _zId = $(this).attr('data');
		ExamInfo(_zId);
	    $(".exam-chuangkou").show();
	})
	//开始练习 
	function ExamInfo(_cateId){
		_examLog = '';
		$('.exam-chuangkou').html('<div style="font-size:18px;line-height:30px;text-align:center;width:100%;">题目加载中...</div>');
		$.post(_tkExamInfo,{'cateId':_cateId},function(resp){
				$('.exam-chuangkou').html(resp);
				form.render();
		});
	}
	$(document).on('click','.show-timu span',function(){				
		var _jj = $('.jiaojuan').attr('data');
		var _thisNum = $(this).attr("data-id");
		var _tx = $(this).attr('data-tx');
		var _type = $(this).attr('data-type');
		if(_jj=='0'){
			//获取当前做题tx
			var _curTx=1;
			var _zdxh=1;
			$(".show-timu").find("span").each(function(){
				if($(this).hasClass("zaida")){
					_curTx = $(this).attr('data-tx'); 
					_zdxh = $(this).attr('data-id');
				}
			});
			
			if(parseInt(_tx)<parseInt(_curTx)){//点击上面题型
				alert('不能进入当前题型做题！');
				return false;
			}else if(parseInt(_tx)>parseInt(_curTx)){//点击下面题型
				//判断上一题型是否做完
				var _comp = parseInt(_tx)-1;
				var _res = checkIsOrNotOk(_comp);
				if(!_res){
					return false;
				}else{
					if(confirm('确定进入下一题型么？进入之后不可返回上一题型！')){
						if(_type=='4'){
							var _preId = parseInt(_thisNum)-1;
							if(!$('.show-timu span[data-id="'+_preId+'"]').hasClass('yida')){
								alert('A4题型做题不可跳跃做题！');
								return false;
							}
						}
						$(".show-timu span").removeClass("zaida");
						$(this).addClass("zaida").siblings().removeClass("zaida");
						spanClick(_thisNum);
					}
				}
			}else{//同一题型下点击
				if(_type=='4'){//A4题型单独处理~只能顺序做题不能回退
					if(parseInt(_thisNum)<parseInt(_zdxh)){
						alert('A4题型做题不可回退！');
						return false;
					}else if(parseInt(_thisNum)>parseInt(_zdxh)+1){
						alert('A4题型做题不可跳跃做题！');
						return false;					
					}else if(parseInt(_thisNum)==parseInt(_zdxh)+1){
						var _ttt = $('.show-timu span[data-id="'+_zdxh+'"]');
						if(!_ttt.hasClass('yida')){
							alert('A4题型当前题未作答，不可进入下一题！');
							return false;
						}
					}
				}
				$(".show-timu span").removeClass("zaida");
				$(this).addClass("zaida").siblings().removeClass("zaida");
				spanClick(_thisNum);				
			}

			/*//判断上一个题型是否答题完毕
			if(_tx>1){
				var _comp = parseInt(_tx)-1;
				var _res = checkIsOrNotOk(_comp);
				if(!_res){
					return false;
				}
			}*/

			
		}else{
			spanClick(_thisNum);
		}		
	})
		//点击题目面板操作
		function spanClick(_thisNum){
			$(".left-main .sttk").each(function(){
				var _timuNum = $(this).attr("data-id");
				if(_thisNum == _timuNum){
					$(this).show().siblings().hide();
				}
			})
		}
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

	//进入下一题 by data-id
	function toNext(_jj){
		$(".left-main .sttk").each(function(){
			var _thisShow = $(this).css("display");
			if(_thisShow == "block"){
				var _dataId = $(this).attr("data-id");
				var _spanlength = $(".layui-collapse span").length;
				console.log(_spanlength);
				var _nextdataId;
				$(".layui-collapse span").each(function(){
					var _spandataId = $(this).attr("data-id"); 
					if(_dataId == _spandataId){
						console.log(_spanlength+'|'+_spandataId);
						if(_spandataId < _spanlength){
							_nextdataId = parseInt(_spandataId) + parseInt(1);
						}else{						
							_nextdataId = _spanlength; 
							alert('试卷做题完毕！');
						}
						if(_jj=='0'){
							$(".layui-collapse").find("span[data-id = '"+ _nextdataId + "']").addClass("zaida");
						}						
						//console.log("span[data-id = '"+ _nextdataId + "']");
					}
				})
				
				$(this).next().show().siblings().hide();
				return false;
			}
		})
	}
	$(document).on('click','.next-timu',function(){
		var _jj = $('.jiaojuan').attr('data');
		if(_jj==0){
			var _curId = 0;
			$(".left-main .sttk").each(function(){//判断是否进入下一个题型
				if(!$(this).is(':hidden')){
					curId = $(this).attr('data-id');
				}
			});
			var _curthis = $('.show-timu span[data-id="'+curId+'"]');
			var _type = _curthis.attr('data-type');
			var _length = _curthis.parent().children().length; 
			var _mypos = _curthis.index();
			if(_type=='4'){
				if(!_curthis.hasClass('yida')){
					alert('A4题型当前题未作答，不可进入下一题！');
					return false;
				}
			}
			if(parseInt(_length)==parseInt(_mypos)+1){
				if(confirm('确定进入下一题型么？进入之后不可返回上一题型！')){
					//判断当前题型是否全部做完毕
					var _res = checkIsOrNotOk(_curthis.attr('data-tx'));
					if(!_res){
						return false;
					}
					$(".show-timu span").removeClass("zaida");
					toNext(_jj);
				}
			}else{
				$(".show-timu span").removeClass("zaida");
				toNext(_jj);
			}
		}
		else{
			toNext(_jj);
		} 
		
	})
	//返回上一题by data-id
	function toPrev(_jj){
		$(".left-main .sttk").each(function(){
			var _thisShow = $(this).css("display");
			if(_thisShow == "block"){
				var _dataId = $(this).attr("data-id");
				var _predataId;
				$(".layui-collapse span").each(function(){
					var _spandataId = $(this).attr("data-id");
					if(_dataId == _spandataId){
						if(_spandataId == 1){
							_predataId = 1;
						}else {
						    _predataId = parseInt(_spandataId) - parseInt(1);
						}
						if(_jj=='0'){
							$(".layui-collapse").find("span[data-id = '"+ _predataId + "']").addClass("zaida");
						}						
						//console.log("span[data-id = '"+ _predataId + "']");
					}
				})
				
				//console.log(_dataId);
				$(this).prev().show().siblings().hide();
				return false;
			}
		})
	}

	$(document).on('click','.pre-timu',function(){
		var _jj = $('.jiaojuan').attr('data');
		if(_jj=='0'){
			var _curId = 0;
			$(".left-main .sttk").each(function(){//判断是否进入下一个题型
				if(!$(this).is(':hidden')){
					_curId = $(this).attr('data-id');
				}
			});
			if(_curId==1){
				return false;
			}else{
				var _preId = parseInt(_curId)-1;
				var _pretx = $('.show-timu span[data-id="'+_preId+'"]').attr('data-tx');
				var _curtx = $('.show-timu span[data-id="'+_curId+'"]').attr('data-tx');
				var _type = $('.show-timu span[data-id="'+_curId+'"]').attr('data-type');
				if(_type=='4'){
					alert('A4题型做题只可顺序做题，不可回退！');
					return false;
				}
				if(_pretx!=_curtx){
					alert('不可回退上一题型！');
					return false;
				}else{
					$(".show-timu span").removeClass("zaida");
					toPrev(_jj);
				}
			}			
		}else{
			toPrev(_jj);
		}		
	}) 

	
	$(document).on('click','.sure',function(){

		//console.log("check")
		var _jj = $('.jiaojuan').attr('data');
		if(_jj=='1'){
			return false;
		}
		var _arr = [];
		var _this = $(this);
		var _dataId = _this.attr('data');
		var _answer = $('[name="answer'+_dataId+'"]').val();
    	var _prompt = $('[name="prompt'+_dataId+'"]').val();
    	var _queId = _this.attr('data-id');
		/*if(_this.hasClass('layui-form-checked')){
			_arr.push(_this.prev().val());
		}*/
		var _this1 = _this.parent().find('.layui-form-checkbox')
		$.each(_this1,function(){
			_this2 = $(this);
			if($(_this2).hasClass('layui-form-checked')){
				_arr.push(_this2.prev().val());
			}
		})
		var _uAnswer = _arr.join(' ');
		console.log(_uAnswer);
		console.log(_answer);
		if(_uAnswer==''){
			setPanel(_dataId,0);
			subCookie(_dataId);
			//saveYtLog(_queId,0,_uAnswer,1);

		}else{
			if(_answer==_uAnswer){
				var _pd = 1;
			}else{
				var _pd = 0;
			}
			showResult(_queId,_dataId,_pd,_uAnswer,_answer,_prompt);
			setCookie(_dataId,_queId,_pd,_uAnswer,_answer);
			setPanel(_dataId,1);
		} 
	});


	$(document).on('click','.layui-form-radio',function(){

		//console.log("roadio")
		var _jj = $('.jiaojuan').attr('data');
		if(_jj=='1'){
			return false;
		}
		var _this = $(this).prev();
		var _dataId = _this.attr('data');
		var _queId = _this.attr('data-id');
		var _uAnswer = _this.val();
		var _answer = $('[name="answer'+_dataId+'"]').val();
    	var _prompt = $('[name="prompt'+_dataId+'"]').val();
		if(_answer==_uAnswer){
			var _pd = 1;
		}else{
			var _pd = 0;
		}
		//console.log(_queId);
		showResult(_queId,_dataId,_pd,_uAnswer,_answer,_prompt);
		setCookie(_dataId,_queId,_pd,_uAnswer,_answer);
		setPanel(_dataId,1);
	});

	$(document).on('click','.sure4',function(){
		var _jj = $('.jiaojuan').attr('data');
		if(_jj=='1'){
			return false;
		}
		var _this = $(this);
		var _dataId = _this.attr('data');
		var _queId = _this.attr('data-id'); 
		var _uAnswer = $('[name="textarea'+_dataId+'"]').val();
		var _answer = $('[name="answer'+_dataId+'"]').val();
    	var _prompt = $('[name="prompt'+_dataId+'"]').val();
		var _pd = 2;
	
		showResult(_queId,_dataId,_pd,_uAnswer,_answer,_prompt);
		setCookie(_dataId,_queId,_pd,_uAnswer,_answer);
		setPanel(_dataId,1);
	});

	function setPanel(_dataId,_flag){
		$('.show-timu span').each(function(){
			if($(this).attr('data-id')==_dataId){
				if(_flag==1){
					$(this).addClass('yida');
				}else{
					$(this).removeClass('yida');
				}
			}
		});
	}

	//删除做题记录by xh
	function subCookie(_xh){
		if(_examLog!=''){
			var _tt = _examLog;
            var _arr = _tt.split('-');
            var _arrn = []; 
            for (var i = 0; i < _arr.length; i++) {
            	var _arr1 = _arr[i].split('|');
            	if(_arr1[0]!=_xh){ 
            		_arrn.push(_arr[i]);
            	} 
            }
            var _cookie = _arrn.join('-');
            _examLog = _cookie;  
        	updateYdNums();
		}
	}

	//保存做题cookie
	function setCookie(_xh,_queId,_pd,_uAnswer,_answer){   
		console.log(_queId);
		if(_examLog!=''){
            var _tt = _examLog;
            var _arr = _tt.split('-');
            var _flag = 0; 
            for (var i = 0; i < _arr.length; i++) {
            	var _arr1 = _arr[i].split('|');
            	if(_arr1[0]==_xh){
            		_arr1[1] = _pd;
            		_arr[i] = _arr1.join('|');
            		_flag = 1;
            	} 
            }
            if(_flag==0){
            	_arr.push(_xh+'|'+_pd+'|'+_queId+'|'+_uAnswer+'|'+_answer);
            }
            var _cookie = _arr.join('-');
        }else{
        	var _cookie = _xh+'|'+_pd+'|'+_queId+'|'+_uAnswer+'|'+_answer; 
        }
		_examLog = _cookie;  
        updateYdNums();
	}

	function updateYdNums(){
		var ydNums;
		if(_examLog == ''){
			ydNums = 0;
		}else{
			var _arr = _examLog.split('-');
			ydNums = _arr.length;
		}
		$('.ydNums').text("已答："+ydNums+"题");
		//console.log(_examLog);
	}

	//提示做题结果
	function showResult(_queId,_xh,_pd,_uAnswer,_answer,_prompt){ 
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
        console.log(_uAnswer);
        //console.log(_answer);
		//$$.cookie("exam",'',{expires: -1 ,path:"/"});
		var _html = "<p><span style='color:"+_bgcolor+"'>您的答案："+_uAnswer+"&nbsp;"+_ts+"</span></p>";
		    _html = _html+"<p>正确答案："+_answer+"</p>";
		    if(_prompt!=''){
				_html = _html+"<p>解析："+_prompt+"</p>";
		    }
		    $('#showResult'+_xh).html(_html); 
        //保存做題結果
        //saveYtLog(_queId,_pd,_uAnswer,0);
        //if(_shiyong=="1" && _xh>=5){
        //	gouMai();
    	//	$(".goumai-chuangkou").fadeIn();
        //}
        //监控试用最后一题跳转购买界面
        /*if(shiyong==1 && _xh>=5){
        	$$("#dialoge").show();
        	//window.location.href="<?=U('Product/selectPro')?>";
        }*/
	}

	//保存押题做题结果
    function saveYtLog(_arr){
			console.log(_arr);
			var _url = _saveYtLog;
			let data={"list":_arr,'zid':_zid,'protype':1};
			$.post(_url,JSON.stringify(data),function(resp){
				console.log(resp);
			},'json');
			//console.log("logoootttt")
    }

    $(document).on('click','.jiaojuan',function(){
		var _ydNums = $('.ydNums').text();
		var _arrw = []; 
    	_ydNums = _ydNums.replace(/已答：/,'');
    	_ydNums = _ydNums.replace(/题/,'');
    	var _totals = $('.ydNums').prev().text();
    	_totals = _totals.replace(/试题总数：/,'');
    	_totals = _totals.replace(/题/,'');
    	var _msg = "总题数:"+_totals+",已做题："+_ydNums+"。确定交卷么？";
    	if(confirm(_msg)){
    		$(this).attr('data','1');
    		var _wrong = 0;
    		var _noAnswer = 0;
    		var _right = 0; 
			var _arr = _examLog.split('-'); 
			
    		if(_examLog!=''){
    			for (var i = 0; i < _arr.length; i++) {
    				var _arr1 = _arr[i].split('|');
    				if(_arr1[1]==0){
						var arrt={"tqueid":_arr1[2],"useranswer":_arr1[3],"answer":_arr1[4]};
						_arrw.push(arrt);
    					_wrong++;
    				}else{
    					_right++;
    				}
    			}
    		}
    		_noAnswer = parseInt(_totals)-_wrong-_right;
    		var _ts  ="本次共["+_totals+"]题\n正确："+_right+"题 错误："+_wrong+"题 未答："+_noAnswer+"题";
    		//layer.msg(_ts,{time:5000});
    		alert(_ts);

    		//待处理~~~答题卡标色~~~
    		$('.layui-bg-blue').text('答对');
    		$('.layui-bg-blue').next().text('答错');
    		ksOk();
			$('.dats').css('display','block');
			//保存错题
			saveYtLog(_arrw);
    	}
    });
    function ksOk(){
    	var _tmp = $('.show-timu span');    	
    	_tmp.removeClass('zaida').removeClass('yida');
    	_tmp.each(function(){
    		var _ret = examLog($(this).attr('data-id'));
    		if(_ret!=''){
    			$(this).addClass(_ret);
    		} 
    	});
    }
    function examLog(_dataId){
    	var _arr = _examLog.split('-');
    	if(_examLog!=''){
    		for (var i = 0; i < _arr.length; i++) {
    			var _arr1 = _arr[i].split('|');
    			if(_arr1[0]==_dataId){
    				if(_arr1[1]==0){
    					return 'zaida';
    				}else{
    					return 'yida';
    				}
    			}
    		}
    	}else{
    		return '';
    	}
    }
   

	//if(_qxh!='0'){//学习记录跳入
	//	$(".kszn").hide();
	//	$(".kstk-dati").show();
		//tkExamInfo(_cateId,_qxh);
	//}
	
	//收藏
	$(document).on('click','.shoucang-icon',function(){
		var _title = $(this).text();
		var post=0;
		if(_title == "收藏"){
			$(this).text("已收藏").css({"background-color":"#009fa8","color":"#fff"});
			post=1;
		}else{
			$(this).text("收藏").css({"background-color":"#fff","color":"#6c6c6c"});
		}
		var _queId = $(this).attr('data-queId');
		var _cateId = $(this).attr('data-cateId');
		var protype = $(this).attr('data-protype');
		let data={"tqueid":_queId,"zid":_cateId,"post":post,"protype":protype};
		console.log(data)
		$.post(_shouCang,data,function(resp){

    		layer.msg('操作成功',{
    		    time:1000
    	    });
		})
	})
	//添加笔记
	$(document).on('click','.biji-icon',function(){
		$("#tqueid").val($(this).attr('data-queId'));
		$("#cateid").val( $(this).attr('data-cateId'));
		$("#protype").val( $(this).attr('data-protype'));
		$(".tjbj-chuangkou").fadeIn();
	})
	$(document).on('click','#biji-tijiao',function(){
		let context=$("#biji-text").val();
		let data={"tqueid":$("#tqueid").val(),"zid":$("#cateid").val(),"protype":$("#protype").val(),"context":context};
		$.post(_saveNote,data,function(resp){
			console.log(resp)
    		layer.msg('操作成功',{
    		    time:1000
			});
			$(".tjbj-chuangkou").fadeOut();
		})


	})
	$(".tjbj-chuangkou .close").click(function(){
		$(".tjbj-chuangkou").fadeOut();
	})
	//纠错
	$(document).on('click','.jiucuo-icon',function(){
		$("#tqueid").val($(this).attr('data-queId'));
		$("#cateid").val( $(this).attr('data-cateId'));
		$("#protype").val( $(this).attr('data-protype'));
		$(".jiucuo-chuangkou").fadeIn();
	})
	$(document).on('click','#jiucuo-tijiao',function(){
		let context=$("#jiucuo-text").val();
		let data={"tqueid":$("#tqueid").val(),"zid":$("#cateid").val(),"protype":$("#protype").val(),"context":context};
		$.post(_Jiucuo,data,function(resp){
			console.log(resp)
    		layer.msg('操作成功',{
    		    time:1000
			});
			$(".tjbj-chuangkou").fadeOut();
		})
	})


	$(document).on('click','.jiucuo-chuangkou .close',function(){
		$(".jiucuo-chuangkou").fadeOut();
	})
	//考试页面
	$(document).on('click','.exam-close-button',function(){
		$(".exam-chuangkou").hide();
		$('.content-left ul li[data-id="tiku"]').addClass("layui-this").siblings().removeClass("layui-this").children("a").css("background-color","#ecf5f6");
	})
	//form.render("radio");
});