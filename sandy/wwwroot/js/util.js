function createElement(type, className = "", html = "") {     // returns a new html elemnt with specified type and attributes
    var item = document.createElement(type);
    if (className.length > 0)
        item.className = className;
    item.innerHTML = html;
    return item;
}

function createAndAppend(type, parent, className = "", html = "") {  // create a new html element and add it to the parent, with specified attributes
    var item = createElement(type, className, html);
    parent.append(item);
    return item;                                            // still return the item, because we than we can still add items to that
}

function getTime() {
    datetime = new Date();

    return datetime.toLocaleTimeString().slice(0,5) + " " + datetime.toLocaleDateString();
}