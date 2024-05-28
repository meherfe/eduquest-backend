const role = {
  etudiant: ['/User'],
  admin: ['/User', '/Users', '/User/:id/status', '/User/:id'],
  enseignant: [] 
};

export default role;
