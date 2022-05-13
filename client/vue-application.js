const Home = window.httpVueLoader('./components/Home.vue')
const Panier = window.httpVueLoader('./components/Panier.vue')
const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')
const Account = window.httpVueLoader('./components/Account.vue')
const SearchR = window.httpVueLoader('./components/SearchResult.vue')

const routes = [
  { path: '/', component: Home },
  { path: '/panier', component: Panier },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/account', component: Account },
  { name:"searchR",path: '/searchResult', component: SearchR },
]

const router = new VueRouter({
  routes
})

var app = new Vue({
  router,
  el: '#app',
  data: {
    livres: [],
    panier: {
      createdAt: null,
      updatedAt: null,
      livres: []
    },
    message:null,
    user: {},
    isConnected: false,
    type:null,
    searchResult : [],
  },
  async mounted () {
    const res = await axios.get('/api/livres')
    this.livres = res.data
    // const res2 = await axios.get('/api/panier')
    // this.panier = res2.data
    try {
      const res3 = await axios.get('/api/me')
      this.user = res3.data
      this.isConnected = true
    } catch (err) {
      // if (err.response && err.response.statusCode === 401) {
      if (err.response?.status === 401) {
        this.isConnected = false
      } else {
        console.log('error', err)
      }

    }
  },
  methods: {
    logout(){
      res.redirect('/');
    },
    async addArticle (article) {
      const res = await axios.post('/api/article', article)
      this.livres.push(res.data)
    },
    async updateArticle (newArticle) {
      await axios.put('/api/article/' + newArticle.id, newArticle)
      const article = this.livres.find(a => a.id === newArticle.id)
      article.name = newArticle.name
      article.description = newArticle.description
      article.image = newArticle.image
      article.price = newArticle.price
    },
    async deleteArticle (articleId) {
      await axios.delete('/api/article/' + articleId)
      const index = this.livres.findIndex(a => a.id === articleId)
      this.livres.splice(index, 1)
    },
    async pay () {
      await axios.post('/api/pay')
      this.panier.livres = []
    },
    async login (user) {
      const res7 = await axios.post('/api/login', user)
      this.user = res7.data
      this.isConnected = true;
      const res4 = await axios.get('/api/userType')
      this.type = res4.data
      this.$router.push('/')

    },
    async search(info) {
      const res5 = await axios.post('/api/search/'+ info)
      this.searchResult = res5.data
      console.log(this.searchResult)
      this.$router.push({name:"searchR",params:{data:this.searchResult }})
    },
  }
})
