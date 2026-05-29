import { ProductAttributes } from "../models/Product";
import { UserAttributes } from "../models/User";

export const getRegisterUserFormattedBody = (user: UserAttributes): UserAttributes => {
    const { firstName, lastName, email } = user;
    user['firstName'] = firstName.trim().charAt(0).toUpperCase() + firstName.slice(1);
    user['lastName'] = lastName.trim().charAt(0).toUpperCase() + lastName.slice(1);
    user['email'] = email.trim();
    return user;
}

export const getAddProductFormattedBody = (product: ProductAttributes): ProductAttributes => {
    const { name, category } = product;
    product['name'] = name.trim().charAt(0).toUpperCase() + name.slice(1);
    product['category'] = category.trim().toUpperCase();
    return product;
}