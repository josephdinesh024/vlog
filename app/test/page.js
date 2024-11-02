'use client'
// import { useEffect, useRef, useState } from 'react';
// import 'quill/dist/quill.snow.css';

// export default function Editor() {
//   const editorRef = useRef(null);
//   const [content, setContent] = useState('');
//   useEffect(() => {
//       const Quill = require('quill').default;  // Use '.default' for Quill
//       const quill = new Quill(editorRef.current, {
//         modules: {
//           toolbar: [
//             ['bold', 'italic'],
//             ['link', 'blockquote', 'code-block', 'image'],
//             [{ list: 'ordered' }, { list: 'bullet' }],
//           ],
//         },
//         theme: 'snow',
//       });
//       quill.on('text-change', () => {
//         setContent(quill.root.innerHTML); // Save content as HTML
//       });
//   }, []);

//   return (
//     <div>
//       <div ref={editorRef}></div>
//       <button onClick={handleSubmit}>Submit</button>
//       <div>
//         {data}
//       </div>
//       <div dangerouslySetInnerHTML={{ __html: JSON.parse(data)}} />
//     </div>
//   );
// }

import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from "@/components/EditorTools";
import '../snow.css'
 


export default function TextEditor() {
  const [text, setText] = useState('');

  const handleChange = (value) => {
    setText(value); // Update text state on change
  };

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      {/* Input Text Area */}
      <div>
        <h2>Input Text:</h2>
        <EditorToolbar />
        <ReactQuill value={text} onChange={handleChange} 
        placeholder={'type some thing....'} 
        modules={modules}
        formats={formats}
        />
      </div>

      {/* Display Entered Content */}
      <div>
        <h2>Live Preview:</h2>
        <div className="ql-editor" dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </div>
  );
}
