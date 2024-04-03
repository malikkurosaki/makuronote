from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders.pdf import OnlinePDFLoader
from langchain.vectorstores.chroma import Chroma
from langchain.embeddings.gpt4all import GPT4AllEmbeddings
from langchain.prompts import PromptTemplate
from langchain.llms.ollama import Ollama
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.chains.retrieval_qa.base import RetrievalQA
from langchain.document_loaders.text import TextLoader
from langchain.embeddings.ollama import OllamaEmbeddings
from flask import Flask, request, Response

app = Flask(__name__)

loader = TextLoader("./assets/faq.txt", encoding="utf-8")
data = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
all_splits = text_splitter.split_documents(data)

oembed = OllamaEmbeddings(model="nomic-embed-text", temperature=0.7)

# with SuppressStdout():
vectorstore = Chroma.from_documents(documents=all_splits, embedding=oembed)

# Prompt
template = """Gunakan potongan konteks berikut untuk menjawab pertanyaan di akhir. 
Jika Anda tidak tahu jawabannya, katakan saja bahwa Anda tidak tahu, jangan mencoba membuat jawaban. 
Gunakan maksimal tiga kalimat dan pertahankan jawaban sesingkat mungkin. 
{context}
Pertanyaan: {question}
Jawaban yang Membantu:"""
QA_CHAIN_PROMPT = PromptTemplate(
    input_variables=["context", "question"],
    template=template,
)

llm = Ollama(model="llama2", temperature=0.7, callback_manager=CallbackManager(
    [StreamingStdOutCallbackHandler()]))

qa_chain = RetrievalQA.from_chain_type(
    llm,
    retriever=vectorstore.as_retriever(),
    chain_type_kwargs={"prompt": QA_CHAIN_PROMPT},
)


@app.route("/ask")
def ask():
    question = request.args.get("question")
    def generate_chunks():
        for chunk in qa_chain.stream(question):
            print(chunk['result'], end="", flush=True)
            yield chunk

    # Return a streaming response
    return Response("apa")


if __name__ == "__main__":
    app.run(debug=True)
