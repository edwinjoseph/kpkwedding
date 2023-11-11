export const findByClientUserName = (dbUser: { first_name: string; last_name: string; }) =>
    (clientUser: { firstName: string; lastName: string; }) =>
        clientUser.firstName.toLowerCase() === dbUser.first_name.toLowerCase() && clientUser.lastName.toLowerCase() === dbUser.last_name.toLowerCase()

