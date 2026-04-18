import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import Note from "../../models/Note.js";

const router = express.Router();

const summaryData = {
  stats: {
    openTickets: 12,
    resolvedToday: 8,
    avgResponseTime: "4m 32s",
    activeAgents: 3,
  },
};

const handleError = (res, error, defaultMessage) => {
  console.error(error);

  if (error.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ success: false, message: error.message });
  }

  return res.status(500).json({ success: false, message: defaultMessage });
};

const summary = (req, res) => {
  res.send(summaryData);
};

const returnNotes = async (req, res) => {
  const userId = req.userId;
  const { search } = req.query;
  try {
    const notes = await Note.find({
      user: userId,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notes });
  } catch (e) {
    console.log("error is ", e);
    return handleError(res, error, "Error fetching notes");
    // res.status(500).send({ success: false, message: "Error fetching notes" });
  }
};

const editNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req?.body;
  const userId = req.userId;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Process requires id" });
  }

  if (!title && !content) {
    return res.status(400).json({
      success: false,
      message: "At least one field (title/content) must be provided",
    });
  }
  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, user: userId },
      { ...(title && { title }), ...(content && { content }) },
      { returnDocument: "after" },
    );
    if (!note) {
      return res
        .status(404)
        .json({ success: false, messaage: "No note found with that id" });
    }
    return res.status(200).json({ success: true, note });
  } catch (e) {
    return handleError(res, error, "Error updating note");
  }
};

const addNote = async (req, res) => {
  const { title, content } = req?.body;
  const userId = req.userId;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required",
    });
  }

  try {
    const note = await Note.create({
      title: title,
      content: content,
      user: userId,
    });
    if (note) {
      res.status(200).json({ success: true, note });
    }
  } catch (e) {
    return handleError(res, error, "Error creating note");
  }
  // if (notes.notes.length >= 6) {
  //   return res
  //     .status(400)
  //     .json({ message: "Maximum number of notes reached." });
  // }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Note ID is required",
    });
  }

  try {
    const note = await Note.findOneAndDelete({ _id: id, user: userId });
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (e) {
    return handleError(res, error, "Error deleting note");
  }
};

router.get("/", authMiddleware, summary);
router.get("/notes", authMiddleware, returnNotes);
router.post("/notes", authMiddleware, addNote);
router.patch("/notes/:id", authMiddleware, editNote);
router.delete("/notes/:id", authMiddleware, deleteNote);

export default router;
