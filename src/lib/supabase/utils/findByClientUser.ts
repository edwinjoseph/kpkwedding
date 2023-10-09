export const findByClientUserName = (dbUser: { first_name: string; last_name: string; }) =>
    (clientUser: { firstName: string; lastName: string; }) =>
        clientUser.firstName === dbUser.first_name && clientUser.lastName === dbUser.last_name

