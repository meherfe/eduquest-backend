import CourseSpace from "../Modules/courseSpace.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

// Create a new course space
export const createCourseSpace = async (req, res) => {
  const courseSpace = new CourseSpace(req.body);
  try {
    const savedCourseSpace = await courseSpace.save();
    res.status(201).json(savedCourseSpace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add a category to a course space
export const addCategory = async (req, res) => {
  try {
    const courseSpace = await CourseSpace.findById(req.params.id);
    if (!courseSpace)
      return res.status(404).json({ message: "CourseSpace not found" });
    courseSpace.categories.push(req.body.category);
    await courseSpace.save();
    res.status(201).json(courseSpace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Upload a course file
export const uploadCourse = [
  upload.single("file"),
  async (req, res) => {
    try {
      const courseSpace = await CourseSpace.findById(req.params.id);
      if (!courseSpace)
        return res.status(404).json({ message: "CourseSpace not found" });
      const course = {
        title: req.body.title,
        category: req.body.category,
        fileUrl: req.file.path,
      };
      courseSpace.courses.push(course);
      await courseSpace.save();
      res.status(201).json(courseSpace);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
];

/// Assign an etudiant to a coursespace
export const assignEtudiantToCourseSpace = async (req, res) => {
  try {
    const courseSpace = await CourseSpace.findById(req.params.courseSpaceId);
    if (!courseSpace)
      return res.status(404).json({ message: "CourseSpace not found" });
    
    const etudiantId = req.params.etudiantId;
    // Check if the etudiant is already assigned to the coursespace
    if (courseSpace.students.includes(etudiantId)) {
      return res.status(400).json({ message: "Etudiant is already assigned to this CourseSpace" });
    }

    // Assign the etudiant to the coursespace
    courseSpace.students.push(etudiantId);
    await courseSpace.save();
    res.status(201).json(courseSpace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Get all course spaces for a professor
export const getCourseSpacesByProfessor = async (req, res) => {
  try {
    const courseSpaces = await CourseSpace.find({
      professor: req.params.professorId,
    });
    res.json(courseSpaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all course spaces for a student
export const getCourseSpacesByStudent = async (req, res) => {
  try {
    const courseSpaces = await CourseSpace.find({
      students: req.params.studentId,
    });

    console.log(courseSpaces);
    
    res.json(courseSpaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
 

};