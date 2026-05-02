from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import TokenTextSplitter
from langchain_text_splitters import RecursiveCharacterTextSplitter
data = PyPDFLoader("document loaders/resume.pdf")
docs=data.load()
# spiltter=TokenTextSplitter(chunk_size=100,chunk_overlap=10)
spiltter=RecursiveCharacterTextSplitter(chunk_size=100,chunk_overlap=10)
chunks=spiltter.split_documents(docs)

for i in chunks:
    print(i.page_content)
    print("***************")