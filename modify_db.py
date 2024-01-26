

from pymongo import MongoClient

# Create a MongoDB client
client = MongoClient('mongodb://pleasefixme:0BEDvaSWdJu9fl7Tk3YSC98pk9soDhS1tcvG2a8fMLDCQwwamJnkM1KMeHPcDMyv8mlyiXryNZQRACDbCzubkg==@pleasefixme.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@pleasefixme@')

# Specify the database
db = client['dev']
# db = client['prod']

# Specify the collection
collection = db['bugs']

# collection.drop()

# Document to be added
document = {
  "id": "96db21a3-bb62-41bd-8fdb-72159222d136",
  "product": "Apple iOS 18",
  "description": "The weather app radar does not load",
  "submittedBy": "nceccar@bu.edu"
}

# Insert the document into the collection
collection.insert_one(document)