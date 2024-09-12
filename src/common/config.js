import 'dotenv/config'

export default {
    DB_NAME:process.env.DB_NAME,
    DB_URL:process.env.DB_URL,
    SALT:Number(process.env.SALT),
    RESET_URL:process.env.RESET_URL,
    EMAIL_ID:process.env.EMAIL_ID,
    EMAIL_PASSWORD:process.env.EMAIL_PASSWORD
}