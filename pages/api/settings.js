import { StatusCodes } from 'http-status-codes'

import { authenticateToken, generateAccessToken } from '@/utils/jwt'
import { Settings, User } from '@/utils/mongoose'

export default async (req, res) => {
  // Gather the jwt access token from the request header
  let token = req.headers['authorization']
  // strip 'bearer'
  if (token) token = token.replace(/bearer /i, '')
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: 'No token. Authorization denied.' })
  }

  const { settings } = req.body

  let email
  try {
    email = await authenticateToken(token)
  } catch (error) {
    console.error(error.message)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: 'Invalid token', error })
  }

  // get user
  const userDoc = await User.findOne({ email })

  let settingsDoc
  try {
    // use _id to search for doc, the rest is data to add
    const { _id, ...data } = settings
    settingsDoc = await Settings.findOne({ _id, user: userDoc._id })

    if (settingsDoc) {
      settingsDoc = await Settings.findByIdAndUpdate(
        settingsDoc._id,
        { $set: data },
        { new: true }
      )
    } else {
      // if settings doc does not exist then create
      settingsDoc = new Settings({ ...settings, user: userDoc._id })
      await settingsDoc.save()
    }
  } catch (error) {
    console.error(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Database error', error })
  }

  // token (keep resetting their session length)
  const newToken = generateAccessToken(userDoc.email)

  res.status(StatusCodes.OK).json({
    settings: settingsDoc.toObject(),
    token: newToken,
  })
}