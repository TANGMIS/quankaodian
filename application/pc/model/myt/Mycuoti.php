<?php
namespace app\pc\model\myt;

use basic\ModelBasic;
use think\Db;
use think\Config;
Class Mycuoti extends ModelBasic
{
    public static function getAll($where = array()){
        
        $data=Db::name("tcuoti")->order("id asc")->where("userid",$where["userid"])->paginate((int)$where['limit'])->each(function($item, $key){
          $cate=Db::name("catehome")->where("id",$item["cateid"])->find();
          $item["catename"]=$cate["cname"];
          $item["fix"]=$cate["fix"];
          $item["title"]=Db::name($cate["fix"]."_tque")->where("queId",$item["tqueid"])->value('queText');
          return $item;
        });
        return $data;
    }
    public static function deleteData($where=array())
    {
      $id=Db::name("tcuoti")->where("id",$where["id"])->where("userid",$where["userid"])->delete();
    }


}