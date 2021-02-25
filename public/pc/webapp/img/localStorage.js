/**
 * Created with JetBrains WebStorm.
 * User: amoschen
 * Date: 13-1-21
 * Time: 下午7:27
 * To change this template use File | Settings | File Templates.
 */
BizQQWPA.define('wpa.visitor', 'lang.browser,util.log,util.speedReport,util.getJSONP,util.domain,util.pubSub,wpa.filter,wpa.ta,wpa.invite,wpa.wpaMgr,wpa.ta,wpa.kfuin', function(require){
    var invite = require('invite'),
        domain = require('domain'),
        filter = require('filter'),
        getJSONP = require('getJSONP'),
        pubSub = require('pubSub'),
        log = require('log'),
        speedReport = require('speedReport'),
        ta = require('ta'),
        kfuinCahe = require('kfuin'),
        browser = require('browser');

    var CRM_BLOCK_ON_SERVERSIDE = 1;

    var GET_CONFIG_URL = 'https://visitor.crm2.qq.com/cgi/visitorcgi/ajax/wpa_first_heart_beat.php'; //cgi url for getting initiation config in load process

    return function(config){
        var nameAccount = config.nameAccount;

        if(!nameAccount || nameAccount === 'undefined'){
            return;
        }

        //if the nameAccount has been added in wpas, return;
        //check if the nameAccount is in TA's black list
        if(invite.isLoaded(nameAccount) || !filter.TA){
            return;
        }

        var uid, cfg,
            launch = function(uid, cfg){
                if(!uid || !cfg){
                    return;
                }

                if(cfg.block === CRM_BLOCK_ON_SERVERSIDE){
                    return;
                }

                /*根据ua来判断是否是网络爬虫，如果是则直接return*/
                if (browser && browser.ua) {
                    var spiderReg = /spider|bot|^\s*$/;
                    if (spiderReg.test(browser.ua)) {
                        return;
                    }
                }

                if(filter.CRM){
                    cfg.di = config.di;
                    cfg.kfuin = config.kfuin;
                    log(nameAccount + ' try launch slave');
                    invite.load(nameAccount, uid, cfg);
                }
            };

        pubSub.one('TA.loaded', function(data){
            uid = data;
            launch(uid, cfg);
        });

        pubSub.one('Invite.first', function(data){
            cfg = data;
            launch(uid, cfg);
        });

        //plugin TA
        ta(nameAccount, domain.topDomain, function(uid){
            pubSub.pub('TA.loaded', uid);
        });

        //get config && register site
        var opts = {
            nameAccount: nameAccount,
            dm: domain.topDomain,
            title: document.title,
            url: location.href.split('://')[1].split('?')[0] //no protocol
        };

        getJSONP(GET_CONFIG_URL, opts, function(cfg){
            pubSub.pub('Invite.first', cfg);
        });

        // set kfuin cache
        config.kfuin && kfuinCahe.set(nameAccount, config.kfuin);
    };
});/**
 * @fileOverview
 * @author amoschen
 * @version
 * Created: 12-8-28 上午11:27
 */
BizQQWPA.define('wpa.filter', 'util.domain', function(require){
    var TA_BLACKLIST = '',
        CRM_BLACKLIST = 'qq.com,pengyou.com,qzoneapp.com,nipic.com,docin.com,51zxw.net,2155.com,xd.com,yto.net.cn,c-c.com,27.cn,05wan.com,alivv.cn,gogo.com,doctorjob.com.cn,emoney.cn,m4.cn,chinaktv.net,yk988.com,bangkaow.com,wsxsp.com,55tools.com,youxi518.com',
        CRM_WHITELIST = 'b.qq.com,sales.b.qq.com,guilin.house.qq.com,ta.qq.com,hn.qq.com,nantong.house.qq.com';

    var domain = require('domain');

    return {
        TA: function(){
            //in case of ip
            var dm = domain.topDomain,
                IPReg = /^[12]?\d?\d\.[12]?\d?\d\.[12]?\d?\d\.[12]?\d?\d$/,
                LocalReg = /^localhost$/,
                previewPageReg = /^wpa\.b\.qq\.com/;

            return TA_BLACKLIST.indexOf(dm) === -1 && !IPReg.test(dm) && !LocalReg.test(dm) && !previewPageReg.test(domain.domain);
        }(),

        CRM: function(){
            //match white list
            try{
                var reg = new RegExp('(^|,)' + domain.domain);
                if(reg.test(CRM_WHITELIST)){
                    return true;
                }

                //check black list
                var dm = domain.topDomain,
                    dmReg = new RegExp('(^|,)' + dm),
                    IPReg = /^[12]?\d?\d\.[12]?\d?\d\.[12]?\d?\d\.[12]?\d?\d$/, //IP check
                    LocalReg = /^localhost$/; //localhost check

                return !dmReg.test(CRM_BLACKLIST) && !IPReg.test(dm) && !LocalReg.test(dm);
            } catch(e){}
        }()
    };
});/**
 * @fileOverview
 * @author amoschen
 * @version
 * Created: 12-8-27 下午8:32
 */
BizQQWPA.define('wpa.invite', 'util.log,util.getJSONP,util.proxy,util.domain,util.blockStorage,util.taskMgr,wpa.wpaMgr', function(require){
    //task execute gaps
    var MASTER_MONITOR_GAP = 2000, //time gap that slave monitors master
        INVITE_MONITOR_GAP = 1000, //time gap that slave monitors invite state
        MASTER_HEATBEAT_GAP = 2000, //mater's heartbeat gap
        SLAVE_HEARTBEAT_GAP = 2000, //slave's heartbeat gap
        SERVER_MONITOR_GAP_MIN = 5000, //the floor gap that master monitors server
        SERVER_MONITOR_GAP_MAX = 15000, //the ceil gap that master monitors server
        SERVER_MONITOR_SLEEPCHECK_GAP = 3600000, //the gap that before master checking web page's residence time, if bigger than the gap, then stop server monitor and sleep
        SERVER_MONITOR_SLEEPING_GAP = 1000; //the gap master checking web page's activity, if alive again, then recover server monitor

    //kfuin cookie keys
    var INVITE_SIGNAL = 'is', //invite state's signal
        INVITE_KFEXT = 'ik', //invite kfext
        INVITE_MSG = 'msg', //invite msg
        MASTER_HEARTBEATS = 'mh', //master's last heartbeat time(in timestamp)
        MASTER_ID = 'mid', //master's id, for recover and de-emphasis
        SLAVE_IDS = 'slid'; //slave's id, prefix for slave id list and slave heartbeat

    //cookie values
    var INVITE_SIGNAL_UNINVITED = '0', //uninvite state
        INVITE_SIGNAL_INVITE = '1', //inviting state
        INVITE_SIGNAL_INVITED = '2', //invited state
        INVITE_KFEXT_AUTO = '0', //automatic diversion
        MASTER_HEARTBEATS_ERROR = '-1', //master heartbeat's value when error occurs
        DATA_SEPERATOR = '|'; //seperator for data

    //CGIs
    var HEARTBEAT_URL = 'https://visitor.crm2.qq.com/cgi/visitorcgi/ajax/wpa_heart_beat.php', //cgi url for user's heartbeat report and getting invite state
        CONFIRM_AUTO_INVITE_URL = 'https://visitor.crm2.qq.com/cgi/visitorcgi/ajax/auto_invite.php'; //cgi url for confirming raising an auto invite

    //CGI code
    var RESULT_SUCCESS = 0, //success code for all cgi
        INVITE_STATE_UNINVITED = '0', //uninvited state value
        INVITE_STATE_INVITE = '1', //inviting state value
        INVITE_STATE_INVITED = '2', //invited state value
        AUTO_INVITE_TRUE = 1; //value that confirms auto invite

    var WPA_TYPE_TA_INVITE_ONLY = '0', //no wpa will be created, TA & invite logic only
        WPA_TYPE_NORMAL = '1', //normal wpa, with TA & invite logic
        WPA_TYPE_LINK = '2', //for forumn & weibo, a link
        SESSION_VERSION_TA = '4', //session version for wpa with TA, seperated from user customed wpa
        WPA_STYLE_TYPE_INVITE = '20', //invite wpa's style type
        APPOINTED_TYPE_AUTO = '0', //appointed type of automatic diversion
        APPOINTED_TYPE_KFEXT = '1', //appointed type of appointed kfext
        APPOINTED_TYPE_GROUP = '2', //appointed type of appointed group
        APPOINTED_TYPE_AUTO_INVITE = '4', //appointed type of auto invite
        APPOINTED_TYPE_INVITE = '5'; //appointed type of invite


    var WPA_FLOAT_TYPE_FIXED = '0', //wpa style: float style fixed
        WPA_FLOAT_POSITION_Y_CENTER = '1', //wpa style: y-coordinate position, center
        WPA_FLOAT_POSITION_X_CENTER = '1', //wpa style: x-coordinate position, center
        IS_INVITE_WPA_FALSE = '0', //param that seperate wpa conversations, false means normal wpa conversation
        IS_INVITE_WPA_TRUE = '1'; //param that seperate wpa conversations, invite wpa conversation

    var log = require('log'),
        getJSONP = require('getJSONP'),
        proxy = require('proxy'),
        domain = require('domain'),
        blockStorage = require('blockStorage'),
        taskMgr = require('taskMgr'),
        wpaMgr = require('wpaMgr');

    var Slave = function(nameAccount, uid, cfg){
        //Slave initiation
        this.nameAccount = nameAccount;
        this.uid = uid;
        this.config = cfg;
        this.genID();
        this.storage = blockStorage(nameAccount);

        //monitor
        this.monitors = {
            master: taskMgr.newTask(proxy(this, this.masterMonitor), MASTER_MONITOR_GAP).run(),
            invite: taskMgr.newTask(proxy(this, this.inviteMonitor), INVITE_MONITOR_GAP).run()
        };

        //report slave heart beat
        this.heartBeat = taskMgr.newTask(proxy(this, this.heartBeatProcess), SLAVE_HEARTBEAT_GAP).run();

        //set slave active
        this.setActive();

        //bind focus
        window.onfocus = proxy(this, this.setActive);

        log('slave ' + this.id + ' launched!');
    };

    Slave.prototype = {
        genID: function(){
            //pattern: (uin)slid_xxx_xx
            this.id = 'slid_' + +new Date()%1000 + '_' + Math.round(Math.random() * 100);
        },
        masterMonitor: function(){
            if(masters[this.nameAccount]){
                return;
            }
            log('monitoring mater state');
            var lastMasterHeartbeat = this.storage.get(MASTER_HEARTBEATS) || 0,
                gap = +new Date() - parseInt(lastMasterHeartbeat);
            log('gap of master is ' + gap);
            if(gap > 3 * MASTER_HEATBEAT_GAP){
                this.recoverMaster();
            }
        },
        recoverMaster: function(){
            masters[this.nameAccount] = new Master(this.nameAccount, this.uid, this.config);

            log('recover master by slave ' + this.id);
        },
        inviteMonitor: function(){
            if(this.isInvited()){
                this.kill();
            } else if(this.isInviting()){
                if(this.isActive()){
                    this.invite();
                }
            }

            log('slave ' + this.id + ' monitoring invite state');
        },
        kill: function(){
            //stop tasks
            this.monitors.invite.drop();
            this.heartBeat.drop();

            //recycle storage
            var storage = this.storage,
                keys = [this.id];
            for(var i=0, key; key=keys[i++];){
                storage.del(key);
            }

            log('slave ' + this.id + ' killed');
        },
        invite: function(){
            var kfext = this.storage.get(INVITE_KFEXT);
            //create invite view
            var params = {
                wty: WPA_TYPE_NORMAL,
                nameAccount: this.nameAccount,
                kfuin: this.config.kfuin,
                type: WPA_STYLE_TYPE_INVITE,
                aty: kfext ? (kfext === INVITE_KFEXT_AUTO ? APPOINTED_TYPE_AUTO_INVITE : APPOINTED_TYPE_INVITE) : APPOINTED_TYPE_AUTO_INVITE,
                a: kfext || '',
                iv: IS_INVITE_WPA_TRUE,
                fsty: WPA_FLOAT_TYPE_FIXED,
                fposX: WPA_FLOAT_POSITION_X_CENTER,
                fposY: WPA_FLOAT_POSITION_Y_CENTER,
                sv: SESSION_VERSION_TA,
                uid: this.uid,
                dm: domain.topDomain,
                msg: this.storage.get(INVITE_MSG)
            };

            wpaMgr.invite(params, this.config.di);

            this.storage.set(INVITE_SIGNAL, INVITE_SIGNAL_INVITED);

            log('invited by slave ' + this.id);
        },
        heartBeatProcess: function(){
            var storage = this.storage,
                ids = storage.get(SLAVE_IDS);

            if(!ids){
                storage.set(SLAVE_IDS, this.id + '|');
            } else if( ids.indexOf(this.id + '|') === -1){
                storage.set(SLAVE_IDS, this.id + '|' + ids);
            }

            storage.set(this.id, +new Date());
        },
        setActive: function(){
            var storage = this.storage,
                ids = storage.get(SLAVE_IDS) || '',
                sign = this.id + DATA_SEPERATOR;

            if(ids.indexOf(this.id) > -1){
                ids = ids.replace(sign, '');
            }
            ids += sign;

            storage.set(SLAVE_IDS, ids);
        },
        isActive: function(){
            var slaves = this.storage.get(SLAVE_IDS);
            if(!slaves){
                return false;
            }
            return slaves.substr(0, slaves.length-1).split(DATA_SEPERATOR).pop() === this.id;
        },
        isInvited: function(){
            return this.storage.get(INVITE_SIGNAL) === INVITE_SIGNAL_INVITED;
        },
        isInviting: function(){
            return this.storage.get(INVITE_SIGNAL) === INVITE_SIGNAL_INVITE;
        }
    };

    var masters = {};

    var Master = function(nameAccount, uid, cfg){
        //Master initiation
        this.nameAccount = nameAccount;
        this.uid = uid;
        this.config = cfg;
        this.storage = blockStorage(nameAccount);
        this.genID();
        this.sleep = false;
        this.heartBeatURl = cfg.hbDomain || HEARTBEAT_URL;

        //report master heart beat
        this.storage.set(MASTER_ID, this.id);
        this.heartBeatProcess();
        this.heartBeat = taskMgr.newTask(proxy(this, this.heartBeatProcess), MASTER_HEATBEAT_GAP).run();

        //get config & start monitor
        this.initWithConfig();

        log('master launched!');
    };

    Master.prototype = {
        genID: function(){
            this.id = +new Date()%1000 + '_' + Math.round(Math.random() * 100);
        },
        setInviteState: function(signal, kfext, msg){
            if(signal === INVITE_SIGNAL_INVITE){
                this.storage.set(INVITE_KFEXT, kfext);
                this.storage.set(INVITE_MSG, msg);
            }

            this.storage.set(INVITE_SIGNAL, signal);
        },
        isInvited: function(){
            var invited = this.storage.get(INVITE_SIGNAL) === INVITE_SIGNAL_INVITED;
            if(invited){
                this.recycle();
                this.isInvited = function(){
                    return true;
                }
            }
            return invited;
        },
        initWithConfig: function(){
            /*
             r	错误码，0-成功，其他-失败
             isAuto	是否开启自动邀请的开关，0-关、1-开
             autoTime	自动邀请的时间，超过该时间且开关开的情况下，发起邀请
             gap	下次心跳的时间间隔，如果为空使用默认时间
             inviteState	是否有主动邀请， 0-未邀请、1-发起邀请、2-已邀请
             */
            var cfg = this.config;

            //fail getting config data
            if(cfg.r !== RESULT_SUCCESS){ //shouldn't retry, in case of avalanche effect
                this.storage.set(MASTER_HEARTBEATS, MASTER_HEARTBEATS_ERROR);
                return;
            }

            //set auto invite
            if(cfg.isAuto === AUTO_INVITE_TRUE){
                this.storage.set(INVITE_MSG, cfg.autoMsg);
                this.autoInviteTimer = setTimeout(proxy(this, function(){
                    this.autoInvite();
                }), cfg.autoTime * 1000);
            }

            //launch server & slave monitors
            this.monitors = {
                slave: taskMgr.newTask(proxy(this, this.slaveMonitor), SLAVE_HEARTBEAT_GAP).run(),
                server: taskMgr.newTask(proxy(this, this.serverMonitor), SERVER_MONITOR_GAP_MIN).run(),
                sleep: taskMgr.newTask(proxy(this, this.sleepMonitor), SERVER_MONITOR_SLEEPCHECK_GAP).run()
            };

            log('master inited with config');
        },
        autoInvite: function(){
            //confirm auto invite
            //local confirm
            if(this.isInvited()){
                return;
            }

            //remote confirm
            var opt = {
                    nameAccount: this.nameAccount,
                    //kfext: this.kfext,
                    uid: this.uid
                };

            // pause heartbeat in case of overwriting invite state while auto-inviting
            // if heartbeat before a slave get invite state, it will miss the auto-invite
            var serverMonitor = this.monitors.server;
            serverMonitor.pause();

            getJSONP(CONFIRM_AUTO_INVITE_URL, opt, proxy(this, function(rs){
                if(rs.r !== RESULT_SUCCESS){
                    // auto-invite ends, recover heartbeat
                    serverMonitor.run();
                    return;
                }

                if(!this.isInvited()){
                    this.setInviteState(INVITE_SIGNAL_INVITE, INVITE_KFEXT_AUTO, this.storage.get(INVITE_MSG));

                    // delay 5s to recover heartbeat, make sure auto-invite ends
                    taskMgr.once(function(){
                        serverMonitor.run();
                    }, 5000).run();
                }
            }));
        },
        ajustServerMonitorGap: function(time){
            this.monitors.server.setGap(Math.min(Math.max(SERVER_MONITOR_GAP_MIN, time), SERVER_MONITOR_GAP_MAX));
        },
        serverMonitor: function(){
            var inviteSignal = this.storage.get(INVITE_SIGNAL);
            if(this.sleep){
                return;
            }

            var opt = {
                nameAccount: this.nameAccount,
                //kfext: this.kfext,
                uid: this.uid
            };

            //if inviting or invited, tell server to do less
            if(inviteSignal === INVITE_SIGNAL_INVITE){
                opt['inviteState'] = INVITE_STATE_INVITE;
            }

            if(inviteSignal === INVITE_SIGNAL_INVITED){
                opt['inviteState'] = INVITE_STATE_INVITED;
            }

            getJSONP(this.heartBeatURl, opt, proxy(this, function(rs){
                if(rs.r !== RESULT_SUCCESS){
                    return;
                }

                //automatictly ajust server monitor gap
                if(rs.gap){
                    this.ajustServerMonitorGap(rs.gap * 1000);
                }

                if(rs.inviteState === INVITE_STATE_UNINVITED){
                    return;
                }

                if(rs.inviteState === INVITE_STATE_INVITE){
                    this.setInviteState(INVITE_SIGNAL_INVITE, rs.kfext, rs.inviteMsg);
                    return;
                }

                if(rs.inviteState === INVITE_STATE_INVITED){
                    this.setInviteState(INVITE_SIGNAL_INVITED);
                }
            }));
        },
        slaveMonitor: function(){
            if(this.isInvited()){
                this.monitors.slave.drop();
            }

            var storage = this.storage,
                slaves = storage.get(SLAVE_IDS);
            if(!slaves) {
                return;
            }

            slaves = slaves.split(DATA_SEPERATOR);
            var aliveSlaves = '',
                time = +new Date(),
                lastSlaveHeartbeat, slave, gap;
            //check all slaves' state
            for(var i=0; slave=slaves[i++];){
                log('monitoring slave ' + slave + ' state');
                lastSlaveHeartbeat = storage.get(slave) || 0;
                gap = time - parseInt(lastSlaveHeartbeat);
                log('gap of slave ' + slave + ' is ' + gap);
                if(gap > 3 * SLAVE_HEARTBEAT_GAP){
                    //remove dead slave
                    storage.del(slave);
                    log('clear slave ' + slave + ' in storage');
                } else {
                    aliveSlaves += slave + DATA_SEPERATOR;
                }
            }

            storage.set(SLAVE_IDS, aliveSlaves);
        },
        sleepMonitor: function(){
            var slaves = this.storage.get(SLAVE_IDS) || '',
                activeSlave = slaves.substr(0, slaves.length-1).split(DATA_SEPERATOR).pop();
            if(this.sleep){
                //when sleeping
                //if new slave appears, wake up
                if(this.activeSlave !== activeSlave){
                    this.activeSlave = activeSlave;
                    this.sleep = false;
                    this.monitors.sleep.setGap(SERVER_MONITOR_SLEEPCHECK_GAP);
                }
            } else {
                //when sleeping
                //if no new slave appear, sleep
                if(this.activeSlave === activeSlave){
                    this.sleep = true;
                    this.monitors.sleep.setGap(SERVER_MONITOR_SLEEPING_GAP);
                } else {
                    this.activeSlave = activeSlave;
                }
            }
        },
        kill: function(){
            masters[this.nameAccount] = undefined;

            //stop tasks
            if( this.monitors ){
                this.monitors.server.drop();
                this.monitors.slave.drop();
                this.heartBeat.drop();
                clearTimeout(this.autoInviteTimer);
            }

            log('master killed');
        },
        recycle: function(){
            //recycle storage
            var storage = this.storage,
                keys = [INVITE_KFEXT, INVITE_MSG];
            for(var i=0, key; key=keys[i++];){
                storage.del(key);
            }

            log('storage recycled');
        },
        heartBeatProcess: function(){
            var storage = this.storage;

            if(storage.get(MASTER_ID) !== this.id){
                this.kill();
                return false;
            }
            this.storage.set(MASTER_HEARTBEATS, +new Date());
        }
    };

    // factory
    var slaves = {};

    return {
        load: function(nameAccount, uid, cfg){
            if(this.isLoaded(nameAccount)){
                log(nameAccount + ' slave already running');
                return;
            }

            var slave = new Slave(nameAccount, uid, cfg);
            slaves[nameAccount] ? slaves[nameAccount].push(slave) : slaves[nameAccount] = [slave];
        },

        isLoaded: function(nameAccount){
            return typeof slaves[nameAccount] !== 'undefined';
        }
    };
});/**
 * @fileOverview
 * @author amoschen
 * @version
 * Created: 12-8-27 下午8:51
 */
BizQQWPA.define('util.blockStorage', 'util.sessionStorage', function(require){
    var sessionStorage = require('sessionStorage');

    //block storage, use block index as prefix
    var Storage = function(blockIndex){
        this.blockIndex = blockIndex;
    };

    //static get method, without block index
    Storage.get = function(name){
        return sessionStorage.get(name);
    };

    //static set method, without block index
    Storage.set = function(name, value){
        return sessionStorage.set(name, value);
    };

    //static del method, without block index
    Storage.del = function(name){
        return sessionStorage.del(name);
    };

    //static find method, without block index
    Storage.find = function(){
        return sessionStorage.find.apply(sessionStorage, arguments);
    };

    //methods within block storage
    Storage.prototype = {
        set: function(name, value) {
            return sessionStorage.setItem(this.blockIndex + name, value);
        },
        get: function(name) {
            return sessionStorage.getItem(this.blockIndex + name);
        },
        del: function(name) {
            return sessionStorage.removeItem(this.blockIndex + name);
        }
    };

    return factory = function(kfuin){
        return new Storage(kfuin);
    }
});/**
 * Created with JetBrains WebStorm.
 * User: honsytshen
 * Date: 13-9-9
 * Time: 下午7:45
 * To change this template use File | Settings | File Templates.
 */
BizQQWPA.define('util.sessionStorage', 'util.localStorage,util.cookie', function(require) {
    var localStorage = require('util.localStorage'),
        cookie = require('util.cookie');

    //variable to check whether the session is alive
    var SESSION_STORAGE_PRE = 'IESESSION';

    /**
     * get the domain aliveStatus
     * @return {Boolean}
     */
    var getAliveStatus = function() {
            return !!cookie.get(SESSION_STORAGE_PRE);
        },

        /**
         * set the domain aliveStatus
         * @param {String} value
         */
        setAliveStatus = function(value) {
            cookie.set(SESSION_STORAGE_PRE, value, null, '/');
        },

        /**
         * When this domain was dead, we clear all item in localStorage
         * which is under this domain
         */
        clear = function() {
            var pattern = new RegExp('^' + SESSION_STORAGE_PRE + '[\\S]+$'),
                queue = [];

            for(var i=0; i < localStorage.length; i++) {
                if(localStorage.key(i).match(pattern)) {
                    queue.push(localStorage.key(i));
                }
            }

            while(queue.length) {
                localStorage.removeItem(queue[0]);
                queue.shift();
            }
        };

    if(!getAliveStatus()) {
        // set status to alive
        setAliveStatus('alive');

        // clear expired session data
        clear();
    }

    return {
        /**
         * @method setItem
         * Set a key-value item in localStorage
         * @param {String} key
         * @param {String} value
         */
        setItem: function(key, value){
            localStorage.setItem(SESSION_STORAGE_PRE + key, value);
        },

        /**
         * @method getItem
         * get a key-value item in localStorage which is in this domain
         * @param {String} key
         * @return {String}
         */
        getItem: function(key){
            return localStorage.getItem(SESSION_STORAGE_PRE + key);
        },

        /**
         * @method removeItem
         * remove a key-value item in localStorage which is in this domain
         * @param {String} key
         */
        removeItem: function(key){
            localStorage.removeItem(SESSION_STORAGE_PRE + key);
        },

        clear: clear
    }
});
/**
 * @fileOverview
 * @author amoschen
 * @version
 * Created: 13-8-27 下午7:39
 */
BizQQWPA.define('util.localStorage', 'util.cookie,lang.trim', function(require){
    var Cookie = require('util.cookie'),
        trim = require('lang.trim');

    var COOKIE_PREFIX = 'IELS';

    // set expires to 100 years to fake permanent storage
    var EXPIRES = 3153600000000;

    var doc = document,

        commonPattern = new RegExp( '(?:^|[ ;])' + COOKIE_PREFIX + '[^=]+=([^;$])' ),

        keyPattern = function( key ){
            return COOKIE_PREFIX + key;
        },

        explore = function( callback ){
            var attributes = doc.cookie.split(';'),
                i = 0,
                length = attributes.length,
                items = [],
                match;

            if( callback ){
                for(; i<length; i++){
                    if( match = commonPattern.exec( attributes[i] ) ){
                        items.push( match[1] );
                        callback( match[1] );
                    }
                }
            } else {
                for(; i<length; i++){
                    ( match = commonPattern.exec( attributes[i] ) ) && items.push( match[1] );
                }
            }

            return items;
        };

    /**
     * LocalStorage with compatible solution for IE
     * use cookie as IE solution
     * user data in IE, because of secure concern, is limited to same dir which is not suitable for common uses
     * Cautions:
     *  Storage events haven't been add to compatible solution
     *  Non-IE browser counts on window.localStorage only, it means this tool is useless to those old non-IE browsers
     * @class localStorage
     * @namespace util.localStorage
     * @module util
     */
    return window.localStorage || {
        /**
         * The number of key/value pairs currently present in the list associated with the localStorage.
         * @property length
         * @static
         */
        length: explore().length,

        /**
         * Get the value of the nth key in the localStorage list
         * @method key
         * @static
         * @param {Number} index Index of key
         * @return {String | Null}
         */
        key: function(index){
            return explore()[index] || null;
        },

        /**
         * Get the current value associated with the given key.
         * @method getItem
         * @static
         * @param {String} key
         * @return {String | Null}
         */
        getItem: function(key){
            return Cookie.get( keyPattern( key ) );
        },

        /**
         * Set ( add/update ) value of the given key
         * If it couldn't set the new value, the method must throw a QuotaExceededError exception.
         * Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.
         * @method setItem
         * @static
         * @param {String} key
         * @param {String} value
         */
        setItem: function(key, value){
            Cookie.set( keyPattern( key ), value, null, '/', EXPIRES );
        },

        /**
         * Remove the key/value pair with the given key
         * @method removeItem
         * @static
         * @param {String} key
         */
        removeItem: function(key){
            Cookie.del( key );
        },

        /**
         * Empty all key/value pairs
         * @method clear
         * @static
         */
        clear: function(){
            explore( function( item ){
                Cookie.del( trim( item.split('=')[0] ) );
            } );
        }
    };
});