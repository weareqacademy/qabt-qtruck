import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser {
    name: string;
    instagram: string;
    password: string;
}

const schema = new Schema<IUser>({
    name: { type: String, required: true },
    instagram: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
}, { versionKey: false });

schema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

export default model<IUser>('User', schema);