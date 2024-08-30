export interface Ifaq {
    data:IfaqListData[]
}

export interface IfaqListData {
    question: string,
    answer: string
}

export interface IfaqListMain {
    faq:Ifaq
}