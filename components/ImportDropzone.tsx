import React, { useCallback, useState } from 'react'

export default function ImportDropzone({ onFiles }: { onFiles: (files: File[]) => void }){
  const [drag, setDrag] = useState(false)

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDrag(false)
    const files = Array.from(e.dataTransfer.files)
    onFiles(files)
  }, [onFiles])

  return (
    <div onDragOver={(e)=>{e.preventDefault(); setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={onDrop} className={`w-full border-2 ${drag? 'border-accent bg-gray-900/50':'border-gray-800'} rounded-2xl p-6 text-center`}> 
      <div className="text-lg font-semibold">Drop your statement here</div>
      <div className="text-sm text-gray-400 mt-2">PDF, CSV, XLSX, JSON, PNG, JPG — Max 20MB</div>
      <div className="mt-4">
        <input type="file" onChange={(e)=> e.target.files && onFiles(Array.from(e.target.files))} className="hidden" id="fileInput" />
      </div>
    </div>
  )
}
