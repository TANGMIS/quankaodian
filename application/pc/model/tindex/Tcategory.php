<?php
namespace app\pc\model\tindex;

use basic\ModelBasic;
use think\Db;
use think\Config;
Class Tcategory extends ModelBasic
{
    public static function getAll($where = array(),$fix){
       
        $data= Db::name($fix."_tcate")->where('faId',$where['parentid'])->order('faId asc')->paginate((int)$where['limit'])
        ->each(function($item, $key) use(&$fix){
            $dbfix=Config::get('database')['prefix'].$fix;
            $item["nums"]=Db::name($fix."_tcate")->alias("tc")->where("tc.cateId",$item["cateId"])->join($dbfix."_tcatelist tl","tc.cateId=tl.cateId")
            ->join($dbfix."_tque tt","tt.cateListId=tl.cateListId")->count();
            //if($item["nums"]<=0)return;
            $item["son"]=Db::name($fix."_tcate")->where('faId',$item['cateId'])->order('ord asc')->select(); 
            return $item;
        });

        return $data;
    }
    public static function getalltype($fix)
    {
        $data=Db::name($fix."_tcatelist")->alias("tc")->join("tquetype tq","tc.queTypeId=tq.queTypeId")->group("tq.queTypeId")->select();
        return $data;
    }
    public static function getAllarr($where=array(),$fix)
    {
        $data= Db::name($fix."_tcate")->field("cateId,cateName,faId,ord,status")->order('ord asc')->select(); 
        return $data;
    }
    public static function checktable($fix)
    {
        $dbfix=Config::get('database')['prefix'];
        $exist=Db::query("show tables like '".$dbfix.$fix."_tCate'");
        return $exist;
    }
    /*

    */
    public static function getinfos($id,$fix)
    {
        $data=Db::name($fix."_tcate")->where('cateId',$id)->find();;
		return $data;
    }

}