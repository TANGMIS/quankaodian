<?php
namespace app\pc\model\tindex;

use basic\ModelBasic;
use think\Db;
use think\Config;
use think\Cookie;
use app\wap\model\user\User;
use app\pc\model\tindex\Tcollect as collect;
Class Ytquestion extends ModelBasic
{
    public static function getAll($where = array(),$fix){
       
        $dbfix=Config::get('database')['prefix'].$fix;
        $model=Db::name($fix."_tcate")->alias("tc");
        if (isset($where["type"]))$model->where("tl.queTypeId",$where["type"]);
        if (isset($where["cateId"]))$model->where("tc.cateId",$where["cateId"]);
        $data=$model->order("queId desc")
        ->field("tl.CateId,tl.queTypeId,tl.publicQueText,tt.queId,tt.answer,tt.queText,tt.prompt")
        ->join($dbfix."_ytcatelist tl","tc.cateId=tl.cateId")->join($dbfix."_ytque tt","tt.cateListId=tl.cateListId")
        ->paginate((int)$where['limit'])->each(function($item, $key) use(&$fix){

            $types=array("单选题","多选题","判断题","简答题");
            $item['tqueOpt']=Db::name($fix."_ytqueopt")->where("queId",$item["queId"])->select();
            $typearr=Db::name("tquetype")->where("queTypeId",$item["queTypeId"])->find();
            $item['queTypeName']=$typearr["queTypeName"];
            $item['types']=$typearr["types"];
            $item['useranswer']='';
            $uid = User::getActiveUid();
            $cateid=Cookie::get('cateid');
            $fav=collect::getisov(array("userid"=>$uid,"tqueid"=>$item["queId"],"zid"=>$item["CateId"],"cateid"=>$cateid));
            $item["userfav"]=false;
            if($fav>0)
            {
                $item["userfav"]=true;
            }
       
            //$item["fav"]=$fav;
            $item['typename'] = $types[$typearr["types"]];
            return $item;
            
        });
        return $data;
    }
    public static function getinfos($where,$fix)
    {
        $dbfix=Config::get('database')['prefix'].$fix;
        $data=Db::name($fix."_ytque")->alias("tq")->join($dbfix."_tcatelist tc","tq.cateListId=tc.cateListId")->where('queId',$where["id"])->find();
		return $data;
    }
    public static function gettotal($fix)
    {
        $c=Db::name($fix."_ytque")->count();
        return $c;
    }


}