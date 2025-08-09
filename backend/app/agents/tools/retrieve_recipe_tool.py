from langchain_core.tools import tool
from langchain.chains import RetrievalQA
from backend.app.agents.config import (get_llm_for_retrieve_recipe, 
                              get_retriever_for_retrieve_recipe,
                              get_vectordb_for_retrieve_recipe)


llm = get_llm_for_retrieve_recipe()
retriever = get_retriever_for_retrieve_recipe()
vectordb = get_vectordb_for_retrieve_recipe()


rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True,
)

@tool("recipe_retrieve_tool", description="Retrieve recipe information including description, ingredients, directions, and nutrition for a given recipe name or query.")
def recipe_retrieve_tool(query: str) -> str:
    try:
        result = rag_chain.invoke(query)["result"]
        if not result or result.strip() == "":
            return f"No recipe found for '{query}'. Please try a different recipe name."
        return result
    except Exception as e:
        return f"Error retrieving recipe for '{query}': {str(e)}"
