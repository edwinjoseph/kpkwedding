import { faker } from '@faker-js/faker';

faker.seed(1);

const unconfirmed = [...new Array(3)].map(() => ({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    canMakeIt: null,
    responded: false,
    dietaryOptions: null,
    createdAt: faker.date.past().getTime(),
    updatedAt: faker.date.past().getTime(),
}));

const attending = [...new Array(22)].map(() => ({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    canMakeIt: true,
    responded: true,
    dietaryOptions: {
        isVegan: faker.datatype.boolean(),
        isVegetarian: faker.datatype.boolean(),
        noNuts: faker.datatype.boolean(),
        noDairy: faker.datatype.boolean(),
        noGluten: faker.datatype.boolean(),
        other: null,
    },
    createdAt: faker.date.past().getTime(),
    updatedAt: faker.date.past().getTime(),
}));

const declined = [...new Array(5)].map(() => ({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    canMakeIt: false,
    responded: true,
    dietaryOptions: null,
    createdAt: faker.date.past().getTime(),
    updatedAt: faker.date.past().getTime(),
}));

export const invites = [
    ...unconfirmed,
    ...attending,
    ...declined,
];

export default invites;
