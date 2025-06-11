
// pages/api/translateHtml.js
import { JSDOM } from 'jsdom';

export async function POST(req) {
  const { html, targetLanguage } = await req.json();

  // console.log(html,targetLanguage)

  // Parse HTML and extract text nodes for translation
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const datas = []
  let textData = {}
  let temps = {}
  const resultData = [];
  const select = document.querySelectorAll("body")
  select.forEach((node)=>{
    node.childNodes.forEach((child)=>{
      textData[`<${child.nodeName.toLowerCase()}>`] = {text:[]};
      temps[`<${child.nodeName.toLowerCase()}>`] = {text:[]};
      if(child.textContent==="")
        textData[`<${child.nodeName.toLowerCase()}>`]['text'].push("<br>")
      else{
      textData[`<${child.nodeName.toLowerCase()}>`]['text'].push(child.nodeName==="UL"?"  ":child.textContent)
      for(let i=0;i<child.childNodes.length;i++){
      if (child.childNodes[i].nodeType === 1){
        let temp = child.childNodes[i]
        const orig = child.childNodes[i]
        while(true){
          if(temp.childNodes[0].nodeType === 1)
            temp = temp.childNodes[0];
          else{
            if(!(temp.textContent===' ' || temp.textContent==='.' || temp.textContent===','))
            textData[`<${child.nodeName.toLowerCase()}>`][temp.textContent] = [orig.outerHTML];
            console.log(temp.textContent,textData)
            break
          }
        }
      }
    }
    }
    datas.push(textData);
    textData = {}
    resultData.push(temps);
    temps = {}
    })
  })
  // const paragraph = document.querySelectorAll('p');
  
  // console.log(datas)
  // console.log(textData,resultData)
  // const resultData = datas;
  try {
    // Translate each text node
    await Promise.all( datas.map(async(textData,indexs)=>{
    for (const [keys, values] of Object.entries(textData)) {
      // console.log("first loop",textData)
      for (const [key, value] of Object.entries(values)){
        let temp = resultData[indexs];
        // console.log(value)
        if(key==="text"){
          value.map(async(text)=>{
            const res = await fetch("http://localhost:1234/translator", {
              method: "POST",
              body: JSON.stringify({
                "text": text,
                "source": "auto",
                "target": targetLanguage,
                "format": "text"
              }),
              headers: { "Content-Type": "application/json" }
            });
            const data = await res.json()
            // console.log("datas of ",keys,data)
            resultData[indexs][keys]['text'].push(data.text)
            // console.log("datas of ",keys,data,resultData[indexs])
          })
        }
        else{
          const res = await fetch("http://localhost:1234/translator", {
            method: "POST",
            body: JSON.stringify({
              "text": key,
              "source": "auto",
              "target": targetLanguage,
              "format": "text"
            }),
            headers: { "Content-Type": "application/json" }
          });
          const data = await res.json()
          // console.log("datas of different element ",keys,data)
          // value[0] = data.text 
          value[0]=value[0].replace(key,data.text)
          resultData[indexs][keys][data.text] = value
          // console.log(resultData[indexs])
        }
        // resultData[indexs]=temp
      }
    }
  })
)
  if(!resultData[0][Object.keys(resultData[0])[0]]['text'][0] && datas[0][Object.keys(datas[0])[0]]['text'][0])
    await new Promise((resolve) => setTimeout(resolve, 2000));
    let tran = ""
    resultData.map((data)=>{
    for (const [keys, values] of Object.entries(data)) {
      if(keys==='<ul>'){
        let tmp = ""
        for (const [key, value] of Object.entries(values)) {
          tmp = tmp.concat(value)
        }
        tran = tran.concat(`<ul>${tmp}</ul>`)
      }
      else{
        for (const [key, value] of Object.entries(values)) {
          
          if(key==="text"){
            value.map((text)=>{
              tran = tran.concat(`${keys} ${text} </${keys.slice(1)}`)
            })
            
          }
          else{
            const regexp = new RegExp(`${key}`,'i')
            tran = tran.replace(regexp,value)
          }
          // console.log("trans",value,resultData[4])
        }
      }
    }
  })
    // Return the translated HTML
    // res.status(200).json({ translatedHtml: document.body.innerHTML });
    console.log("after",tran)
    return Response.json({ translatedHtml: tran })
  } catch (error) {
    console.error(error);
    // res.status(500).json({ error: 'Translation failed' });
    return Response.json({ error: 'Translation failed' })
  }
}
