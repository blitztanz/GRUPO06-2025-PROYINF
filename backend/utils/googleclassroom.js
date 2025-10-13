import { google } from "googleapis";
import dotenv from "dotenv";
import { pool } from "../db.js";
dotenv.config();

//devuelve un cliente autenticado con Google usando el refresh_token
export async function getAuthenticatedClient(refreshToken) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

//nuevo access_token desde la BD usando el refresh_token del usuario
export async function getAccessTokenFromRefresh(userId) {
  const { rows } = await pool.query(
    "SELECT refresh_token FROM usuarios WHERE id = $1",
    [userId]
  );

  if (!rows.length || !rows[0].refresh_token) {
    throw new Error("El usuario no tiene refresh_token guardado");
  }

  const refreshToken = rows[0].refresh_token;
  const oauth2Client = await getAuthenticatedClient(refreshToken);

  // forzar actualización del access_token
  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials.access_token;
}
