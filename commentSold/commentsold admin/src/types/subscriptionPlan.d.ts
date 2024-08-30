export type SubscriptionForm = {
    planTitle: string,
    planDescription: string,
    noOfSessions: number | string,
    planPrice: number | string,
    planFeatures: {
        isActive: boolean,
        name: string
    }[],
    orderNo?: number | string;
    status: string | number;
};