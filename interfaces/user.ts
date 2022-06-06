
export interface IUser {
    _id         : string;
    name        : string;
    email       : string;
    password    : string;
    picture     : string;
    rol         : string;
    status      : boolean;
    google      : boolean;
    credential  : string;

    // timestamps
    createdAt : string,
    updatedAt : string,
}