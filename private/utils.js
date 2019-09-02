exports.isValidEmail = function (mail) {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(String(mail).toLowerCase())
}

exports.splitByWhitespaces = function (sentence){
    return sentence.match(/\S+/g) 
}

exports.includesStringInsensitive = function (stringArray, string){
    //The standard .includes() method but case insensitive.
}