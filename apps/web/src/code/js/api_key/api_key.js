import 'dotenv/config'
import { Sandbox } from '@e2b/code-interpreter'

const sandbox = await Sandbox.create()
await sandbox.close()
