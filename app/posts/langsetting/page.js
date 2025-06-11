'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {setcookie,getcookie} from '../../../components/SetCooke'
import { languageUpdate } from "@/lib/action/user"

const Pages = ()=>{
    const language= {
        "af": "afrikaans",
        "am": "amharic",
        "ar": "arabic",
        "az": "azerbaijani",
        "be": "belarusian",
        "bg": "bulgarian",
        "bn": "bengali",
        "bs": "bosnian",
        "ca": "catalan",
        "ceb": "cebuano",
        "co": "corsican",
        "cs": "czech",
        "cy": "welsh",
        "da": "danish",
        "de": "german",
        "el": "greek",
        "en": "english",
        "eo": "esperanto",
        "es": "spanish",
        "et": "estonian",
        "eu": "basque",
        "fa": "persian",
        "fi": "finnish",
        "fr": "french",
        "fy": "frisian",
        "ga": "irish",
        "gd": "scots gaelic",
        "gl": "galician",
        "gu": "gujarati",
        "ha": "hausa",
        "haw": "hawaiian",
        "he": "hebrew",
        "hi": "hindi",
        "hmn": "hmong",
        "hr": "croatian",
        "ht": "haitian creole",
        "hu": "hungarian",
        "hy": "armenian",
        "id": "indonesian",
        "ig": "igbo",
        "is": "icelandic",
        "it": "italian",
        "iw": "hebrew",
        "ja": "japanese",
        "jw": "javanese",
        "ka": "georgian",
        "kk": "kazakh",
        "km": "khmer",
        "kn": "kannada",
        "ko": "korean",
        "ku": "kurdish (kurmanji)",
        "ky": "kyrgyz",
        "la": "latin",
        "lb": "luxembourgish",
        "lo": "lao",
        "lt": "lithuanian",
        "lv": "latvian",
        "mg": "malagasy",
        "mi": "maori",
        "mk": "macedonian",
        "ml": "malayalam",
        "mn": "mongolian",
        "mr": "marathi",
        "ms": "malay",
        "mt": "maltese",
        "my": "myanmar (burmese)",
        "ne": "nepali",
        "nl": "dutch",
        "no": "norwegian",
        "ny": "chichewa",
        "or": "odia",
        "pa": "punjabi",
        "pl": "polish",
        "ps": "pashto",
        "pt": "portuguese",
        "ro": "romanian",
        "ru": "russian",
        "sd": "sindhi",
        "si": "sinhala",
        "sk": "slovak",
        "sl": "slovenian",
        "sm": "samoan",
        "sn": "shona",
        "so": "somali",
        "sq": "albanian",
        "sr": "serbian",
        "st": "sesotho",
        "su": "sundanese",
        "sv": "swedish",
        "sw": "swahili",
        "ta": "tamil",
        "te": "telugu",
        "tg": "tajik",
        "th": "thai",
        "tl": "filipino",
        "tr": "turkish",
        "ug": "uyghur",
        "uk": "ukrainian",
        "ur": "urdu",
        "uz": "uzbek",
        "vi": "vietnamese",
        "xh": "xhosa",
        "yi": "yiddish",
        "yo": "yoruba",
        "zh-cn": "chinese (simplified)",
        "zh-tw": "chinese (traditional)",
        "zu": "zulu"
      }
      
      const [selected,setSelected] = useState()
      const route = useRouter();
      const handlelang = async()=>{
        await languageUpdate(selected);
        await setcookie();
        route.back()
      }
    useEffect(()=>{
        async function gets() {
        setSelected(await getcookie())
        }
        gets()
    },[])
    return(<>
        <div className="h-screen">
            <div className="flex justify-center scroll-smooth h-5/6">
                <div className=" shadow-lg rounded-lg">
                    <div className="m-2">
                        <h1 className="font-bold">Content Settings</h1>
                        <h3 className="p-2 w-96">Select a language for translation. This tells us which language you understand well.</h3>
                    </div>
                    <div className="flex flex-col p-6 mx-4 overflow-x-auto h-5/6">
                        {Object.keys(language).map((key)=>(
                            <label className={`capitalize w-96 border rounded-lg p-2 space-x-12 m-1 pl-8 ${key===selected?"bg-sky-200":null}`} >
                                <input type="radio" id="lang" name="lang" value={key} checked={key===selected} onChange={(e)=>{
                                    setSelected(e.target.value)
                                }} /> 
                                <span>{language[key]}</span>
                            </label>
                        ))}
                        
                    </div>
                    <div className="flex justify-end space-x-3 m-1">
                        <button className="btn rounded-lg bg-blue-500 text-white hover:bg-blue-700" onClick={handlelang}>save change</button>
                        <button className="btn rounded-lg" onClick={route.back}>close</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Pages

