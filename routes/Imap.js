import ImapController from "../controllers/Imap"
import { API_URI_PREFIX } from "../constants"

const configureRoutes = app => {
  app.post(`${API_URI_PREFIX}/messages`, ImapController.getMessagesList)
  app.post(`${API_URI_PREFIX}/message-body`, ImapController.getMessagesBody)
}

export default configureRoutes
