import { LoggedInUser } from "@/types/graphql/pages"

export type UserType = 'influencer' | 'brand-influencer' | 'brand'

export type CommonStateType = {
    loading: boolean
    landingPage: boolean | undefined
    headerMenu: boolean
    userDetails?: LoggedInUser,
    insightId?: string
    userType: UserType
    isWhiInfluencer?: boolean
    brandName?: string,
    isUserHaveActivePlan?: boolean
    openLandingPageForm: boolean,
    showLandingPagePlans: boolean,
}

export type CommonSliceTypes = {
    common: CommonStateType
}