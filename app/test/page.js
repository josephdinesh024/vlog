'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'
import EditorToolbar, { modules, formats } from '../../components/EditorTools';
import {getcookie, setcookie} from '../../components/SetCooke'
import '../snow.css';


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function TextEditor() {
  const [text, setText] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [post,setPost] = useState()
  const [targetLanguage,settargetLanguage] = useState('en')

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_URL+'/api/posts?id=83c24c53-0cfb-4291-8990-71fa045f983e'
        fetch(url)
        .then(response => response.json())
        .then(data=>{
          console.log(data.content)
          fetch('http://localhost:3000/api/trans', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ html: data.content, targetLanguage }),
          })
          .then(res=>res.json())
          .then(data=>{
          console.log(data.translatedHtml)
          setPost(data.translatedHtml)
          });

        });
    setIsClient(true); // Set to true once on the client
  }, [targetLanguage]);
    
  const handleChange =(value) => {
    setText(value);
    console.log(value)
  };
        const lists = document.getElementsByClassName("dragItem");
        // console.log(lists)
        const leftBlock = document.getElementById('left')
        const rightBlock = document.getElementById('right')
        let list = null
        for(list of lists){
            list.addEventListener('dragstart',function(e){
                let selected = e.target;
                rightBlock.addEventListener('dragover',function(e){
                    e.preventDefault();
                });
                rightBlock.addEventListener('drop',function(e){
                    rightBlock.appendChild(selected);
                    selected=null
                });
                leftBlock.addEventListener('dragover',function(e){
                    e.preventDefault();
                });
                leftBlock.addEventListener('drop',function(e){
                    leftBlock.appendChild(selected);
                    selected=null
                });
            })
        }
  return (<>
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div>
        <h2>Input Text:</h2>
        <EditorToolbar />
        {isClient && (
          <ReactQuill
            value={text}
            onChange={handleChange}
            placeholder="type something..."
            modules={modules}
            formats={formats}
          />
        )}
      </div>

      <div>
        <h2>Live Preview:</h2>
        <div className="ql-editor" dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </div>

    <div class="grid content-center justify-center w-full h-screen bg-violet-950">
        <div class="flex w-full space-x-4" >
            <div class="border-dashed border-2  w-56 h-80" id="left">
                    <h4 class="w-48 m-4 p-2 bg-red-400 cursor-grab dragItem" draggable="true">List 1</h4>
                    <h4 class="w-48 m-4 p-2 bg-red-400 cursor-grab dragItem" draggable="true">List 2</h4>
                    <h4 class="w-48 m-4 p-2 bg-red-400 cursor-grab dragItem" draggable="true">List 3</h4>
            </div>
            <div class="border-dashed border-2 w-56 h-80" id="right">
                
            </div>
        </div>
    </div>
    
    <div>
        <select onChange={(e)=>{
            settargetLanguage(e.target.value)
            setcookie(e.target.value)
        }}>
            <option selected={targetLanguage==="en"} value='en'>en</option>
            <option selected={targetLanguage==="es"} value='es'>es</option>
            <option selected={targetLanguage==="ta"} value='ta'>ta</option>
            <option selected={targetLanguage==="ja"} value='ja'>ja</option>
        </select>
    </div>
        {post && <div>
          
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: post}} /></div>}
    </>
  );
}
