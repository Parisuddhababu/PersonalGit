export type PaginationParamsSuggestion= {
    limit : number
    page : number
    sortBy : string
    sortOrder : string
    suggestion: string,
   
    createdBy: string,
    status: number | null ,
    categoryId:number| null
}
export type FilterSuggestionProps = {
    suggestion: string,
   
    createdBy: string,
    status:string  ,
    categoryId:string

}


export type CategoryDrpDataArr={
  id:number
  category_name:string
}
export type SuggestionProps = {
  onSearchSuggestion : (value : FilterSuggestionProps) => void
  clearSelectionSuggestion:()=>void
}

export type DeleteSuggestionProps = {
  onClose: () => void
  deleteSuggestion: () => void
}
export type SuggestionChangeProps = {
  onCloseSuggestion: () => void
  changeSuggestionStatus: (status,note) => void
  show:boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data:any
}
type SuggestionChangeProps = {
  onClose: () => void;
  changeSuggestionStatus: (status: number, note: string) => void;
}