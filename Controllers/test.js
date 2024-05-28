import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../Modules/User'; // Adjust the path accordingly

mongoose.connect('mongodb://localhost:27017/eduquest', { useNewUrlParser: true, useUnifiedTopology: true });

const rehashPasswords = async () => {
    const users = await User.find();

    for (let user of users) {
        if (!user.password.startsWith('$2a$')) { // Check if the password is not already hashed
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            await user.save();
            console.log(`Password for user ${user.login} rehashed.`);
        }
    }
    console.log('Rehashing completed.');
    mongoose.connection.close();
};

rehashPasswords().catch(error => {
    console.error('Error rehashing passwords:', error);
    mongoose.connection.close();
});
