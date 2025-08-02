import { Sandbox } from '@e2b/code-interpreter'

const sandbox = await Sandbox.create({
  apiKey: 'e2b_ef21b788cc7db44fa69ed165aa54617cc3ed1dc5',
})

await sandbox.close()
