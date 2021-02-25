layui.use(['jquery', 'layer' ,'element','form'], function(){ 
    var $ = layui.$ //重点处
    ,layer = layui.layer
    ,element = layui.element
    ,form = layui.form;
    var player='';
    //滚动条高度
    $(window).resize(function(){
    	 var _leftCd = $(".content-right").height() - $(".top-menu").outerHeight() - 55;
	    $(".shiti").height(parseInt(_leftCd));
	    var _shipinList = $(".content-right").height() - 55;
	    $(".spList").height(parseInt(_shipinList));
    })
    var _leftCd = $(".content-right").height() - $(".top-menu").outerHeight() - 55;
    $(".shiti").height(parseInt(_leftCd));
    var _shipinList = $(".content-right").height() - 55;
    $(".spList").height(parseInt(_shipinList));
    
    $(document).on('click','.show-shipin',function(){
        var _cateListId = $(this).attr('data');
        var _text = $(this).text();
        $.post(_spVodUrl,{'cateListId':_cateListId},function(resp){
                console.log(resp)
                if(resp.errno==2){
                    layer.msg(resp.message,{
	        		    time:1000
                    });
                    return;
                }
            if(resp.errno==0){
                var t = resp.data;
                if(t.savetype==1)//阿里云点播
                {
                    playH5(t.videoId,t.playAuth);
                    $(".videolist").show();
                    $(".hudong").hide();
                    $(".videolist").html(videolist(t.videolist));
                }
                if(t.savetype==4)//直播
                {
                    ali_live(t.playurl,true,t.cover);
                    initim(t.Tisid,t.ishttps);
                    $(".videolist").hide();
                }
                if(t.savetype==3)//本地视频
                {
                    ali_live(t.playurl,false);
                    $(".videolist").html(videolist(t.videolist));
                }
                $(".sp-chuangkou").show();
            }
        },'json'); 
           
             
    }) 
         
    $(document).on('click','.chashipin',function(){
        var _vid = $(this).attr('data');
        console.log(_vid);
            $.post(_SpUrl,{'vid':_vid},function(resp){
              console.log(resp);
                if(resp.errno==2){
                    layer.msg(resp.message,{
	        		    time:1000
                    });
                    return;
                }
                if(resp.errno==0){
                    var t = resp.data;
                    $('#J_prismPlayer').empty();//id为html里指定的播放器的容器id 
                    player.dispose(); //销毁
                    playH5(t.videoId,t.playAuth);
                }
            },'json'); 
           // $(".sp-chuangkou").show();
             
    }) 
    function videolist(v)
    {
        console.log(v);
        var _html="";
        for(i=0;i<v.length;i++)
        {
            _html=_html+'<div class="yt-list" style="background:#fff; border-bottom:#ccc solid 1px">';
            _html=_html+'<span class="list-title">'+v[i].filename+'</span>';
            _html=_html+'<span class="chashipin rukou-shipin" data="'+v[i].id+'" dbtype="'+v[i].vtype+'">观看</span>';
            _html=_html+'</div>';
        }
        return _html;
    }
    
    function playH5(_videoId,_playAuth){ 
        player = new Aliplayer({
        id: 'J_prismPlayer',
        width: '100%',
        height:'250px',
        autoplay: false,
        isLive: false,

        components: [{
          name: 'RateComponent',
          type: AliPlayerComponent.RateComponent
        }],
        //支持播放地址播放,此播放优先级最高
        //source : _url                
        vid: _videoId,
        playauth: _playAuth,
        },function(player){
            console.log('播放器创建好了。')
       }); 

        var setLayout = function()
        {    
            //设置播放器容器的高度
            var height; //根据实际情况设置高度
            player.el().style.height = height;
        }
        window.onresize = function(){
            setLayout(); 
        }
        player.on("requestFullScreen", function(){
            setLayout();
        });
    }
    function ali_live(_playurl,_islive,_cover)
    {
        console.log(_playurl);
        player = new Aliplayer({
            id: "J_prismPlayer",
            width: '100%',
            height:'250px',
            autoplay: true,
            playsinline: true,
            preload: true,
            controlBarVisibility:"hover",
            useH5Prism: true,
            isLive: _islive,
            showBarTime:"3000",
            useFlashPrism: false,
            x5_type:"",
            x5_video_position:"top",
            x5_fullscreen: true,
            source:_playurl,
            liveStartTime:_liveStartTime,
            liveOverTime:_liveOverTime,
            liveRetry: 10,
            cover:_cover,
            components:[
                {
                    name: 'RotateMirrorComponent',
                    type: AliPlayerComponent.RotateMirrorComponent
                },
            ],
            "skinLayout": [
                {
                  "name": "bigPlayButton",
                  "align": "blabs",
                  "x": 30,
                  "y": 80
                },
                {
                  "name": "errorDisplay",
                  "align": "tlabs",
                  "x": 0,
                  "y": 0
                },
                {
                  "name": "infoDisplay"
                },
                {
                  "name": "controlBar",
                  "align": "blabs",
                  "x": 0,
                  "y": 0,
                  "children": [
                    {
                      "name": "liveDisplay",
                      "align": "tlabs",
                      "x": 15,
                      "y": 6
                    },
                    {
                      "name": "fullScreenButton",
                      "align": "tr",
                      "x": 10,
                      "y": 10
                    },
                    {
                      "name": "volume",
                      "align": "tr",
                      "x": 5,
                      "y": 10
                    }
                  ]
                }
            ],
        },function (player) {
            player._switchLevel = 0;
            player.on('sourceloaded', function(params) {
                var paramData = params.paramData;
                var desc = paramData.desc;
                var definition = paramData.definition;
                player.getComponent('QualityComponent').setCurrentQuality(desc, definition);
                var screen_width = document.getElementById('video-wrap').clientWidth;
                var video_height = (screen_width * 9)/16;
                if(screen_width < 500){
                    $('#J_prismPlayer').css('height', video_height + 'px');
                    $('#player-container-id').css('height', video_height + 'px');
                }
                $(document).ready(function (){
                    var video = document.getElementsByTagName('video')[0];
                    video.setAttribute("x5-playsinline", "");
                });
            });

        });

        //player.on('play', playVideo);
       // player.on('pause', pauseVideo);
    }



    $(".close-shipin").click(function(){
    	$(".sp-chuangkou").hide(); 
        $('#J_prismPlayer').empty();//id为html里指定的播放器的容器id 
        player.dispose(); //销毁
        
    })

    //返回上一页
    $(".icon-return").click(function(){
        $(".liebiao").show();
        $(".liebiao-detail").hide();
    })
    $(".timu-icon-return").click(function(){
        $(".liebiao-timu").hide();
        $(".liebiao-detail").show();
    })
    $(".rukou-icon").click(function(){
        var _listTitle = $(this).prev().text();
        var _parentid = $(this).attr('data');

        ajaxPost(_parentid,'.spList','getSpList');
        $(".set-title").text(_listTitle);

    })
    $(".ckst").click(function(){
        $(".liebiao-detail").hide();
        $(".liebiao-timu").show();
    })
    //-------------------------------------  
    function ajaxPost(_parentid,div,page){
        $(div).html('');
       
        $.post(_getSpList,{'parentid':_parentid,'page':page},function(resp){
            console.log(resp);
            var _html="";
            
            if(resp.errno==0)
            {
                var arr=resp.data.list;
               
                for(i=0;i<arr.length;i++)
                {
                    _html=_html+'<div class="yt-list">';
                    if(arr[i].savetype==4 ||arr[i].savetype==5)
                    {
                        _html=_html+"【直播】";
                    }
                    _html=_html+'<span class="list-title">'+arr[i].cname+'</span>';
                    _html=_html+'<span class="show-shipin rukou-shipin" data="'+arr[i].id+'" dbtype="'+arr[i].dbtype+'">观看</span>';
                    _html=_html+'</div>';
                }
              
                $(div).html(_html);
                $(".liebiao").hide();
                $(".liebiao-detail").show();
            }
          
        },'json');
    }
    function initim(_thisid,_ishttps)
    {
        console.log("_thisid");
        $('.chat_main').html('');
        $(function () {
            var api = TISAPI.New(_Aodianyunim, {tisId: _thisid}, false);
            window.tis = TIS(".chat_main", {
                api: api,
                useSSL:_ishttps,
                name: nickname,
                image: "http://cdn.aodianyun.com/tis/ui/default/img/anonymous.png",  
                generateUserEvent: true,
                template: '',
                onInitUI: onInitUI,
                onLoadHistory: onLoadHistory,
                onReceiveMessage: onReceiveMessage,
                historyPageSize: 100, 
                version: 1.1,
                failure: function (error, when) {
                    if (typeof error != "string") {
                        if (when == "sendMsg" && error.code == 400 && error.error == "instance closed") {
                            alert("TIS实例已关闭");
                            return;
                        }
                    } else {
                    }
                },
                onSendSuccess: function (data) {
                    document.getElementById("chat_bd").scrollTop = document.getElementById("chat_bd").scrollHeight;
                },
                onReconnect: function () {
                },
                onConnect: function () {
                },
                onLoadComponent: function () {
                },
                updateUser: function (total, clientId) {
                    console.log(clientId);
                    $("#onlineNum").html(total);
                }
            });
        });
        
        function onInitUI(container,options) {}
        function onLoadHistory(data, container, faceMap, opts) {
            var list = data.list;
            var length = 0;
            if (list) {
                length = list.length;
            }
            for (var index = length - 1; index >= 0;--index) {
                var item = list[index];
                if (!item.content) continue;
                var msgdata;
                var ended = false;
                try {
                    msgdata = JSON.parse(item.content);
                    msgdata = opts.prepareMessage(msgdata);
                    if(index==0){
                        ended = true;
                    }
                    appendTisMessage(msgdata, 'chat_list', ended);
                } catch (ex) {
                }   
            }
        }
    }
    function onReceiveMessage(data, container, faceMap) {
        var new_msg = {name:data.name,time:data.time,body:data.body};
        if(data.name!=nickname){
            appendTisMessage(new_msg, 'chat_list', false);
        }
        document.getElementById("chat_bd").scrollTop = document.getElementById("chat_bd").scrollHeight;
    }
    $("#chat_send").click(function(){
        var chat_input = $("#chat_input").val().replace(/^\s*|\s*$/g, "");
        console.log(chat_input);
        var send_time = (new Date()).getTime();
        send_time = parseInt(send_time/1000);
        if(chat_input===''){
            return false;
        }else{
            tis.SendMessage(chat_input);
            var data = {name:nickname,time:send_time,body:chat_input};
            appendTisMessage(data, 'chat_self', false);
            $("#chat_input").val('');
            document.getElementById("chat_bd").scrollTop = document.getElementById("chat_bd").scrollHeight;
        }
    })

    $("#chat_input").on('blur', function() {
        window.scroll(0, 0);
    });

    function appendTisMessage(data, style, ended) {
        console.log(data);
        var send_time = timestampToTime(data.time, true);
        var welcome_html = '';
        welcome_html += '<ul class="' + style + '">';
        welcome_html += '	<li class="chat_me">';
        if(style=='chat_self'){
        welcome_html += '		<div class="chat_flex"></div>';
        }
        welcome_html += '		<div class="chat_item">';
        welcome_html += '			<p>' + data.name + '<span>' + send_time + '</span></p>';
        welcome_html += '			<div class="chat_msg">' + data.body + '</div>';
        welcome_html += '		</div>';
        welcome_html += '	</li>';
        welcome_html += '</ul>';
        
        $('.chat_main').append(welcome_html);
        if(ended){
            $('.chat_main').append('<div class="history_message">以上的为历史消息</div>');
            document.getElementById("chat_bd").scrollTop = document.getElementById("chat_bd").scrollHeight;
        }
    }
    			//时间戳转为时间格式
			function timestampToTime(nS, showYMD) {  
				var date = new Date(nS * 1000);
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
				var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
				var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
				
				if(!showYMD){
					return h + m + s;
				}else{
					return Y + M + D + h + m + s;
				}
            }
});