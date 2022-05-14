const Home = window.httpVueLoader('./components/Home.vue')
const Panier = window.httpVueLoader('./components/Panier.vue')
const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')
const Account = window.httpVueLoader('./components/Account.vue')
const SearchR = window.httpVueLoader('./components/SearchResult.vue')
const AddForm = window.httpVueLoader('./components/AddForm.vue')

const routes = [
    {path: '/', component: Home},
    {path: '/panier', component: Panier},
    {path: '/register', component: Register},
    {path: '/login', component: Login},
    {path: '/account', component: Account},
    {name: "searchR", path: '/searchResult', component: SearchR},
    {name: "addForm", path: '/addForm', component: AddForm},
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
        message: null,
        user: {},
        isConnected: false,
        type: null,
        searchResult: [],
        borowedBooks: [],
    },

    async mounted() {
        // const res = await axios.get('/api/livres')
        // this.livres = res.data

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
        async getBorowed() {
            const res = await axios.get('api/borowedBooks')
            this.borowedBooks = res.data
        },
         logout() {
             axios.get('api/logout')
        },
        async addBookToCart(livre) {
            const res2 = await axios.get('api/panierId')
            const res = await axios.post('api/panier/', livre)
            const res3 = await axios.get('api/panier')
            this.panier.livres = res3.data
        },
        async getCart() {
            const res2 = await axios.get('api/panierId')
            const res3 = await axios.get('api/panier')
            this.panier.livres = res3.data
        },
        async deleteFromCart(itemId) {
            await axios.delete('/api/panier/' + itemId)
            const res3 = await axios.get('api/panier')
            this.panier.livres = res3.data
        },
        async borow(item) {
            await axios.post('api/borow/', item)
            const res3 = await axios.get('api/panier')
            this.panier.livres = res3.data
        },

        async login(user) {
            const res7 = await axios.post('/api/login', user)
            this.user = res7.data
            this.isConnected = true;
            const res4 = await axios.get('/api/userType')
            this.type = res4.data
            this.$router.push('/')

        },
        async search(info) {
            const res5 = await axios.post('/api/search/' + info)
            this.searchResult = res5.data
            console.log(this.searchResult)
            this.$router.push({name: "searchR", params: {data: this.searchResult}})
        },
        adminAddBook(bookInfo){
            axios.post('/api/addBook',bookInfo)
            this.$router.push('/')
        }
    }
})
