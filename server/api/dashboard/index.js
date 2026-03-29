import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

const summaryData = {
  stats: {
    openTickets: 12,
    resolvedToday: 8,
    avgResponseTime: "4m 32s",
    activeAgents: 3,
  },
};
const ticketListData = {
  tickets: [
    {
      id: "TCK-1023",
      customer: "Ravi Kumar",
      subject: "Payment failed but amount debited",
      status: "open",
      priority: "high",
      createdAt: "2026-02-17T10:20:00Z",
    },
    {
      id: "TCK-1022",
      customer: "Ananya Sharma",
      subject: "Unable to reset password",
      status: "in_progress",
      priority: "medium",
      createdAt: "2026-02-17T09:05:00Z",
    },
    {
      id: "TCK-1021",
      customer: "Mohit Verma",
      subject: "Invoice not generated",
      status: "resolved",
      priority: "low",
      createdAt: "2026-02-16T18:40:00Z",
    },
  ],
};

const agentData = {
  agents: [
    {
      name: "You",
      status: "online",
      ticketsHandledToday: 5,
    },
    {
      name: "Support Agent A",
      status: "online",
      ticketsHandledToday: 3,
    },
    {
      name: "Support Agent B",
      status: "offline",
      ticketsHandledToday: 0,
    },
  ],
};

let notes = {
  notes: [
    {
      id: "1",
      title: "Note 1",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
    },
    {
      id: "2",
      title: "Note 2",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
    },
    {
      id: "3",
      title: "Note 3",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
    },
  ],
};

const summary = (req, res) => {
  res.send(summaryData);
};

const returnNotes = (req, res) => {
  res.status(200).send(notes);
};

const editNote = (req, res) => {
  const { id } = req.params;
  const { title, content } = req?.body;
  if (!id) {
    return res.status(400).json({ message: "Process requires id" });
  }

  console.log("No note with that id ", req?.body);

  let noteToEdit = notes?.notes.find(
    (note) => note?.id.toString() === id.toString(),
  );
  if (!noteToEdit) {
    return res.status(400).json({ message: "No note present with given id." });
  }

  noteToEdit.content = content;
  noteToEdit.title = title;

  res.status(200).json({
    message: "Note edited successfully",
    note: noteToEdit,
  });
};

const addNote = (req, res) => {
  let { title, content } = req?.body;

  if (notes.notes.length >= 6) {
    return res
      .status(400)
      .json({ message: "Maximum number of notes reached." });
  }

  let noteToAdd = {
    id: crypto.randomUUID(),
    title: title,
    content: content,
  };

  notes.notes.push(noteToAdd);

  res.status(200).json({
    status: "OK",
    message: "Note added successfully",
    note: noteToAdd,
  });
};

const deleteNote = (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Process requires id" });
  }

  let noteToDeleteIndex = notes?.notes.findIndex(
    (note) => note?.id.toString() === id.toString(),
  );
  if (noteToDeleteIndex === -1) {
    return res.status(400).json({ message: "No note present with given id." });
  }

  notes.notes.splice(noteToDeleteIndex, 1);

  res.status(200).json({
    status: "OK",
    message: "Note deleted successfully",
  });
};

router.get("/", authMiddleware, summary);
router.get("/notes", authMiddleware, returnNotes);
router.post("/notes", authMiddleware, addNote);
router.patch("/notes/:id", authMiddleware, editNote);
router.delete("/notes/:id", authMiddleware, deleteNote);

export default router;
