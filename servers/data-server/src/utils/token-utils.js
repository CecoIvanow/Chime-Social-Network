import jwt from 'jsonwebtoken';

export function userTokenCreation({ _id, email }) {
    const SECRET = process.env.JWT_SECRET;
    const payload = {
        id: _id.toString(),
        email,
    }

    const token = jwt.sign(payload, SECRET);

    return token;
}