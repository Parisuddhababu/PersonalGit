
export type FaqChangeProps = {
    onClose: () => void
    changeFaqStatus: () => void
}

export type FaqDeleteProps = {
    onClose: () => void
    deleteFaqData: () => void
}
export type RoleEditProps = {
    isRoleModelShow: boolean
    onHandleChange?: React.ChangeEventHandler<HTMLInputElement>
    onSubmitRole: () => void  
    onClose?: () => void
    roleVal : string 
    isRoleEditable : boolean
    roleObj : roleData
}
export type FaqTopicData={
faqTopics:{
    data:FaqTopicDataArr[]
}
}

  export type FaqTopicDataArr={

  id:number,
  name:string
  }
 