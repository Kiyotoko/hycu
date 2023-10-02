const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hycu', {
	getArticles: () => ipcRenderer.invoke('hycu:get-articles'),
	getArticle: (id) => ipcRenderer.invoke('hycu:get-article', id),
	setArticle: (id, title, author, content) => ipcRenderer.invoke('hycu:set-article', id, title, author, content),
	addArticle: (title, author, content) => ipcRenderer.invoke('hycu:add-article', title, author, content),
	delArticle: (id) => ipcRenderer.invoke('hycu:del-article', id)
})