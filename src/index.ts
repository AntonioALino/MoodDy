import dotenv from 'dotenv'
import createServerApplication from './routes/route'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = createServerApplication();

app.listen(PORT, () => {
    console.log(`Servidor rodando em localhost:${PORT}`)
})