
export async function POST(params) {
    const {text,target}= await params.json()
    console.log(text,target)
    const res = await fetch("http://localhost:1234/languagedetect", {
        method: "POST",
        body: JSON.stringify({
          "text": text,
          "source": "en",
          "target": target,
          "format": "text"
        }),
        headers: { "Content-Type": "application/json" }
      });
    const data = await res.json()
      
    return Response.json(data)
}