var xhr = new XMLHttpRequest();
xhr.onload = function() {
  dump(xhr.responseXML.documentElement.nodeName);
}
xhr.onerror = function() {
  dump("Error while getting XML.");
}
xhr.open("GET", "https://nestr-backend.herokuapp.com/api/nests");
xhr.responseType = "document";
xhr.send();

var oSerializer = new XMLSerializer();
var sXML = oSerializer.serializeToString(doc);


console.log(sXML);
