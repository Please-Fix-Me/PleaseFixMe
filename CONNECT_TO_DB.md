# Connecting to the DB for dev work

I tried out some software for visualizing MongoDB, and I found a VS Code extension that seems to work very well. 

It is called [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb).

To set it up, you:

* Install the extension
* Click the new A (Azure) icon on the left of VS Code.
* Under Workspace, click the three blue circles (database)
* Click "Attach Database Account"
* Select MongoDB
* Copy-Paste the connection string Will sent. It should also be located in the .env.local file.
* After some loading, you should see dev and prod databases. 