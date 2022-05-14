const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');

const {Sequelize} = require("sequelize");
const jwt = require("jsonwebtoken");

const sequelize = new Sequelize("eftheque", "root", "",
    {
        dialect: "mysql",
        host: "localhost"
    });


const users = []

class Panier {
    constructor() {
        this.createdAt = new Date()
        this.updatedAt = new Date()
        this.livres = []
    }
}

//le login
router.post('/login', async (req, res) => {
    const pseudo = req.body.pseudo
    const password = req.body.password

    try {
        sequelize.authenticate();
        await sequelize.query("SELECT *  FROM user WHERE login = '" + pseudo + "'")
            .then(
                ([result, metadata]) => {
                    // console.log(result);
                    // res.json(result);
                    //création de l'utilisateur à partir des infos trouvés
                    if (result.length > 0) {

                        const user = result[0]

                        if (bcrypt.compare(password, user.pwd)) {
                            // alors connecter l'utilisateur
                            // const payload = {
                            //     check:true
                            // }
                            // //définition de l'expiration du token de connexion
                            // const token = jwt.sign(payload,keys,{
                            //     expiresIn:'1h'
                            // })
                            req.session.userId = user.id_user
                            req.session.userPseudo = user.login
                            req.session.panier = new Panier()
                            // req.session.token = token
                            res.json({
                                id: user.id_user,
                                pseudo: user.login,
                                type: user.profil
                                // token:token
                            })
                        } else {
                            res.status(401).json({
                                message: 'Mauvais mot de passe'
                            })
                            return
                        }
                    } else {
                        res.status(401).json({
                            message: 'Utilisateur inexistant!'
                        })
                    }
                }
            );
    } catch (error) {
        console.error('Problème de connexion, l\'erreur est la suivante:',
            error);
    }


})

//l'enrregistrement d'un nouvel user
router.post('/register', async (req, res) => {

    const pseudo = req.body.pseudo
    const password = req.body.password
    //on vérifie que ce login est valide
    try {
        sequelize.authenticate();
        await sequelize.query("SELECT *  FROM user WHERE login = '" + pseudo + "'")
            .then(
                ([result, metadata]) => {
                    if (result.length > 0) {
                        res.status(401).json({
                            message: 'Ce login est déjà utilisé'
                        })
                        return
                    }
                    //hashage du mdp
                    const hashPassword = async (password, saltRounds = 10) => {
                        try {
                            // Generation du salt
                            const salt = await bcrypt.genSalt(saltRounds);

                            // Hashage du password
                            return await bcrypt.hash(password, salt);
                        } catch (error) {
                            console.log(error);
                        }

                        // Return null if error
                        return null;
                    };
// Création du profil dans la bd avec le mdp hashé
                    (async () => {
                        const hash = await hashPassword(password);

                        try {
                            sequelize.authenticate();
                            sequelize.query("INSERT INTO user(`login`, `pwd`, `profil`, `actif`)  VALUES('" + pseudo + "','" + hash + "','ETUDIANT',1)")


                        } catch (error) {
                            res.status(401).json({
                                message: 'Une erreur lors de la création du compte est survenue! Veuillez réessayer!'
                            })
                        }
                        try {
                            sequelize.authenticate();
                            sequelize.query("INSERT INTO panier(`login_user`, `date_cr`) VALUES('" + pseudo + "',Now())")
                            res.redirect('#/login')
                        } catch (error) {
                            res.status(401).json({
                                message: 'Une erreur est survenue lors de la création du panier de l\'id du compte!  Veuillez réessayer!'
                            })
                        }
                    })();


                }
            );
    } catch (error) {
        res.status(401).json({
            message: 'Utilisateur inexistant!'
        })
        // console.error('Problème de connexion, l\'erreur est la suivante:',
        //     error);
    }


})

router.get('/userType', async (req, res) => {
    try {
        sequelize.authenticate();
        sequelize.query("SELECT profil FROM user WHERE id_user = '" + req.session.userId + "' ")
            .then(
                ([result, metadata]) => {
                    console.log("taille: " + result.length);
                    console.log("res: " + result[0].profil);
                    if (result.length > 0) {
                        res.send(result[0].profil)
                    }

                })

    } catch (error) {
        res.status(401).json({
            message: 'Une erreur lors de la création du compte est survenue! Veuillez réessayer!'
        })
    }
})

router.get('/me', async (req, res) => {
    if (typeof req.session.userId === 'undefined') {
        res.status(401).json({message: 'not connected'})
        return
    }
    try {
        sequelize.authenticate();
        sequelize.query("SELECT * FROM user WHERE id_user = '" + req.session.userId + "' ")
            .then(
                ([result, metadata]) => {
                    // console.log(result);
                    res.send(result)
                })

    } catch (error) {
        res.status(401).json({
            message: 'Une erreur lors de la création du compte est survenue! Veuillez réessayer!'
        })
    }

    // const result = await client.query({
    //   text: 'SELECT id, email FROM users WHERE id=$1',
    //   values: [req.session.userId]
    // })

    // res.json(result.rows[0])
})

// on définit une variable de session qui contient le panier de l'utilisateur
router.get('/panierId', (req, res) => {
    try {
        sequelize.authenticate();
        //on récupère le panier de l'utilisateur
        sequelize.query("SELECT id_panier FROM panier WHERE login_user = '" + req.session.userPseudo + "' ")
            .then(
                ([result, metadata]) => {
                    req.session.userCartId = result[0]
                    res.send(result[0])
                })
    } catch (error) {
        res.status(401).json({
            message: 'Une erreur est survenue lors de la récupération du panier ! Veuillez réessayer!'
        })
    }
})
router.get('/panier', (req, res) => {
    try {
        sequelize.authenticate();
        //on récupère le panier de l'utilisateur
        sequelize.query(" SELECT pi.id_pi ,pi.qty, pi.id_livre,img FROM panier_item as pi, livre as l WHERE l.id_livre = pi.id_livre AND id_panier = '" + req.session.userCartId.id_panier + "' ")
            .then(
                ([result, metadata]) => {
                    res.send(result)
                })
    } catch (error) {
        res.status(401).json({
            message: 'Une erreur est survenue lors de la récupération du panier ! Veuillez réessayer!'
        })
    }
})

/*
 * Cette route doit ajouter un article au panier, puis retourner le panier modifié à l'utilisateur
 * Le body doit contenir l'id de l'article, ainsi que la quantité voulue
 */
router.post('/panier', (req, res) => {

    const idLivre = req.body.id_livre;
    var qLivre = req.body.qty;
    var idpanier = req.session.userCartId.id_panier
    try {
        sequelize.authenticate();
        //on cherche si l'utilisateur a déjà un panier
        sequelize.query("INSERT INTO `panier_item`(`id_panier`, `qty`, `id_livre`) VALUES (" + idpanier + "," + qLivre + "," + idLivre + ")")
            .then(
                ([result, metadata]) => {
                    res.send('Ajouté au panier')
                })

    } catch (error) {
        res.status(401).json({
            message: 'Une erreur est survenue de l\'ajout dans le panier de ce compte ! Veuillez réessayer!'
        })
    }

})

router.post('/search/:info', async (req, res) => {
    var info = req.params.info;
    try {
        sequelize.authenticate();
        sequelize.query("SELECT * FROM livre WHERE title LIKE '%" + info + "%' OR auth LIKE '%" + info + "%' ")
            .then(
                ([result, metadata]) => {
                    // console.log(result);
                    res.send(result).json()
                })

    } catch (error) {
        res.status(401).json({
            message: 'Une erreur lors de la création du compte est survenue! Veuillez réessayer!'
        })
    }
})

/*
 * Cette route doit permettre de confirmer un panier, en recevant le nom et prénom de l'utilisateur
 * Le panier est ensuite supprimé grâce à req.session.destroy()
 */
router.post('/panier/pay', (req, res) => {
    if (typeof req.session.userId === 'number') {
        res.send('ok')
    } else {
        res.status(401).json({message: 'vous netes pas connecté'})
    }
})

/*
 * Cette route doit permettre de changer la quantité d'un article dans le panier
 * Le body doit contenir la quantité voulue
 */
router.post('/borow', (req, res) => {
    var itemId = req.body.id_item
    var bookId = req.body.id_livre
    try{
        sequelize.authenticate()
        sequelize.query("INSERT INTO `emprunt`(`id_user`, `id_livre`, `date_act`, `date_ech`) VALUES ("+req.session.userId+","+bookId+",Now(),ADDDATE(now(), INTERVAL 1 MONTH))")
        sequelize.query("UPDATE `livre` SET `qty`= qty - 1 WHERE id_livre = "+bookId+"")
        sequelize.query("DELETE FROM panier_item WHERE id_pi="+itemId+"")
        res.send('Livre emprunté')
    }catch (e) {
        res.status(401).json({message: 'Problème d\'emprunt , veuillez réesayer s\'il vous plaît'})
    }
})
router.get('/logout',(req,res)=>{
    req.session.destroy()
})
router.get('/borowedBooks', (req, res) => {

    try{
        sequelize.authenticate()
        sequelize.query("SELECT `id_user`, e.id_livre, `date_act`, `date_ech`, `id_emprunt`, img FROM emprunt as e, livre as l WHERE id_user = "+req.session.userId+" AND e.id_livre = l.id_livre ")
            .then(
                ([result, metadata]) => {
                    res.send(result)
                }
            )
    }catch (e) {
        res.status(401).json({message: 'Problème d\'emprunt , veuillez réesayer s\'il vous plaît'})
    }
})

/*
 * Cette route doit supprimer un article dans le panier
 */
router.delete('/panier/:itemId', (req, res) => {
    var idPanier = req.params.itemId
    // res.send(" " + idPanier)
    try{
    sequelize.authenticate()
        sequelize.query("DELETE FROM panier_item WHERE id_pi="+idPanier+"")
        res.send('Retiré de votre panier')
    }catch (e) {
        res.status(401).json({message: 'Une erreur est survenue lors de la suppression dans le panier'})
    }
})


/**
 * Cette route envoie l'intégralité des articles du site
 */
router.get('/livres', async (req, res) => {
    // const result = await client.query({
    //   text: 'SELECT * FROM articles'
    // })
    // res.json(result.rows)


    try {
        sequelize.authenticate();
        await sequelize.query("SELECT *  FROM livre")
            .then(
                ([result, metadata]) => {
                    // console.log(result);
                    // res.json(result);
                    //création de l'utilisateur à partir des infos trouvés
                    if (result.length > 0) {
                        res.json(result)

                    } else {
                        res.status(401).json({
                            message: 'Aucun livre dans la bibliothèque pour l\'instant'
                        })
                    }
                }
            );
    } catch (error) {
        console.error('Problème de connexion, l\'erreur est la suivante:',
            error);
    }


})

/**
 * Cette route crée un article.
 * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
 * NOTE: lorsqu'on redémarre le serveur, l'article ajouté disparait
 *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
 */
router.post('/article', async (req, res) => {
    const name = req.body.name
    const description = req.body.description
    const image = req.body.image
    const price = parseInt(req.body.price)

    // vérification de la validité des données d'entrée
    if (typeof name !== 'string' || name === '' ||
        typeof description !== 'string' || description === '' ||
        typeof image !== 'string' || image === '' ||
        isNaN(price) || price <= 0) {
        res.status(400).json({message: 'bad request'})
        return
    }

    // articles.push(article)
    // const result = await client.query({
    //   text: `INSERT INTO articles(name, description, image, price)
    //   VALUES ($1, $2, $3, $4)
    //   RETURNING *
    //   `,
    //   values: [name, description, image, price]
    // })
    // const id = result.rows[0].id

    // on envoie l'article ajouté à l'utilisateur
    // res.json({
    //   id: id,
    //   name: name,
    //   description: description,
    //   image: image,
    //   price: price
    // })
})

/**
 * Cette fonction fait en sorte de valider que l'article demandé par l'utilisateur
 * est valide. Elle est appliquée aux routes:
 * - GET /article/:articleId
 * - PUT /article/:articleId
 * - DELETE /article/:articleId
 * Comme ces trois routes ont un comportement similaire, on regroupe leurs fonctionnalités communes dans un middleware
 */
async function parseArticle(req, res, next) {
    const articleId = parseInt(req.params.articleId)

    // si articleId n'est pas un nombre (NaN = Not A Number), alors on s'arrête
    if (isNaN(articleId)) {
        res.status(400).json({message: 'articleId should be a number'})
        return
    }
    // on affecte req.articleId pour l'exploiter dans toutes les routes qui en ont besoin
    req.articleId = articleId

    // const result = await client.query({
    //   text: 'SELECT * FROM articles WHERE id=$1',
    //   values: [articleId]
    // })
    // const article = articles.find(a => a.id === req.articleId)
    // if (!result.rows.length) {
    //   res.status(404).json({ message: 'article ' + articleId + ' does not exist' })
    //   return
    // }
    // // on affecte req.article pour l'exploiter dans toutes les routes qui en ont besoin
    // req.article = result.rows[0]
    // next()
}

router.route('/article/:articleId')
    /**
     * Cette route envoie un article particulier
     */
    .get(parseArticle, (req, res) => {
        // req.article existe grâce au middleware parseArticle
        res.json(req.article)
    })

    /**
     * Cette route modifie un article.
     * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
     * NOTE: lorsqu'on redémarre le serveur, la modification de l'article disparait
     *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
     */
    .put(parseArticle, async (req, res) => {
        const name = req.body.name
        const description = req.body.description
        const image = req.body.image
        const price = parseInt(req.body.price)

        // await client.query({
        //   text: `UPDATE articles
        //           SET name=$1,
        //               description=$2,
        //               image=$3,
        //               price=$4
        //         WHERE id=$5
        //         `,
        //   values: [name, description, image, price, req.articleId]
        // })
        res.send()
    })

    .delete(parseArticle, async (req, res) => {
        // await client.query({
        //   text: 'DELETE FROM articles WHERE id=$1',
        //   values: [req.articleId]
        // })
        res.send()
    })

module.exports = router
