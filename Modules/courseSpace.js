import mongoose from "mongoose";

const CourseSpaceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  categories: [{ type: String }],
  courses: [
    {
      title: { type: String, required: true },
      category: { type: String, required: true },
      fileUrl: { type: String, required: true },
    },
  ],
});

const CourseSpace = mongoose.model("CourseSpace", CourseSpaceSchema);
export default CourseSpace;
