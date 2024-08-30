export interface ICustomiseProductHookProps {
  new_size_id?: string;
  hall_mark_charge?: string;
  diamond_quality_id?: string;
  metal_purity_id?: string;
  metal_type_id?: string;
  color_stone_id?: string;
  stamping_charge?: string;
  remark?: string;
  product_id?: string;
  certify_by_id?: string;
  metal_type?: string;
}

export interface IChangesSize { 
  new_size_id : string;
  product_id: string;
}