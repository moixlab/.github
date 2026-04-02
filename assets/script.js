class MoixRepos extends HTMLElement {
    constructor() {
        super();
        this.loadData();
    }

    async loadData() {
        const now = Date.now(), 
            updatedAt = parseInt(localStorage.getItem('updated_at')), 
            timestamp = 60 * 60 * 1000;

        if (!updatedAt || (now - updatedAt) > timestamp) {
            let response = await fetch('https://api.github.com/orgs/moixlab/repos?sort=updated&direction=desc');
            
            if (response.ok) {
                const repos = await response.json();

                localStorage.setItem('repos', JSON.stringify(repos));
                localStorage.setItem('updated_at', now);
            }
        }

        this.render();
    }

    getData() {
        return JSON.parse(localStorage.getItem('repos'));
    }

    render() {
        const update = document.createElement('span'),repos = this.getData(),
        reposView = repos
            .filter(x => x.name != '.github')
            .map(x => {
                return `<h3>${ x.name.toUpperCase() } <sup>${ x.language || 'Markdown' }</sup> <sub>${ x.updated_at }</sub></h3>
                <p>${ x.description }..<a href="${ x.html_url }" target="_blank">[Visitar&raquo;]</a></p>`;
            });
        this.innerHTML = 
            `<header><h2>Repositorios</h2></header><article>${ reposView.join('') }</article><footer></footer>`;
        update.addEventListener('click', () => {
            localStorage.clear();
            location.reload();
        });
        update.innerHTML = 'Actualizar';
        this.querySelector('footer').appendChild(update);
        this.style.display = 'inline-block';
    }
}

customElements.define('moix-repos', MoixRepos);