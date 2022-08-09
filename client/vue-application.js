const Home = window.httpVueLoader('./components/Home.vue')
const About = window.httpVueLoader('./components/About.vue')
const SearchR = window.httpVueLoader('./components/SearchResult.vue')

const routes = [
    {path: '/', component: Home},
    {path: '/about', component: About},
    {name: "searchR", path: '/searchResult', component: SearchR},
]

const router = new VueRouter({
    routes
})



var app = new Vue({

    router,
    el: '#app',
    data: {
        searchResult: [],
    },

    async mounted() {

    },
    methods: {

        async search(fact) {
            const res5 = await axios.get('https://factchecktools.googleapis.com/v1alpha1/claims:search?query=' + fact+'&languageCode=fr&key='+API_KEY)

                .then((res5) => {

                    console.log(`Status: ${res5.status}`);

                    console.log('Body: ', res5.data.claims);
                    this.searchResult = res5.data.claims
                    this.$router.push({name: "searchR", params: {data: this.searchResult}})

                }).catch((err) => {

                    console.error(err);

                });
        },
    }
})
