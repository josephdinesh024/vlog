'use client'

import { useState} from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import EditorToolbar, { modules, formats } from "./EditorTools";


const Editor = ({initialContent}) => {
    const [content, setContent] = useState(initialContent);
  return (
    <div>
        <EditorToolbar />
        <ReactQuill value={content} onChange={setContent} 
        placeholder={'type some thing....'} 
        modules={modules}
        formats={formats}
        />
        <input type='hidden' name='content' value={content}/>
    </div>
  )
}

export default Editor