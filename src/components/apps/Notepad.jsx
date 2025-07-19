import React, { useState } from 'react';

const Notepad = () => {
  const [content, setContent] = useState('');

  const handleNew = () => {
    const confirmed = window.confirm("Are you sure you want to start a new file? Any unsaved changes will be lost.");
    if (confirmed) {
      setContent('');
    }
  };

  const handleSave = () => {
    console.log("Saving content:", content);
    alert("Content saved to the console!");
  };

  return (
    <div className="w-[480px] h-[400px] bg-zinc-900 rounded-xl shadow-lg flex flex-col border border-zinc-700">
      <div className="bg-zinc-800 p-2 rounded-t-xl flex items-center gap-4 px-3 border-b border-zinc-700">
        <button onClick={handleNew} className="text-zinc-300 text-sm hover:bg-zinc-700 p-1 rounded">File</button>
        <button className="text-zinc-300 text-sm hover:bg-zinc-700 p-1 rounded">Edit</button>
        <button onClick={handleSave} className="text-zinc-300 text-sm hover:bg-zinc-700 p-1 rounded">Save</button>
        <button className="text-zinc-300 text-sm hover:bg-zinc-700 p-1 rounded">Help</button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="
          flex-grow w-full bg-zinc-900 p-4 
          text-zinc-200 text-base font-mono 
          resize-none focus:outline-none rounded-b-xl
          placeholder-zinc-500
        "
        placeholder="Start typing here..."
      />
    </div>
  );
};

export default Notepad;
