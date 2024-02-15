const express = require("express")
const app = require("./app/config.js")
const exbhs = require("express-handlebars")
const path = require("path")
const { queryIpFunction } = require("./models/ip.js")
const { MySqlConnection } = require("./database/database.js")
const { users } = require("./user/createUser.js")
const { posts } = require("./posts/createPost.js")
const { Converter } = require("showdown")

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.engine("hbs", exbhs.engine({
  extname: ".hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname + "/views/layouts")
}))
app.set("view engine", "hbs")
app.use("views", express.static(path.join(__dirname + "/views")))
app.use(express.static(path.join(__dirname + "/assets")))

const converter = new Converter()

app.get('/perfil', async(req, res)=>{
  const ip = await queryIpFunction()
  const pool = await MySqlConnection()
  const [user, result] = await pool.query(`
  SELECT *
  FROM users
  WHERE ip = '${ip.query}'
  `)
  if(user.length < 1){
    res.redirect("/login")
  }else{
    const [userProfile, results] = await pool.query(`
    SELECT *
    FROM users
    WHERE nome = '${user[0]['nome']}'
    `)
    res.render("editProfile", {
      nome: user[0]['nome'],
      userProfile
    })
  }
})
app.post('/perfil', async(req, res)=>{
  const ip = await queryIpFunction()
  const pool = await MySqlConnection()
  const [user, result] = await pool.query(`
  SELECT *
  FROM users
  WHERE ip = '${ip.query}'
  `)

  const [userProfile, results] = await pool.query(`
  SELECT *
  FROM users
  WHERE nome = '${user[0]['nome']}'
  `)
  const { nome, email, descricao } = req.body
  const formatDescription = converter.makeHtml(descricao)
  console.log(formatDescription)
  const [update, resul] = await pool.query(`
  UPDATE users
  SET nome = '${nome}',
  email = '${email}',
  descricao = '${formatDescription}'
  WHERE ip = '${ip.query}'
  `)
  const notifyAll = `
  <div class='alert alert-success' role='alert'>
    Perfil atualizado com sucesso!
  </div>
  `
  res.render("editProfile", {
    nome: user[0]['nome'],
    userProfile,
    notifyAll
  })

})


app.get('/:nome/conteudos', async(req, res)=>{
  const username = req.params.nome
  const ip = await queryIpFunction()
  const pool = await MySqlConnection()
  const [user, result] = await pool.query(`
  SELECT *
  FROM users
  WHERE nome = '${username}'
  `)
  if(user.length < 1){
    res.redirect("/login")
  }else{
    const [posts, results] = await pool.query(`
    SELECT *
    FROM posts
    WHERE nome = '${username}'
    `)
    res.render("conteudos", {
      nome: user[0]['nome'],
      posts
    })
  }
})

app.get('/publicar', async(req, res)=>{
  const createPost = await posts.create({
    nome: 'josecipriano',
    titulo: 'What is lorem ipsum?',
    post_likes: '1',
    publicacao: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
  })
  res.json(createPost)
})

app.get("/", async (req, res) => {
  const ip = await queryIpFunction()
  const pool = await MySqlConnection()
  const [user, result] = await pool.query(`
  SELECT *
  FROM users
  WHERE ip = '${ip.query}'
  `)
  console.log(ip.query)
  console.log(user)
  if(user.length < 1){
    res.redirect("/login")
  }else{
    const [posts, results] = await pool.query(`
    SELECT *
    FROM posts
    ORDER BY post_likes DESC
    `)
    res.render("home", {
      nome: user[0]['nome'],
      posts
    })
  }
})

app.get("/login", async(req, res)=>{
  const ip = await queryIpFunction()
  const pool = await MySqlConnection()
  const [user, result] = await pool.query(`
  SELECT *
  FROM users
  WHERE ip = '${ip.query}'
  `)
  if(user.length < 1){
    res.render("login")
  }else{
    res.redirect("/")
  }
})

app.post('/login', async (req, res)=>{
  const { email, senha } = req.body
  const ip = await queryIpFunction()
  const pool = await MySqlConnection()
  const [user, result] = await pool.query(`
  SELECT *
  FROM users
  WHERE email = '${email}' AND senha = '${senha}'
  `)
  if(user.length < 1){
    const [update, results] = await pool.query(`
    UPDATE users
    SET ip = '${ip.query}'
    WHERE email = '${email}'
    `)
    console.log(update)
    res.redirect("/")
  }else{
    const validation = `
    <div class="alert alert-danger" role="alert">
      Email ou senha incorreto!
    </div>
    `
    res.render('login', {
      validation
    })
    
  }
})

app.get("/cadastro", async(req, res)=>{
  const ip = await queryIpFunction()
  const pool = await MySqlConnection()
  const [user, result] = await pool.query(`
  SELECT *
  FROM users
  WHERE ip = '${ip.query}'
  `)
  if(user.length < 1){
    res.render("cadastro")
  }else{
    res.redirect("/")
  }
})

app.post('/cadastro', async (req, res)=>{
  const { nome, email, senha } = req.body
  const ip = await queryIpFunction()
  const pool = await MySqlConnection()
  const [user, result] = await pool.query(`
  SELECT *
  FROM users
  WHERE email = '${email}' AND senha = '${senha}'
  `)
  if(user.length < 1){
    const insert = await users.create({
      nome: nome,
      email: email,
      senha: senha,
      descricao: '',
      ip: ip.query
    })
    res.redirect("/")
    
  }else{
    const validation = `
    <div class="alert alert-danger" role="alert">
      Email e senha já estão sendo usados!
    </div>
    `
    res.render('cadastro', {
      validation
    })
  }
})

app.get('/:nome', async(req, res)=>{
  const username = req.params.nome
  const ip = await queryIpFunction()
  const pool = await MySqlConnection()
  const [user, result] = await pool.query(`
  SELECT *
  FROM users
  WHERE ip = '${ip.query}'
  `)
  if(user.length < 1){
    res.redirect("/login")
  }else{
    const [userProfile, results] = await pool.query(`
    SELECT *
    FROM users
    WHERE nome = '${username}'
    `)
    res.render("profile", {
      nome: user[0]['nome'],
      userProfile
    })
  }
})

