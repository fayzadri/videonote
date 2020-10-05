import { connectToDatabase } from '../../utils/mongodb'
import { extractUser } from '../../utils/apiHelpers'
import { authenticateToken } from '../../utils/jwt'
import { getUserProjects } from './project'

export default async (req, res) => {
  // Gather the jwt access token from the request header
  let token = req.headers['authorization']
  // strip 'bearer'
  if (token) token = token.replace(/bearer /i, '')

  if (!token) {
    return res.status(401).json({ msg: 'No token. Authorization denied.' })
  }

  let email
  try {
    email = await authenticateToken(token)
  } catch (err) {
    console.error(err.message)
    return res.status(401).json({ msg: 'Invalid token' })
  }

  // connect db
  const { db } = await connectToDatabase()

  // get user via email
  const user = await db.collection('users').findOne({
    email,
  })
  // get projects
  const projects = await getUserProjects(user._id, db)

  res.status(200).json({
    user: extractUser(user),
    projects,
  })
}