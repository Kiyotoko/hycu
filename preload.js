const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('articles', {
	getArticles: () => ipcRenderer.invoke('articles:get-articles'),
	getArticle: (id) => ipcRenderer.invoke('articles:get-article', id),
	setArticle: (id, title, author, content) => ipcRenderer.invoke('articles:set-article', id, title, author, content),
	addArticle: (title, author, content) => ipcRenderer.invoke('articles:add-article', title, author, content)
})