import React, { useEffect, useState } from "react";
import api from "../../services/dashboardApi";
import toast from "react-hot-toast";
import { IoSearch, IoCloseSharp, IoTrashOutline } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TagInput from "../components/TagInput";

const EditForm = ({
  id,
  initContent = "",
  initTitle = "",
  initTags = [],
  submitFunc = () => {},
  cancelFunc = () => {},
  isLoading,
  tagsList = [],
}) => {
  const [content, changeContent] = useState(initContent);
  const [title, changeTitle] = useState(initTitle);
  const [tags, changeTags] = useState(initTags);

  useEffect(() => {
    changeContent(initContent);
    changeTitle(initTitle);
    changeTags(initTags);
  }, [initContent, initTitle, initTags]);

  return (
    <form
      className="flex flex-col h-full text-left"
      onSubmit={(e) => {
        e.preventDefault();
        submitFunc(id, title, content, tags);
      }}
      onReset={(e) => {
        e.preventDefault();
        cancelFunc();
      }}
    >
      <input
        className="w-full border border-gray-300 px-3 py-2 rounded text-lg font-semibold mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        value={title}
        onChange={(e) => changeTitle(e.target.value)}
      />

      <textarea
        className="flex-1 w-full px-3 py-2 resize-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
        value={content}
        onChange={(e) => changeContent(e.target.value)}
      />

      <div className="mt-2">
        {/* <p className="text-xs text-gray-500 mb-1">Tags</p> */}
        <TagInput
          availableTags={tagsList}
          selectedTags={tags}
          setSelectedTags={changeTags}
        />
      </div>

      <div className="flex justify-between mt-3">
        <button
          disabled={isLoading}
          className={`px-4 py-1 rounded text-blue-500 border ${
            isLoading
              ? "border-gray-400"
              : "border-blue-500 hover:border-blue-600"
          }`}
          type="submit"
        >
          {isLoading ? "Saving..." : "Submit"}
        </button>

        <button
          disabled={isLoading}
          className="px-4 py-1 border rounded hover:bg-gray-100"
          type="reset"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const NoteObject = ({
  note,
  editMutation,
  deleteMutation,
  cancelAction = () => {},
  isNew = false,
  tagsList = [],
}) => {
  const { title, content, _id = null, tags = [] } = note;
  const [editing, setEditing] = useState(isNew);

  const editFunc = (_id, title, content, tags) => {
    editMutation.mutate(
      { id: _id, title, content, tags },
      {
        onSuccess: () => setEditing(false),
      },
    );
  };

  const deleteFunc = () => {
    deleteMutation.mutate(_id);
  };

  const cancelFunc = () => {
    cancelAction();
    setEditing(false);
  };

  return (
    <div className="w-full p-4 min-h-[18rem] bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col text-left">
      {editing ? (
        <EditForm
          id={_id}
          initContent={content}
          initTitle={title}
          initTags={tags}
          submitFunc={editFunc}
          cancelFunc={cancelFunc}
          isLoading={editMutation.isPending}
          tagsList={tagsList}
        />
      ) : (
        <>
          {/* HEADER */}
          <div className="flex justify-between items-start mb-2">
            <p className="text-lg font-semibold">{title}</p>

            <button
              onClick={deleteFunc}
              className="text-sm text-gray-400 hover:text-red-500 !px-0"
            >
              <IoTrashOutline />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto text-gray-700 whitespace-pre-wrap text-sm text-left">
            {content}
          </div>

          {/* TAGS */}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-[2px] bg-blue-100 text-blue-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {!editing && (
        <div className="mt-3 flex justify-end">
          <button
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
  const queryClient = useQueryClient();

  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [tagsList, setTagsList] = useState(["Work", "Idea"]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    if (showSearch) {
      document.getElementById("search-input")?.focus();
    }
  }, [showSearch]);

  const fetchNotes = async ({ queryKey }) => {
    const [_key, query] = queryKey;

    const response = await api.get(
      `/dashboard/notes?search=${encodeURIComponent(query)}`,
    );

    return response.data.notes;
  };

  const {
    data: notes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notes", debouncedSearch],
    queryFn: fetchNotes,
    keepPreviousData: true,
    onError: (error) => {
      toast(error?.response?.data?.message || "Server not reachable");
    },
  });
  const queryKey = ["notes", debouncedSearch];

  const addMutation = useMutation({
    mutationFn: async ({ title, content, tags }) => {
      const res = await api.post(`/dashboard/notes`, { title, content, tags });
      return res.data.note;
    },

    onMutate: async ({ title, content, tags }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousNotes = queryClient.getQueryData(queryKey);

      const optimisticNote = {
        _id: Date.now(),
        title,
        content,
        tags,
      };

      queryClient.setQueryData(queryKey, (old = []) => [
        ...old,
        optimisticNote,
      ]);

      return { previousNotes };
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context.previousNotes);

      toast(error?.response?.data?.message || "Add failed");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      setAdding(false);
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, title, content, tags }) => {
      const res = await api.patch(`/dashboard/notes/${id}`, {
        title,
        content,
        tags,
      });
      return res.data.note;
    },

    onMutate: async ({ id, title, content, tags }) => {
      await queryClient.cancelQueries({ queryKey });
      console.log("previousNotes = ", queryClient.getQueryData(queryKey));
      const previousNotes = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old = []) =>
        old.map((note) =>
          note._id === id ? { ...note, title, content, tags } : note,
        ),
      );

      return { previousNotes };
    },

    onError: (error, variables, context) => {
      console.log("context = ", context);
      queryClient.setQueryData(queryKey, context.previousNotes);

      toast(error?.response?.data?.message || "Edit failed");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/dashboard/notes/${id}`);
    },

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });

      const previousNotes = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old = []) =>
        old.filter((note) => note._id !== id),
      );

      return { previousNotes };
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context.previousNotes);

      toast(error?.response?.data?.message || "Delete failed");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (isError) {
    return <p className="text-center mt-10">Error loading notes</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full px-4">
        <div className="mb-6 flex justify-end items-center gap-2">
          <div
            className={`flex items-center border rounded bg-white transition-all ${
              showSearch ? "w-90 px-2" : "w-10 justify-center"
            } h-10`}
          >
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
              onClick={() => setShowSearch(true)}
              className="!px-1 !py-1 text-gray-600 hover:text-blue-500 outline-[0px] focus:!outline-[0px]"
            >
              <IoSearch />
            </button>

            {showSearch && (
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearch("");
                }}
                className="!px-1 !py-1 text-gray-600 hover:text-red-500 focus:!outline-[0px]"
              >
                <IoCloseSharp />
              </button>
            )}
          </div>

          <button
            onClick={() => setAdding(!adding)}
            className="transparent_button h-10 px-4"
          >
            {adding ? "Cancel" : "Add Note"}
          </button>
        </div>

        {notes.length > 0 || adding ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteObject
                key={note._id}
                note={note}
                editMutation={editMutation}
                deleteMutation={deleteMutation}
                tagsList={tagsList}
              />
            ))}

            {adding && (
              <NoteObject
                note={{ title: "", content: "" }}
                editMutation={addMutation}
                deleteMutation={deleteMutation}
                isNew
                cancelAction={() => setAdding(false)}
                tagsList={tagsList}
              />
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
