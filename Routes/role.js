const role = {
  etudiant: ['/User' , '/User/:id'],
  admin: ['/User', '/users', '/User/:id/status', '/User/:id'],
  enseignant: ['/User/:id', '/coursespace' , '/coursespace/:id/categories' , '/:id/courses' , '/coursespace/:courseSpaceId/etudiant/:etudiantId/assign' , '/professor/:professorId' , '/student/:studentId'] 
};

export default role;
