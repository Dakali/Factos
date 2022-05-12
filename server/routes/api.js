const express = require('express')
const router = express.Router()
// const articles = require('../data/articles.js')
const bcrypt = require('bcrypt');

const {Sequelize} = require("sequelize");
const sequelize = new Sequelize("eftheque", "root", "",
    {
      dialect: "mysql",
      host: "localhost"
    });



const users = []

class Panier {
  constructor () {
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.articles = []
  }
}

// router.put('/api/parapluie/:parapluieId', (req, res) => {
//   const parapluieId = parseInt(req.params.parapluieId)
//   const taille = req.body.taille
//   const prix = req.body.prix
//   const para = parapluies.find(p => p.id === parapuieId)
//   if (!para) {
//     res.status(404).send()
//     return
//   }
//   res.json(para)
// })

/**
 * Dans ce fichier, vous trouverez des exemples de requêtes GET, POST, PUT et DELETE
 * Ces requêtes concernent l'ajout ou la suppression d'articles sur le site
 * Votre objectif est, en apprenant des exemples de ce fichier, de créer l'API pour le panier de l'utilisateur
 *
 * Notre site ne contient pas d'authentification, ce qui n'est pas DU TOUT recommandé.
 * De même, les informations sont réinitialisées à chaque redémarrage du serveur, car nous n'avons pas de système de base de données pour faire persister les données
 */

/**
 * Notre mécanisme de sauvegarde des paniers des utilisateurs sera de simplement leur attribuer un panier grâce à req.session, sans authentification particulière
 */
router.use((req, res, next) => {
  // l'utilisateur n'est pas reconnu, lui attribuer un panier dans req.session
  if (typeof req.session.panier === 'undefined') {
    req.session.panier = new Panier()
  }
  next()
})

router.post('/login', async (req, res) => {
  const pseudo = req.body.pseudo
  const password = req.body.password

  try {
    sequelize.authenticate();
    await sequelize.query("SELECT *  FROM user WHERE login = '"+pseudo+"'")
        .then(
            ([result,metadata])=>{
              // console.log(result);
              // res.json(result);
              //création de l'utilisateur à partir des infos trouvés
                if (result.length > 0 ) {

                    const user = result[0]

                    if (bcrypt.compare(password, user.pwd)) {
                        // alors connecter l'utilisateur
                        req.session.userId = user.id_user
                        req.session.userPseudo = user.pseudo
                        res.json({
                            id: user.id_user,
                            pseudo: user.login
                        })
                    } else {
                        res.status(401).json({
                            message: 'Mauvais mot de passe'
                        })
                        return
                    }
                }else {
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

  // const result = await client.query({
  //   text: 'SELECT * FROM users WHERE email=$1',
  //   values: [email]
  // })

  // if (result.rows.length === 0) {
  //   res.status(401).json({
  //     message: 'user doesnt exist'
  //   })
  //   return
  // }
  // // si on a pas trouvé l'utilisateur
  // // alors on le crée
  // const user = result.rows[0]
  //
  // if (await bcrypt.compare(password, user.password)) {
  //   // alors connecter l'utilisateur
  //   req.session.userId = user.id
  //   res.json({
  //     id: user.id,
  //     email: user.email
  //   })
  // } else {
  //   res.status(401).json({
  //     message: 'bad password'
  //   })
  //   return
  // }
})

router.post('/register', async (req, res) => {
  const pseudo = req.body.pseudo
  const password = req.body.password


  try {
    sequelize.authenticate();
    await sequelize.query("SELECT *  FROM user WHERE login = '"+pseudo+"'")
        .then(
            ([result,metadata])=>{
              // console.log(result);
              // res.json(result);
              //création de l'utilisateur à partir des infos trouvés

              console.log("l: "+result.length)
              if (result.length > 0){
                   res.status(401).json({
                     message: 'Ce login est déjà utilisé'
                   })
                   return
              }
              // const user = result[0]

              // // si on a pas trouvé l'utilisateur
              // // alors on le crée





                const hashPassword = async (password, saltRounds = 10) => {
                    try {
                        // Generate a salt
                        const salt = await bcrypt.genSalt(saltRounds);

                        // Hash password
                        return await bcrypt.hash(password, salt);
                    } catch (error) {
                        console.log(error);
                    }

                    // Return null if error
                    return null;
                };


                (async () => {
                    const hash = await hashPassword(password);


                    // TODO: store hash in a database
                    try{
                        sequelize.authenticate();
                        sequelize.query("INSERT INTO user(`login`, `pwd`, `profil`, `actif`)  VALUES('"+pseudo+"','"+hash+"','ETUDIANT',1)")
                            .then(
                                ([result,metadata])=> {
                                    console.log(hash);
                                    res.send('ok')
                                })

                    }catch (error){
                        res.status(401).json({
                            message: 'Une erreur lors de la création du compte est survenue! Veuillez réessayer!'
                        })
                    }
                })();








               // const hash =  bcrypt.hash(password, 10)


               // try{
               //   sequelize.authenticate();
               //   sequelize.query("INSERT INTO user(`login`, `pwd`, `profil`, `actif`)  VALUES('"+pseudo+"','"+hash+"','ETUDIANT',1)")
               //       .then(
               //           ([result,metadata])=> {
               //             console.log(hash);
               //           })
               //
               // }catch (error){
               //   res.status(401).json({
               //     message: 'Une erreur lors de la création du compte est survenue! Veuillez réessayer!'
               //   })
               // }

            }
        );
  } catch (error) {
    res.status(401).json({
      message: 'Utilisateur inexistant!'
    })
    console.error('Problème de connexion, l\'erreur est la suivante:',
        error);
  }

  // const result = await client.query({
  //   text: 'SELECT * FROM users WHERE email=$1',
  //   values: [email]
  // })

  // if (result.rows.length > 0) {
  //   res.status(401).json({
  //     message: 'user already exists'
  //   })
  //   return
  // }
  // // si on a pas trouvé l'utilisateur
  // // alors on le crée
  //
  // const hash = await bcrypt.hash(password, 10)

  // await client.query({
  //   text: `INSERT INTO users(email, password)
  //   VALUES ($1, $2)
  //   `,
  //   values: [email, hash]
  // })
  // res.send('ok')
})

router.get('/me', async (req, res) => {
  if (typeof req.session.userId === 'undefined') {
    res.status(401).json({ message: 'not connected' })
    return
  }

  // const result = await client.query({
  //   text: 'SELECT id, email FROM users WHERE id=$1',
  //   values: [req.session.userId]
  // })

  // res.json(result.rows[0])
})

/*
 * Cette route doit retourner le panier de l'utilisateur, grâce à req.session
 */
router.get('/panier', (req, res) => {
  res.status(501).json({ message: 'Not implemented' })
})

/*
 * Cette route doit ajouter un article au panier, puis retourner le panier modifié à l'utilisateur
 * Le body doit contenir l'id de l'article, ainsi que la quantité voulue
 */
router.post('/panier', (req, res) => {
  res.status(501).json({ message: 'Not implemented' })
})

/*
 * Cette route doit permettre de confirmer un panier, en recevant le nom et prénom de l'utilisateur
 * Le panier est ensuite supprimé grâce à req.session.destroy()
 */
router.post('/panier/pay', (req, res) => {
  if (typeof req.session.userId === 'number') {
    res.send('ok')
  } else {
    res.status(401).json({ message: 'vous netes pas connecté' })
  }
})

/*
 * Cette route doit permettre de changer la quantité d'un article dans le panier
 * Le body doit contenir la quantité voulue
 */
router.put('/panier/:articleId', (req, res) => {
  res.status(501).json({ message: 'Not implemented' })
})

/*
 * Cette route doit supprimer un article dans le panier
 */
router.delete('/panier/:articleId', (req, res) => {
  res.status(501).json({ message: 'Not implemented' })
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
                ([result,metadata])=>{
                    // console.log(result);
                    // res.json(result);
                    //création de l'utilisateur à partir des infos trouvés
                    if (result.length > 0 ) {
                        res.json(result)

                    }else {
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
    res.status(400).json({ message: 'bad request' })
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
async function parseArticle (req, res, next) {
  const articleId = parseInt(req.params.articleId)

  // si articleId n'est pas un nombre (NaN = Not A Number), alors on s'arrête
  if (isNaN(articleId)) {
    res.status(400).json({ message: 'articleId should be a number' })
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
