exports.isValidEmail = function (mail) {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(String(mail).toLowerCase())
}

exports.splitByWhitespaces = function (sentence){
    return sentence.match(/\b(\w+)'?(\w+)?\b/g)
}

exports.includesStringInsensitive = function (stringArray, string){
    let regex = new RegExp(stringArray.join("|"), "i")
    return regex.test(string)
}