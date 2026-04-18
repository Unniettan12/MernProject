import axios from "axios";
import React, { useEffect, useState } from "react";
import api from "../../services/dashboardApi";
import toast from "react-hot-toast";
import { IoSearch, IoCloseSharp } from "react-icons/io5";

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
          className="w-full border border-gray-300 p-2 rounded text-lg font-semibold"
          id={`${id}-title`}
          minLength={1}
          maxLength={20}
          value={title}
          onChange={(e) => {
            changeTitle(e.target.value);
          }}
        />
      </div>
      <div className="content_box">
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
            className="h-[100%] w-full px-2 py-2 resize-none border-1 rounded-lg border-[#ADADAD] px-2"
            id={`${id}-content`}
            name={`note_edit`}
            minLength={1}
            maxLength={1000}
            value={content}
            onChange={(e) => changeContent(e.target.value)}
          />
          <div className="flex justify-between mt-1">
            <button
              disabled={isLoading}
              className={`px-4 py-1 rounded text-white ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              type="submit"
            >
              {isLoading ? "Saving..." : "Submit"}
            </button>
            <button
              disabled={isLoading}
              className="px-4 py-1 rounded border border-gray-300 hover:bg-gray-100"
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
  console.log("note destructure :", note);
  const { title, content, _id = null } = note;
  const [editing, setEditing] = useState(isNew);
  const [loading, setLoading] = useState(false);

  const editFunc = async (_id, title, content) => {
    try {
      setLoading(true);
      const resp = await editNote(_id, title, content);
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
    console.log("id is ", _id);
    const resp = await deleteNote(_id);
  };

  const cancelFunc = () => {
    cancelAction();
    setEditing(false);
  };

  return (
    <div className="w-full p-4 h-64 bg-white border border-gray-200 rounded shadow-sm flex flex-col">
      {editing ? (
        <>
          <EditForm
            id={_id}
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
            <div className="flex justify-between items-center mb-2 w-full">
              <p className="text-lg font-semibold text-left">{title}</p>
              <button
                onClick={deleteFunc}
                // className="text-sm text-red-500"
                className="transparent_button hover:!border-red-500 hover:!shadow-[0_0_0_2px_rgba(251,44,54,0.2)]"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto text-left text-gray-700 whitespace-pre-wrap">
            {content}
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
        <div className="buttons_box mt-3 shrink-0 flex justify-end">
          <button
            // className="mt-3 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            className="transparent_button"
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
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const getNotes = async (query = "") => {
    try {
      let notes = [];
      const response = await api.get(
        // query?
        `/dashboard/notes?search=${encodeURIComponent(query)}`,
        // : "/dashboard/notes",
      );
      console.log("response ", response);
      if (response?.status === 200) {
        notes = response?.data?.notes;
        setNotes(notes);
      }
    } catch (error) {
      console.log("FULL ERROR:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
        toast(`Error : ${error.response.data.message}`);
        // setError(error.response.data);
      } else {
        console.log("Network error:", error.message);
        setError({ message: "Server not reachable" });
      }

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
          prevState.map((item) => (item?._id === id ? editedNote : item)),
        );
      }
      return response?.status;
    } catch (error) {
      console.log("FULL ERROR:", error);

      if (error.response) {
        toast(`Error : ${error.response.data.message}`);
      } else {
        console.log("Network error:", error.message);
        toast(`Error : "Server not reachable`);
      }
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
        setNotes((prev) => prev.filter((note) => note._id !== id));
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
  useEffect(() => {
    if (showSearch) {
      document.getElementById("search-input")?.focus();
    }
  }, [showSearch]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
      <div className="w-full px-4">
        {/* <div className="mb-6 flex justify-end">
          <button
            onClick={() => setAdding(!adding)}
            // className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            className="transparent_button"
          >
            {adding ? "Cancel" : "Add Note"}
          </button>
        </div> */}
        <div className="mb-6 flex justify-end items-center gap-2">
          {/* Search Container */}
          <div
            className={`flex items-center border border-gray-300 rounded bg-white overflow-hidden transition-all duration-300 ease-in-out ${
              showSearch ? "w-90 px-2" : "w-10 justify-center"
            } h-10`}
          >
            {/* Input */}
            <input
              id="search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className={`outline-none text-sm flex-1 transition-opacity duration-200 ${
                showSearch ? "opacity-100 ml-2" : "opacity-0 !w-0 hidden"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getNotes(search);
                }
              }}
            />

            <button
              onClick={() => {
                if (!showSearch) {
                  setShowSearch(true);
                } else {
                  getNotes(search);
                }
              }}
              className="!px-1 !py-1 text-gray-600 hover:text-blue-500 outline-[0px] focus:!outline-[0px]"
            >
              <IoSearch />
            </button>

            {showSearch && (
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearch("");
                  getNotes();
                }}
                className="!px-1 !py-1 text-gray-600 hover:text-red-500 focus:!outline-[0px]"
              >
                <IoCloseSharp />
              </button>
            )}
          </div>

          {/* Add button */}
          <button
            onClick={() => setAdding(!adding)}
            className="transparent_button h-10 px-4"
          >
            {adding ? "Cancel" : "Add Note"}
          </button>
        </div>

        {error === null && (notes.length > 0 || adding) ? (
          // <div className="bg-red-800 grid grid-cols-3 h-full align-center px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div key={note?._id} className="flex justify-center">
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
              <div className="flex justify-center">
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
          <div className="text-center text-gray-500 mt-10">
            <p>{search ? "No matching notes found" : "No notes found"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
