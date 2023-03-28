const msg = 'hello world\r\n'

function stringToCodeArray(str) {
    const CodeArray = []
    if (str === '') return CodeArray
    for (let i = 0; i < str.length; i++) {
        CodeArray.push(str.charCodeAt(i))
    }
    return CodeArray
}

function str2hex(str) {
    let hex = ''
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i)
        const hexnum = charCode.toString(16)
        hex += hexnum.padStart(2, '0')
    }
    return hex
}

function hex2buffer1(hexstr) {
    const length = hexstr.length / 2
    const buffer = new ArrayBuffer(length)
    const view = new Uint8Array(buffer)
    for (let i = 0; i < length; i++) {
        view[i] = parseInt(hexstr.substr(i * 2, 2), 16)
    }
    return buffer
}

function hex2buffer2(hexstr) {
    const length = hexstr.length / 2
    const view = new Uint8Array(length)
    for (let i = 0; i < length; i++) {
        view[i] = parseInt(hexstr.substr(i * 2, 2), 16)
    }
    return view.buffer
}

function CodeArray2buffer(codeArray) {
    const view = new Uint8Array(codeArray)
    return view.buffer
}

const codearray = stringToCodeArray(msg)
console.log('code array:', codearray)
const hexstr = str2hex(msg)
console.log('hexstr:', hexstr)
console.log(hex2buffer1(hexstr))
console.log(hex2buffer2(hexstr))
console.log(CodeArray2buffer(codearray))

function getsubcmds(cmd) {
    const codeArray = stringToCodeArray(cmd)
    const count = parseInt(codeArray.length / 20)
    console.log(codeArray)
    const subcmds = []
    for (let i = 0; i < count; i++) {
        subcmds.push(codeArray.slice(i * 20, (i + 1) * 20))
    }
    return subcmds
}

const cmd = "I'd like an apple and a cup of orange juice"
console.log(getsubcmds(cmd))

function dec2hex(dec) {
    return dec.toString(16)
}

function hex2dec(hex) {
    return parseInt(hex, 16)
}

console.log(dec2hex(255))
console.log(hex2dec('dc'))
