<?php
namespace app\pc\model\tindex;

use basic\ModelBasic;
use think\Db;
use think\Config;
use think\Cookie;
use app\wap\model\user\User;
use app\wap\model\tindex\Tcollect as collect;
Class Tquestion extends ModelBasic
{
    public static function getAll($where = array(),$fix){
       
        $dbfix=Config::get('database')['prefix'].$fix;
        $model=Db::name($fix."_tcate")->alias("tc");
        if (isset($where["type"]))$model->where("tl.queTypeId",$where["type"]);
        if (isset($where["cateId"]))$model->where("tc.cateId",$where["cateId"]);
       
        $data=$model->order("queId desc")
        ->field("tl.CateId,tl.queTypeId,tl.publicQueText,tt.queId,tt.answer,tt.queText,tt.prompt")
        ->join($dbfix."_tcatelist tl","tc.cateId=tl.cateId")->join($dbfix."_tque tt","tt.cateListId=tl.cateListId")
        ->paginate((int)$where['limit'])->each(function($item, $key) use(&$fix){

            $types=array("单选题","多选题","判断题","简答题");
            $item['tqueOpt']=Db::name($fix."_tqueopt")->where("queId",$item["queId"])->select();
            $typearr=Db::name("tquetype")->where("queTypeId",$item["queTypeId"])->find();
            $item['queTypeName']=$typearr["queTypeName"];
            $item['types']=$typearr["types"];
            $item['useranswer']='';
            $cateid=Cookie::get('cateid');
            $uid = User::getActiveUid();
            $fav=collect::getisov(array("userid"=>$uid,"tqueid"=>$item["queId"],"zid"=>$item["CateId"],"cateid"=>$cateid));
            $item["userfav"]=false;
            if($fav>0)
            {
                $item["userfav"]=true;
            }
            $item['typename'] = $types[$typearr["types"]];
            return $item;
            
        });
        return $data;
    }
    public static function getQueTypeNums($cateid,$fix)
    {
        $dbfix=Config::get('database')['prefix'].$fix;
        $data=Db::name($fix."_tcate")->alias("tc")->where("tc.cateId","in",$cateid)->join($dbfix."_tcatelist tl","tc.cateId=tl.cateId")
        ->join($dbfix."_tque tt","tt.cateListId=tl.cateListId")->group("tl.queTypeId")->field("tl.queTypeId,count(*) as num")->select();
  
        return $data;
        //$data=$model->select();
        
        
    }
    public static function getrank($fix,$limit,$idarr)
    {
        $dbfix=Config::get('database')['prefix'].$fix;

        $data=Db::name($fix."_tcate")->alias("tc")->where("tc.cateId","in",$idarr)->join($dbfix."_tcatelist tl","tc.cateId=tl.cateId")
        ->field("tl.CateId,tl.queTypeId,tl.publicQueText,tt.queId,tt.answer,tt.queText,tt.prompt")
        ->join($dbfix."_tque tt","tt.cateListId=tl.cateListId")->limit($limit)->orderRaw('rand()')->select();
        foreach($data as &$item)
        {
            $types=array("单选题","多选题","判断题","简答题");
            $item['tqueOpt']=Db::name($fix."_tqueopt")->where("queId",$item["queId"])->select();
            $typearr=Db::name("tquetype")->where("queTypeId",$item["queTypeId"])->find();
            $item['queTypeName']=$typearr["queTypeName"];
            $item['types']=$typearr["types"];
            $item['useranswer']='';
            $cateid=Cookie::get('cateid');
            $uid = User::getActiveUid();
            $fav=collect::getisov(array("userid"=>$uid,"tqueid"=>$item["queId"],"zid"=>$item["CateId"],"cateid"=>$cateid));
            $item["userfav"]=false;
            if($fav>0)
            {
                $item["userfav"]=true;
            }
            $item['typename'] = $types[$typearr["types"]];
        }
        return $data;
    }
    public static function getinfos($where,$fix)
    {
        $dbfix=Config::get('database')['prefix'].$fix;
        $data=Db::name($fix."_tque")->alias("tq")->join($dbfix."_tcatelist tc","tq.cateListId=tc.cateListId")->where('queId',$where["id"])->find();
        //return Db::getLastSql();
        $data['tqueOpt']=Db::name($fix."_tqueopt")->where("queId",$data["queId"])->select();
		return $data;
    }
    public static function gettotal($fix)
    {
        $c=Db::name($fix."_tque")->count();
        return $c;
    }


}