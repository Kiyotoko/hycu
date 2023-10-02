const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './data.db',
  },
  useNullAsDefault: false
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

const createTable = async () => {
  try {
    const exists = await knex.schema.hasTable('articles')
    if (!exists) {
      await knex.schema.createTable('articles', (table) => {
        table.increments('id');
        table.string('author');
        table.string('title');
        table.string('content');
      })
    }
  } catch (e) {
    console.error(e);
  }
}

ipcMain.handle('articles:get-articles', async (event) => {
  return await knex('articles').select('id', 'title', 'author', 'content')})
ipcMain.handle('articles:get-article', async (event, id) => {
  return await knex('articles').where({ id: id }).select('title', 'author', 'content').first()})
ipcMain.handle('articles:set-article', async (event, id, title, author, content) => {
  return await knex('articles').where({ id: id }).update({ title: title, author: author, content: content })})
ipcMain.handle('articles:add-article', async (event, author, title, content) => {
  return await knex('articles').insert({ author: author, title: title, content: content })})

app.whenReady().then(() => {
  createTable()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})