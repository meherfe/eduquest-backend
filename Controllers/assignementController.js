import Assignment from '../Modules/assignement.js';




export const getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assignments', error });
    }
};

export const createAssignment = async (req, res) => {
    try {
        const newAssignment = new Assignment(req.body);
        const savedAssignment = await newAssignment.save();
        res.status(201).json(savedAssignment);
    } catch (error) {
        res.status(400).json({ message: 'Error creating assignment', error });
    }
};


export const updateAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const updatedAssignment = await Assignment.findByIdAndUpdate(assignmentId, req.body, { new: true, runValidators: true });
        if (!updatedAssignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.status(200).json(updatedAssignment);
    } catch (error) {
        res.status(400).json({ message: 'Error updating assignment', error });
    }
};

export const deleteAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const deletedAssignment = await Assignment.findByIdAndDelete(assignmentId);
        if (!deletedAssignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting assignment', error });
    }
};
export const getAssignmentByCategory = async (req, res) => {
    try {
        const { category } = req.query;
        const assignments = await Assignment.find({ category: category });
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assignments by category', error });
    }
};