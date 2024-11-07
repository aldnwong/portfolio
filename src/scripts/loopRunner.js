import { runTitleSequence } from './titleSequence'
import { runBgSequence } from './bgTextCreator'

async function iHateJavaScript() {
    await runTitleSequence()
    iHateJavaScript();
}

async function iReallyHateJavaScript() {
    await runBgSequence()
    iReallyHateJavaScript();
}

iHateJavaScript()
iReallyHateJavaScript()