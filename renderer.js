var articleId = 1

async function read() {
    try {
        const row = await window.hycu.getArticle(articleId)
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
		const row = await window.hycu.getArticle(articleId)
        container.innerHTML = ''

        const title = document.createElement('input')
        title.type = 'text'
        title.classList.add('input')
        title.value = row.title
        container.appendChild(title)

        const author = document.createElement('input')
        author.type = 'text'
        author.classList.add('input')
        author.value = row.author
        container.appendChild(author)

        const content = document.createElement('textarea')
        content.classList.add('input')
        content.value = row.content
        container.appendChild(content)

        container.appendChild(document.createElement('div'))

        const button = document.createElement('button')
        button.innerText = 'Save and Exit'
        button.addEventListener('click', async event => {
            await window.hycu.setArticle(articleId, title.value, author.value, content.value)
            document.getElementById('' + articleId).innerText = title.value
            read()
        })
        container.appendChild(button)
	} catch (e) {
		console.error(e)
	}
}

async function init() {
    const container = document.getElementById('sidebar')
    const rows = await window.hycu.getArticles()
    const addArticle = (id, title) => {
        const element = document.createElement('div')
        element.addEventListener('click', event => {
            articleId = id
            document.getElementById('mode').innerText = 'Read'
            read()
        })
        element.innerText = title
        element.id = id
        element.classList.add('sidebar-item')
        container.appendChild(element)
    }

    const button = document.createElement('button')
    button.addEventListener('click', async event => {
        const result = await window.hycu.addArticle('Unknown', 'Unknown', 'Coming Soon')
        addArticle(result, 'Unknown')
    })
    button.innerText = 'New Article ...'
    container.appendChild(button)
    for (let row of rows) {
        addArticle(row.id, row.title)
    }
}

init()

document.getElementById('mode').addEventListener('click', event => {
    if (event.target.innerText == 'Cancel') {
        read()
        event.target.innerText = 'Edit'
    } else {
        edit()
        event.target.innerText = 'Cancel'
    }
})
document.getElementById('delete').addEventListener('click', event => {
    window.hycu.delArticle(articleId)
    document.getElementById('' + articleId).remove()
})