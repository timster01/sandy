// returns a new html elemnt with specified type and attributes
function createElement(type, className = "", html = "") {     
    let item = document.createElement(type);
    if (className.length > 0){
        item.className = className;
    }
    item.innerHTML = html;
    return item;
}

// create a new html element and add it to the parent, with specified attributes
function createAndAppend(type, parent, className = "", html = "") {  
    let item = createElement(type, className, html);
    parent.append(item);
    // still return the item, because we than we can still add items to that
    return item;                                           
}

function getTime() {
    let datetime = new Date();
    return datetime.toLocaleTimeString().slice(0,5) + " " + datetime.toLocaleDateString();
}