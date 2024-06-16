# main.py
from fastapi import FastAPI,Depends,Request, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
import models,schemas,crud
from database import SessionLocal, engine
from pathlib import Path
import os

from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from dotenv import load_dotenv

# if needed to extract the text
import PyPDF2

# adding cors headers
from fastapi.middleware.cors import CORSMiddleware

# ....langchain....
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFaceHub
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyMuPDFLoader
# ....langchain....

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
upload_dir = Path(__file__).parent / 'uploads'

# adding cors urls 
origins = [
    'http://localhost:5173',
]

# adding middleware
app.add_middleware(
CORSMiddleware,
allow_origins=origins, # Allows all origins
allow_credentials=True,
allow_methods=["*"], # Allows all methods
allow_headers=["*"], # Allows all headers
)
# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


load_dotenv()


@app.get("/")
def read_item():
  item=models.get_item()  
  return {"message":"hello fastapi !","file_name":item.file_name}


@app.post("/items/")
async def create_upload_file(file_upload: UploadFile=File(...)):
    try:
    #  save the file in localmemory
     contents = await file_upload.read()
    #  save file in database
     models.create_item(file_upload.name)
    # Process the file contents here as needed
     save_to=upload_dir / file_upload.filename
     with open(save_to,'wb') as f:
            f.write(contents)
            
     return {"status": "File Uploaded !!","file":file_upload.filename}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/ask-questions/")
async def process_item(file:str=Form(...),input_text:str = Form(...)):
    # file='new-pdf.pdf'
    loader = PyMuPDFLoader(upload_dir/file)
    documents = loader.load()
    embedding = HuggingFaceEmbeddings()
    print('below embed')
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    text = text_splitter.split_documents(documents)
    print('line 3')
    db = Chroma.from_documents(documents=text, embedding=embedding)
    # global llm
    llm = HuggingFaceHub(huggingfacehub_api_token=os.getenv('HUGGINGFACEHUB_API_TOKEN'),repo_id="OpenAssistant/oasst-sft-1-pythia-12b", model_kwargs={"temperature": 1.0, "max_length": 256})
    global chain
    chain = RetrievalQA.from_chain_type(llm=llm,chain_type="stuff",retriever=db.as_retriever())
    answer=chain.run(input_text)
    index=answer.find("Helpful Answer")
    answer=answer[index+15:]
    print(answer)
    print('complete')
    return {'message':'Document has successfully been loaded',"answer":answer}




@app.get("/items/{item_id}", response_model=schemas.Item)
def save_item(item_id: int, db: Session = Depends(get_db)):
    db_item = crud.get_item(db, item_id=item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item



async def process_pdf(pdf_source):
    # Process the PDF from URL or local file  
   
    file =  open(upload_dir/pdf_source, 'rb')
    # Extract text from PDF
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""
    for page in range(len(pdf_reader.pages)):
        text += pdf_reader.pages[page].extract_text()
    print(text,'hey this is text')
    file.close()
    
    return text



if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)