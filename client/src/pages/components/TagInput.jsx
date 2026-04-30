import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

export default function TagInput({
  availableTags = [],
  selectedTags = [],
  setSelectedTags = () => {},
}) {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredTags = availableTags.filter(
    (tag) =>
      tag.toLowerCase().includes(input.toLowerCase()) &&
      !selectedTags.includes(tag),
  );

  const addTag = (tag) => {
    const clean = tag.trim();
    if (!clean) return;

    if (!selectedTags.includes(clean)) {
      setSelectedTags((prev) => [...prev, clean]);
    }

    setInput("");
    setShowDropdown(false);
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="w-full relative text-left">
      {/* TAG CONTAINER */}
      <div className="flex flex-wrap items-center gap-1 py-2 bg-white max-h-24 overflow-y-auto">
        {selectedTags.map((tag) => (
          <div
            key={tag}
            className="flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-[2px] rounded-full gap-1"
          >
            <span className="leading-none">{tag}</span>

            <button
              onClick={() => removeTag(tag)}
              className="hover:text-red-500 flex items-center !px-0"
            >
              <IoCloseSharp size={12} className="relative top-[0.4px]" />
            </button>
          </div>
        ))}

        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(input);
            }
          }}
          placeholder="Add tags..."
          className="flex-1 min-w-[80px] text-sm outline-none"
        />
      </div>

      {/* DROPDOWN */}
      {showDropdown && input && (
        <div className="absolute w-full bg-white border mt-1 rounded-md shadow-sm max-h-36 overflow-y-auto z-10">
          {filteredTags.length > 0 ? (
            filteredTags.map((tag) => (
              <div
                key={tag}
                onClick={() => addTag(tag)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50"
              >
                {tag}
              </div>
            ))
          ) : (
            <div
              onClick={() => addTag(input)}
              className="px-3 py-2 text-sm cursor-pointer text-blue-600 hover:bg-blue-50"
            >
              Add "{input}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
