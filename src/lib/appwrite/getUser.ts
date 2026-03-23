import { createSessionClient } from './server'

export async function getCurrentUser() {
  try {
    const { account } = await createSessionClient()
    return await account.get()
  } catch {
    return null
  }
}
