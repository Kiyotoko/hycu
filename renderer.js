var articleId = 1

async function read() {
    try {
        const row = await window.articles.getArticle(articleId)
        const element = document.getElementById('content')
        element.innerHTML = '<h1>' + row.title + '</h1>'
        element.innerHTML += '<i>by ' + row.author + '</i>'
        element.innerHTML += '<p>' + row.content + '</p>'        
	} catch (e) {
		console.error(e)
	}
}

async function edit() {
    try {
        const container = document.getElementById('content')
		const row = await window.articles.getArticle(articleId)
        container.innerHTML = '<input type="text" class="input" id="editor-title" value="' + row.title + '">'
        container.innerHTML += '<input type="text" class="input" id="editor-author" value="' + row.author + '">'
        container.innerHTML += '<textarea id="editor-content" class="input" name="text">' + row.content + '</textarea><p>'
        const element = document.createElement('button')
        element.innerText = 'Save and Exit'
        element.addEventListener('click', async event => {
            await window.articles.setArticle(articleId, document.getElementById('editor-title').value, document.getElementById('editor-author').value, document.getElementById('editor-content').value)
            read()
        })
        container.appendChild(element)
	} catch (e) {
		console.error(e)
	}
}

async function init() {
    const container = document.getElementById('articles')
    const rows = await window.articles.getArticles()
    console.log(rows)
    for (let row of rows) {
        const element = document.createElement('div')		
        element.addEventListener('click', event => {
            articleId = row.id
            document.getElementById('mode').innerText = 'Read'
            read()
        })
        element.innerText = row.title
        element.classList.add('sidebar-item')
        container.appendChild(element)
    }
}

init()

document.getElementById('mode').addEventListener('click', event => {
    if (event.target.innerText == 'Edit') {
        read()
        event.target.innerText = 'Read'
    } else {
        edit()
        event.target.innerText = 'Edit'
    }
})