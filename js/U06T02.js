/**
 * filtro general
 * @type {String}
 */
var firstFilter = "Todos";
/**
 * bolleano para saber si esta selecionado pais o ciclo
 * @type {Boolean}
 */
var slid = true;
/**
 * filtro secundario puede ser de paises o ciclos
 * @type {Array}
 */
var secondFilter = []; //
/**
 * elemento map de google
 * @type {XMLHttpRequest}
 */
var map;

//leer json
var xhr = new XMLHttpRequest();
xhr.open("GET", "json/EstructMovilidadesErasmusJSON.json", false);
xhr.send("null");
var datosJson = JSON.parse(xhr.responseText);

/**
 * se ejecuta al cambiar la primera lista  o al iniciar la pagina
 * @return {[type]} [description]
 */
function functionChange() {
	//filtro1 = value;
	firstFilter = document.getElementById("select-tipo").value;
	//llamar a la funcion de toogle
	toogleChange();
}

/**
 * llama a la funciona show ciclos o pais segun si esta selecionado o no
 * @return {[type]} [description]
 */
function toogleChange() {
	var slider = document.getElementById("sliderCheck");
	deleteOptions(); // borramos contenido de options
	//if selected PAIS
	// llamar funcion de Pais;
	//else Ciclo
	//llamar funcion de Ciclo
	if (slider.checked) {
		slid = true;
		showPaises();
	} else {
		slid = false;
		showCiclos();
	}

}

/**
 * muestra los ciclos que quedan despues de pasar por el primer filtro
 * @return {[type]} [description]
 */
function showCiclos() {

	var node = document.getElementById("options"); // llamaos el div contenedor

	var buttonMarc = document.createElement("button"); //creamos los botones de marcar y desmarcar y asignamos eventos
	//buttonMarc.type = "button";
	buttonMarc.id = "btMarc";

	var buttonNoMarc = document.createElement("button");
	//buttonNoMarc.type = "button";
	buttonNoMarc.id = "btNoMarc";

	buttonMarc.setAttribute('onclick', "marcar(true); return false", false)


	buttonNoMarc.setAttribute('onclick', "marcar(false); return false", false)

	//añadimos los botones

	node.appendChild(buttonMarc);
	node.appendChild(buttonNoMarc);

	//borrar todo lo que hay

	//crear array sin ciclos repetidos
	var arrCiclos = nonRepeat("ciclo");
	//crearCheckBoxCiclos
	arrCiclos.forEach((element) => {
		var label = document.createElement("div");
		var span = document.createElement("span");
		var checky = document.createElement("input");
		label.class
		checky.type = "checkbox";
		span.innerHTML = element.ciclo;
		label.appendChild(span);
		label.appendChild(checky);
		node.appendChild(label);
	})
}

/**
 * muestra un droplist de los paises que quedan despues del primer filtro
 * @return {[type]} [description]
 */
function showPaises() {
	//crearComboPaises sin opciones repetidas
	var node = document.getElementById("options");
	var arrPais = nonRepeat("pais");
	node.appendChild(document.createTextNode("Seleccionar Pais"))
	var select = document.createElement("select");
	select.setAttribute("class", "custom-select");

	arrPais.forEach((element) => {
		var opt = document.createElement("option");
		opt.value = element.pais;
		opt.innerHTML = element.pais;
		select.appendChild(opt);
	})
	node.appendChild(select);
}

/**
 * Vacia el div de options para que no aparescan mas botones de lo deseado
 * @return {[type]} [description]
 */
function deleteOptions() {
	var node = document.getElementById("options");
	while (node.childNodes.length >= 1) {
		node.removeChild(node.firstChild);
	}
}

/**
 * funcion principal del programa que pone los marcadores en el mapa despues de aplicar ambos filtos;
 * @return {[type]} [description]
 */
function functionSearch() {
	myMap();
	var stringInfo = "";
	var marker;
	getFilter();
	//buscamos cual es el filtro secundario;
	var wanted = "";
	if (slid)
		wanted = "pais";
	else
		wanted = "ciclo";

	Object.values(datosJson).forEach(
		(element) => {
			if (element.tipo == firstFilter || firstFilter == "Todos") { //filtramos segund el filtroPrincipal
				secondFilter.forEach((elements) => {
					if (elements == element[wanted]) { //filtramos segun el filtro secundario
						var marker = new google.maps.Marker({
							position: new google.maps.LatLng(element.latitud, element.longitud),
							animation: google.maps.Animation.BOUNCE
						});
						stringInfo = "";
						stringInfo = cicloList(element); // devuelve lista de ciclos;
						var infowindow = new google.maps.InfoWindow({
							content: stringInfo
						});

						marker.addListener('click', function() { //crea evento click en marcador , mostrar info;
							infowindow.open(map, marker);
						});
						marker.setMap(map);
					}
				})
			}
		})
}

/**
 * crea lista de ciclos
 * @param  {[type]} element [elemento de tipo datosJson]
 * @return {[type]}         [devuelve la lista de ciclos que ha creado]
 */
function cicloList(element) {
	var stringInfo = "";
	Object.values(datosJson).forEach((elementos) => {
		if (element.ciudad == elementos.ciudad)
			stringInfo = stringInfo + elementos.ciclo + " , ";
	})
	return stringInfo;
}

/**
 * [busca si filtramos por ciclo o pais y asigna nos valores por los cuales filtramos en el segundo filtro]
 * @return {[type]} [description]
 */
function getFilter() {
	secondFilter = [];
	var node = document.getElementById("options").children;
	var slider = document.getElementById("sliderCheck");
	var start = 2;
	if (slid) {
		secondFilter.push(node[0].value);
	} else {
		for (start = 2; start < node.length; start++) {
			if (node[start].children[1].checked) {
				secondFilter.push(node[start].children[0].firstChild.textContent);
			}
		}
	}
}

/**
 * crea el mapa de google ;
 * @return {[type]} [description]
 */
function myMap() {
	var mapProp = {
		center: new google.maps.LatLng(46.30315394252028, 8.304687519999788),
		zoom: 4,
	};
	map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

/**
 * [filtra los elementos por dublicado]
 * @param  {[type]} wanted [pais o ciclo segun por lo que estamos filtrando]
 * @return {[type]}        [devuelve un array con los nombres sin repeticiones de ciclos o paises]
 */
function nonRepeat(wanted) {
	var cont = 0;
	var arrayReturn = [];
	Object.values(datosJson).forEach(
		(element) => {
			if (element.tipo == firstFilter || firstFilter == "Todos") {
				arrayReturn.forEach((elements) => {
					if (elements[wanted] == element[wanted])
						cont++;
				})
				if (cont != 0) {
					cont = 0;
				} else {
					arrayReturn.push(element);
				}
			}
		})
	return arrayReturn;
}

/**
 * [marca o desmarca todas las checkbox]
 * @param  {[type]} what [true or false segun si selecionamos marcar o desmarcar]
 * @return {[type]}      [description]
 */
function marcar(what) { //what depende del boton marcado si se seleciona es True sino false;

	var nodes = document.getElementById("options").childNodes;
	for (var i = 2; i < nodes.length; i++) { // empieza en dos para evitar los botones
		if (what) {
			nodes[i].children[1].checked = true; //Selleciona
		} else {
			nodes[i].children[1].checked = false; //Diseleciona
		}
	}
}

/**
 * añade evento click al boton buscar
 * @return {[type]} [description]
 */
document.getElementById("btSearch").addEventListener('click', function() {
	functionSearch();
}, false);

/**
 * añade el evento change al elemento select-tipo;
 * @return {[type]} [description]
 */
document.getElementById("select-tipo").addEventListener('change', function() {
	functionChange();
}, false);

/**
 * añade el evento change  al boton toogle
 * @return {[type]} [description]
 */
document.getElementById("sliderCheck").addEventListener('change', function() {
	toogleChange();
}, false);

/**
 * carga un evento cuando body este listo
 */
document.body.addEventListener('onreadystatechange', functionChange(), false);






// CASI 300 ...
