# from langchain_community.vectorstores import Chroma
from langchain_community.vectorstores import Chroma

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from dotenv import load_dotenv
load_dotenv()
from langchain_core.documents import Document
docs=[
    Document(page_content="Python is a high-level programming language.", metadata={"source": "Pthon Book"}),
    Document(page_content="Django is a high-level Python web framework.", metadata={"source": "Django book"}),
    Document(page_content="Gen ai is a field of artificial intelligence.", metadata={"source": "Gen ai book"})
    
]

embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
vecttorstore = Chroma.from_documents(
    documents=docs,
    embedding=embedding_model,
    persist_directory="chroma-db"
)
# result=vecttorstore.similarity_search("What is Python?", k=2)

# for r in result:
#     print(r);

retriver=vecttorstore.as_retriever()

docs=retriver.invoke("Explain gen ai")
for d in docs:
    print(d)



