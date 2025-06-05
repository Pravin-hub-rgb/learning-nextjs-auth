import { hash } from 'bcryptjs'

const run = async () => {
  const hashed = await hash('123456', 10)
  console.log(hashed)
}

run()