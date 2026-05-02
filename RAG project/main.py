# from dotenv import load_dotenv
# from langchain_mistralai import ChatMistralAI
# # from langchain_community.document_loaders import TextLoader 
# from langchain_community.document_loaders import PyPDFLoader 
# from langchain_core.prompts import ChatPromptTemplate
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# load_dotenv()

# data = PyPDFLoader("document loaders/DL.pdf");
# docs = data.load()


# splitter=RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=200)
# chunks=splitter.split_documents(docs)

# template=ChatPromptTemplate.from_messages([
#     ("system", "you are a ai that summarizes the text"),
#     ("human","{data}")
# ])

# model = ChatMistralAI(model="mistral-small-2506")

from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import ChatPromptTemplate
load_dotenv()
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

# vectorstore = Chroma.from_documents(
#     persist_directory="chroma-db",
#     embedding_function=embedding_model
# )

vectorstore = Chroma(
    persist_directory="chroma-db",
    embedding_function=embedding_model
)


retriever  = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k":4,
        "fetch_k":10,
        "lambda_mult":0.5
    }
)
llm=ChatMistralAI(model="mistral-small-2506")

#prompt template
prompt=ChatPromptTemplate.from_messages([
    ("system",
     """Your are a helpful AI assistant.
     Use only provided contex to answer the question.

     If the answer is not present in the contex,
     say : "I could not find the answer in the document. ,"
    """),
    (
        "human","""context:
        {context}:
        Question:
        {question}

            """
    )
])

# print("Rag system created")
# print("press 0 to exit")

# while True:
#     query=input("you : ")
#     if(query=='0'):
#         break
#     docs=retriever.invoke(query)

#     context="\n\n".join(
#         [doc.page_content for doc in docs]
#     )
#     final_prompt=prompt.invoke({
#         "context" : context,
#         "question": query
#     })

#     response=llm.invoke(final_prompt)
#     print(f"\n AI: {response.content}")

def ask_question(query):

    docs = retriever.invoke(query)

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    final_prompt = prompt.invoke({
        "context": context,
        "question": query
    })

    response = llm.invoke(final_prompt)

    return response.content

    
