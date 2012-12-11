$(document).ready(function () {
	var hash = document.location.hash;
	if (hash) {
		loadHash(hash)
	};
})

function loadHash (hash) {
	alert(hash)
}