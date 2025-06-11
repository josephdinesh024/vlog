'use client'

import { useState,useEffect} from 'react'
import 'react-quill/dist/quill.snow.css'
import EditorToolbar, { modules, formats } from "./EditorTools";
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Editor = ({initialContent}) => {
    const [content, setContent] = useState(initialContent);
    const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true once on the client
  }, []);

  return (
    <div>
        <EditorToolbar />
        {isClient && (
        <ReactQuill value={content} onChange={setContent} 
        placeholder={'type some thing....'} 
        modules={modules}
        formats={formats}
        />
        )}
        <input type='hidden' name='content' value={content}/>
    </div>
  )
}

export default Editor