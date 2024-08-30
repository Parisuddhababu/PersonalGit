export type DiversionAdminDataRes = {
    location: {
        uuid: string,
        location: string,
    },
    user: null | {
        email: string,
        uuid: string,
        first_name: string,
        last_name: string,
    },
}