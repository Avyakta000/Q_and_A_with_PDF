This application has all the required functionality from uploading file to processing it to do the retrieval for the query provided by a client. 
It takes use of Fastapi to handle backend processing;
For NLP related query langchain has been used specifically the HuggingFace Model 
Pypdf has been used to load the pdf and pass the document to langchain for building embeddings and creatings vectorestore 
finally the vectore store is feed to the HuggingFaceHub instance,and finally the model is ready to answer a query based on the content of the pdf

The llm could have been improvised further , using openAi model could do the job however it comes with a pricing which is imposed after a certain number of 
credits or frequent requests

to sumup this the application has the capability to provide user with a precise answer based on what is has learnt langchain , corsmiddleware 
, huggingface were the major libraries used.



....................................................ends.................................................................................................................
