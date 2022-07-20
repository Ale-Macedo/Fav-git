export class GithubUser{
  static search(UserName){
    const endpoint = `https://api.github.com/users/${UserName}`

    return fetch(endpoint).then(data => data.json())
    .then(
      ({login, name, public_repos, followers}) => 
        (
          {
          login,
          name,
          public_repos,
          followers,
          }
        )
    )
  }
}


export class Favorites{
  constructor(root){
    this.root = document.querySelector(root)
    this.load()

    GithubUser.search('Ale-Macedo').then(BANANA => console.log(BANANA))
  }

  load(){
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    console.log(this.entries)
    
    
    //   const entries = [
      //     {
        //     login: 'IgorSalvador',
        //     name: "Igor Salvador",
        //     public_repos: '333',
        //     followers: '666'
        //     }
        
        //   ]
        // this.entries = entries
  }
      
  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries) )
  }

  async add(username) {
        try{ 

          const userExists = this.entries.find(entry => entry.login.toUpperCase() === username.toUpperCase())

          if(userExists){
            throw new Error('Github ja favoritado')
          }

          const githubuser = await GithubUser.search(username)
          console.log(githubuser)
          if(githubuser.login === undefined){
            throw new Error('Github não encontrado')
          }
    
          this.entries = [githubuser, ...this.entries]
          // ... adiciona delementos que existiam no this.entries antigo 
          this.update()
          this.save()
    
        }catch(error){ alert(error.message)}
  }

  delete(user){
        const filterendEntries = this.entries.filter(entry => entry.login != user.login)
        console.log(filterendEntries)
        
        this.entries = filterendEntries
        this.update()
        this.save()
  }
}

    export class FavoritesView extends Favorites{
      constructor(root){
        super(root)
    this.tbody = this.root.querySelector('table tbody')
    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const {value} = this.root.querySelector('.search input')
      console.log(value)
      this.add(value)
    }

  }


  update(){
    this.removeAllTr()

    


    this.entries.forEach(user => {
      console.log(user)
      const row = this.createRow()
      console.log(row)
      
      row.querySelector('.user img').src=`https://github.com/${user.login}.png`
      row.querySelector('.user img').alt =`imagem de ${user.name}`

      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user span').textContent = `@${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('.remove').onclick = () => {
        const isOk = confirm(`Deseja remover ${user.login} ?`)
        if(isOk){
          this.delete(user)
        }
      }

      this.tbody.append(row)
    });
      
  
}

  removeAllTr(){
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    });
  }

  createRow(){
    const tr = document.createElement('tr')
    const content = `
            <td class="user">
              <img src="https://github.com/Ale-Macedo.png" alt="imagem de Ale-Macedo">
              <a href="https://github.com/Ale-Macedo" target="_blank">
                <p>Ale Macedo</p>
                <span>Ale-Macedo</span>
              </a>
            </td>

            <td class="repositories">
              333
            </td>

            <td class="followers">
              666
            </td>
            
            <td class="tdRemove">
              <button class="remove">Remover</button>
            </td>
    
    `
    tr.innerHTML = content

    return tr
  }
}