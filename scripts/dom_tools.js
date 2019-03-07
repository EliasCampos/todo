function elt(tagName, properties, ...children) {
	/*
	Properties - the same as allowed for JS DOM elements
	Child could be DOM element or text string
	*/
	let dom = document.createElement(tagName);

	Object.assign(dom, properties);

	for (let child of children) {
		if (typeof child === 'string') {
			dom.appendChild(document.createTextNode(child));
		} else dom.appendChild(child);
	}

	return dom;
}