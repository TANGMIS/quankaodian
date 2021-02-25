<?php
namespace app\pc\model\tindex;

use basic\ModelBasic;
use think\Db;
Class Tmenu extends ModelBasic
{
    public static function getAll($where = array()){
        $model = new self;
        foreach ($where as $key => $value) {
            switch ($key) {
                case 'cateid':
                    $model = $model->where('cateid',$where['cateid']);
                case 'kehuduan':
                    $model = $model->where('kehuduan',$where['kehuduan']);
            }
        }
        $model->where("status",'1');
        $data=$model->order('ord asc')->page(1,(int)$where['limit'])->field("id,ctitle,curl,cimg")->select();
       // $list = count($data) ? $data->toArray() : [];
        
        return $data;
    }
}