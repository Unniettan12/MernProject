import axios from "axios";
import React, { useEffect, useState } from "react";
import api from "../../services/dashboardApi";

const EditForm = ({
  id,
  initContent = "",
  initTitle = "",
  submitFunc = () => {},
  cancelFunc = () => {},
  isLoading,
}) => {
  const [content, changeContent] = useState(initContent);
  const [title, changeTitle] = useState(initTitle);

  useEffect(() => {
    changeContent(initContent);
    changeTitle(initTitle);
  }, [initContent, initTitle]);
  return (
    <>
      <div className="title_box mb-2 shrink-0">
        {/* <p className="text-left text-lg font-semibold">{title}</p> */}
        <input
          className="text-left text-lg font-semibold"
          id={`${id}-title`}
          minLength={1}
          maxLength={20}
          value={title}
          onChange={(e) => {
            changeTitle(e.target.value);
          }}
        />
      </div>
      <div className="content_box h-full">
        <form
          name={`note_${id}`}
          className="h-full"
          onSubmit={(e) => {
            e.preventDefault();
            submitFunc(id, title, content);
          }}
          onReset={(e) => {
            e.preventDefault();
            cancelFunc();
          }}
        >
          <textarea
            className="h-[80%] w-full px-2 py-2 resize-none border-1 rounded-lg border-[#ADADAD] px-2"
            id={`${id}-content`}
            name={`note_edit`}
            minLength={1}
            maxLength={1000}
            value={content}
            onChange={(e) => changeContent(e.target.value)}
          />
          <div className="flex flex-column justify-between">
            <button
              disabled={isLoading}
              className={`px-3 py-1 rounded ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-white text-blue-600"
              }`}
              type="submit"
            >
              {isLoading ? "Saving..." : "Sumbit"}
            </button>
            <button
              disabled={isLoading}
              className={`px-3 py-1 rounded ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-white text-blue-600"
              }`}
              type="reset"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const NoteObject = ({
  note,
  editNote,
  cancelAction = () => {},
  deleteNote = async () => {},
  isNew = false,
}) => {
  const { title, content, id = null } = note;
  const [editing, setEditing] = useState(isNew);
  const [loading, setLoading] = useState(false);

  const editFunc = async (id, title, content) => {
    try {
      setLoading(true);
      const resp = await editNote(id, title, content);
      if (resp === 200) {
        setEditing(false);
      }
    } catch (error) {
      console.log("eror is ", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFunc = async () => {
    const resp = await deleteNote(id);
  };

  const cancelFunc = () => {
    cancelAction();
    setEditing(false);
  };

  return (
    <div className="note_object w-full p-4 h-64 border bg-blue-500 flex flex-col rounded">
      {editing ? (
        <>
          <EditForm
            id={id}
            initContent={content}
            initTitle={title}
            submitFunc={editFunc}
            cancelFunc={cancelFunc}
            isLoading={loading}
            setLoading={setLoading}
          />
        </>
      ) : (
        <>
          <div className="title_box mb-2 shrink-0 flex flex-row align-center justify-between">
            <div>
              <p className="text-left text-lg font-semibold">{title}</p>
            </div>
            {!editing && (
              <div onClick={deleteFunc}>
                <p>Trash</p>
              </div>
            )}
          </div>
          <div className="content_box flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <p className="text-left whitespace-pre-wrap">{content}</p>
          </div>
        </>
      )}
      {/* <div className="title_box mb-2 shrink-0">
        <p className="text-left text-lg font-semibold">{title}</p>
      </div> */}
      {/* <div className="content_box flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {editing ? (
          <EditForm id={id} initContent={content} submitFunc={editFunc} />
        ) : (
          <p className="text-left whitespace-pre-wrap">{content}</p>
        )}
      </div> */}
      {!editing && (
        <div className="buttons_box mt-3 shrink-0">
          <button
            className="px-3 py-1 bg-white text-blue-600 rounded"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  const [adding, setAdding] = useState(false);

  const getNotes = async () => {
    try {
      let notes = [];
      const response = await api("/dashboard/notes");
      if (response?.status === 200) {
        notes = response?.data?.notes;
        setNotes(notes);
      }
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const editNote = async (id, title, content) => {
    try {
      const response = await api.patch(`/dashboard/notes/${id}`, {
        title: title,
        content: content,
      });
      if (response?.status === 200) {
        let editedNote = response?.data?.note;
        setNotes((prevState) =>
          prevState.map((item) => (item?.id === id ? editedNote : item)),
        );
      }
      return response?.status;
    } catch (error) {
      console.log("error detected", error);
    }
  };

  const addNote = async (id, title, content) => {
    try {
      const response = await api.post(`/dashboard/notes`, {
        title: title,
        content: content,
      });
      console.log("response is ", response?.data);
      if (response?.status === 200) {
        // getNotes();
        let noteToAdd = response?.data?.note;
        setNotes((prevState) => [...prevState, noteToAdd]);
        setAdding(false);
      }
      return response?.status;
    } catch (error) {
      console.log("error detected", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await api.delete(`/dashboard/notes/${id}`);
      if (response?.status === 200) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        // getNotes();
      }
      return response?.status;
    } catch (error) {
      console.log("error detected", error);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <div className="page_container h-full">
      <div className="notes_container h-full">
        <div>
          <button
            onClick={() => {
              let addBool = adding;
              setAdding(!addBool);
            }}
          >
            {adding ? "Cancel" : "Add"}
          </button>
        </div>
        {error === null && (notes.length > 0 || adding) ? (
          // <div className="bg-red-800 grid grid-cols-3 h-full align-center px-4 py-10">
          <div className="bg-red-800 grid grid-cols-3 gap-6 px-4 py-10">
            {notes.map((note) => (
              <div key={note?.id} className="flex bg-blue-800 justify-center">
                <NoteObject
                  note={note}
                  editNote={editNote}
                  cancelAction={() => {
                    // getNotes();
                  }}
                  deleteNote={deleteNote}
                />
              </div>
            ))}
            {adding && (
              <div className="flex bg-blue-800 justify-center">
                <NoteObject
                  note={{
                    id: null,
                    title: "",
                    content: "",
                  }}
                  editNote={addNote}
                  cancelAction={async () => {
                    // getNotes();
                    setAdding(false);
                  }}
                  isNew={true}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <p>No notes found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
