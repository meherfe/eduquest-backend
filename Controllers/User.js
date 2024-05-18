import User from '../Modules/User';
import { validationResult } from 'express-validator';

export function addUser  (req, res)  {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log('Validation Errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { nom, prenom, email, login, password, phone, role } = req.body;

    // Create a new user instance
    const newUser = new User({
      nom,
      prenom,
      email,
      login,
      password,
      phone,
      role,
      
    });

    // Save the user to the database
    newUser.save()

    // Respond with the saved user data
    .then(addUser => {
     
      res.status(200).json(newUser);

    })
  }
  catch (error )  {
    console.error('Error adding user:', error);
    res.status(500).json({ error: error.message });
  };





  //function delete user

  
}