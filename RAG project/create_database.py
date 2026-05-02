# from langchain_community.document_loaders import PyPDFLoader 
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# # from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from langchain_huggingface.embeddings import HuggingFaceEmbeddings
# # from langchain_community.vectorstores import FAISS
# from langchain_community.vectorstores import Chroma
# from dotenv import load_dotenv
# load_dotenv()
# loader=PyPDFLoader("document loaders/DL.pdf")
# docs=loader.load()
# splitter=RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=200)
# chunks=splitter.split_documents(docs)
# embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

# vecttorstore = Chroma.from_documents(
#     documents=chunks,
#     embedding=embedding_model,
#     persist_directory="chroma-db"
# )
# print("Vectorstore saved successfully!")


# from langchain_community.document_loaders import PyPDFLoader 
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

load_dotenv()


def create_vector_db(pdf_path):

    loader = PyPDFLoader(pdf_path)
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_documents(docs)

    embedding_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-mpnet-base-v2"
    )

    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model,
        persist_directory="chroma-db"
    )

    print("Vectorstore saved successfully!")