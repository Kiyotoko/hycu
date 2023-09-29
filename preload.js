const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './data.db',
  },
  useNullAsDefault: false
});

async function create(author, title, content) {
	await knex('articles').insert({ author: author, title: title, content: content });
}

async function boot() {
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

var articleId = 1

async function preview() {
	try {
		await knex('articles').where({ id: articleId})
		.select('author', 'title', 'content').first().then(data => {
			let element = document.getElementById('preview')
			element.innerHTML = '<h1>' + data.title + '</h1>'
			element.innerHTML += '<p><i>by ' + data.author + '</i><p>'
			element.innerHTML += '<p>' + data.content + '</p>'
		})
	} catch (e) {
		console.error(e)
	}
}

async function init() {
	try {
		boot()
		const container = document.getElementById('articles')
		const rows = await knex('articles')
			.select('id', 'title');
		for (let row of rows) {
			let element = document.createElement('li')			
			element.addEventListener('click', event => {
				articleId = row.id
				preview()
			})
			element.innerText = row.title
			container.appendChild(element)
		}
	} catch (e) {
		console.error(e);
	}
}

async function setTitle(title) {
	await knex('articles').where({ id: articleId }) .update({ title: title })
}

async function setAuthor(author) {
	await knex('articles').where({ id: articleId }) .update({ author: author })
}

async function setContent(content) {
	await knex('articles').where({ id: articleId }) .update({ content: content })
}

window.addEventListener('DOMContentLoaded', () => {
	init()

	document.getElementById('title-editor').addEventListener('change', change => {
		setTitle(change.target.value)
		preview()
	})
	document.getElementById('author-editor').addEventListener('change', change => {
		setAuthor(change.target.value)
		preview()
	})	
	document.getElementById('content-editor').addEventListener('change', change => {
		setContent(change.target.value)
		preview()
	})
})