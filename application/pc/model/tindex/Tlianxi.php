<?php
namespace app\pc\model\tindex;

use basic\ModelBasic;
use think\Db;
use think\Config;
Class Tlianxi extends ModelBasic
{
    public static function getAll($where=array())
    {
        $c=Db::name("tlianxi")->where("userid",$where["userid"])->where("cateid",$where["cateid"])->where("pid",0)->select();
        return $c;
    }
    public static function gettotal($where)
    {
       $count= Db::name("tlianxi")->where("userid",$where["userid"])->where("cateid",$where["cateid"])->where("pid",0)->count();
       return $count;
    }
    public static function insertdata($data){
        $id=Db::name("tlianxi")->insertGetId($data);
        return $id;
    }
    public static function addtypeno($data)
    {
        $id=Db::name("tlianxi_typeno")->insertGetId($data);
        return $id;
    }
    public static function gettypeno($where=array()){
        $data=Db::name("tlianxi_typeno")->where("lianxiid",$where["id"])->find();
        return $data;
    }
    public static function getlisttque($userid,$cateid,$typeno,$pid)
    {
        $list1=$typeno;
        $list2=$typeno-3;
        $list3=$typeno-1;
 
        $sql="select * from eb_tlianxi where userid=$userid and cateid=$cateid and (pid=$pid or id=$pid) and typeno in($list1,$list2,$list3)";
        $tquedata=Db::query($sql);

        return $tquedata; 
    }
    public static function updatetypeno($typeno,$userid,$lianxiid){
        Db::name("tlianxi_typeno")->where("userid",$userid)->where("lianxiid",$lianxiid)
        ->update(array("typeno"=>$typeno,"updatetime"=>time()));
    }
    public static function deletedata($id)
    {
        Db::name("tlianxi")->where("id",$id)->delete();
        Db::name("tlianxi_typeno")->where("lianxiid",$id)->delete();
        Db::name("tlianxi")->where("pid",$id)->delete();

    }

}