from langchain_community.document_loaders import WebBaseLoader
data = WebBaseLoader("https://www.cricbuzz.com/live-cricket-scorecard/151943/pbks-vs-rr-40th-match-indian-premier-league-2026")
docs=data.load()
print(docs[0].page_content)