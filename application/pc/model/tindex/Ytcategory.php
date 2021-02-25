<?php
namespace app\pc\model\tindex;

use basic\ModelBasic;
use think\Db;
use think\Config;
Class Ytcategory extends ModelBasic
{

    public static function getAll($where = array(),$fix){
       
        $data= Db::name($fix."_ytcate")->where('faId',$where['parentid'])->where("proType",$where['proType'])->order('ord asc')
        ->paginate((int)$where['limit'])->each(function($item, $key) use(&$fix){
            $dbfix=Config::get('database')['prefix'].$fix;
            $item["nums"]=Db::name($fix."_ytcate")->alias("tc")->where("tc.cateId",$item["cateId"])->join($dbfix."_ytcatelist tl","tc.cateId=tl.cateId")
                            ->join($dbfix."_ytque tt","tt.cateListId=tl.cateListId")->count();
            //$item['off_num'] =  Db::name($fix."_ytcate")->where(['faId' => $item['cateId']])->count();
            return $item;
        });

        return $data;
    }
    public static function getalltype($fix)
    {
        $data=Db::name($fix."_tcatelist")->alias("tc")->join("tquetype tq","tc.queTypeId=tq.queTypeId")->group("tq.queTypeId")->select();
        return $data;
    }
    public static function getAllarr($where = array(),$fix)
    {
        $data= Db::name($fix."_ytcate")->where('faId',$where['parentid'])->where("proType",$where['proType'])->order('ord asc')->select();
        return $data;
    }
    /*

    */
    public static function getinfos($id,$fix)
    {
        $data=Db::name($fix."_ytcate")->where('cateId',$id)->find();;
		return $data;
    }

}