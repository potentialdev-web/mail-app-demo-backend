import { imapConfig } from '../config'

const imaps = require('imap-simple')
const simpleParser = require('mailparser').simpleParser
const _ = require('lodash')

const getMessagesList = async (req, res, next) => {
  const post = req.body.config
  const config = {
    imap: {
      tls: post.encryption === 'tls' ? true : false,
      password: post.password,
      user: post.email,
      host: post.server,
      port: parseInt(post.port),
      authTimeout: imapConfig.authTimeout
    }
  }

  try {
    const messages = await imaps.connect(config)
      .then(connection => {
        return connection.openBox('INBOX').then(() => {
          const searchCriteria = [
            'ALL'
          ]

          const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false
          }

          return connection.search(searchCriteria, fetchOptions)
            .then(results => {
              const headers = results.map(result => {
                return result.parts.filter(function (part) {
                  return part.which === 'HEADER';
                })[0].body
              })

              const messages = headers.map(header => {
                return {
                  id: header['message-id'][0],
                  subject: header.subject[0],
                  from: header.from[0],
                  date: header.date[0]
                }
              })

              return messages
          })
        })
    })

    res.status(200).send({
      success: true,
      messages
    })
  } catch (error) {
    next(error)
  }
}

const getMessagesBody = async (req, res, next) => {
  const post = req.body.config
  const messageId = req.body.messageId
  const config = {
    imap: {
      tls: post.encryption === 'tls' ? true : false,
      password: post.password,
      user: post.email,
      host: post.server,
      port: parseInt(post.port),
      authTimeout: imapConfig.authTimeout
    }
  }

  try {
    const body = await imaps.connect(config)
      .then(connection => {
        return connection.openBox('INBOX')
          .then(function () {
            const searchCriteria = [['HEADER','message-id', messageId]]
            const fetchOptions = {
              bodies: ['HEADER', 'TEXT']
            }

            return connection.search(searchCriteria, fetchOptions)
              .then(async (messages) => {
                var all = _.find(messages[0].parts, { which: "TEXT" })
                var id = messages[0].attributes.uid;
                var idHeader = "Imap-Id: " + id + "\r\n"

                return await simpleParser(idHeader + all.body)
                  .then(mail => {
                    return mail.text
                })
            })
        })
    })

    res.status(200).send({
      success: true,
      body
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getMessagesList,
  getMessagesBody
}
