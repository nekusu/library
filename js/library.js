const stats = document.querySelector('#stats');
const totalBooks = stats.querySelector('#total-books');
const readBooks = stats.querySelector('#read-books');
const notReadBooks = stats.querySelector('#not-read-books');
const buttons = document.querySelector('#buttons');
const addBookButton = document.querySelector('#add-book');
const clearDataButton = document.querySelector('#clear-data');
const sortSettings = document.querySelector('#sort-settings');
const sortButton = document.querySelector('#sort-by');
const sortType = document.querySelector('#sort-type');
const sortDirection = document.querySelector('#direction');
const noBooks = document.querySelector('#no-books');
const library = document.querySelector('#library');
const formContainer = document.querySelector('#form-container');
const bookForm = formContainer.querySelector('#book-form');
const submitFormButton = document.querySelector('#submit');
const sortTypes = ['name', 'author', 'pages'];
const books = JSON.parse(localStorage.getItem('books')) || [];
let sortBy = 'name';
let ascendingSorting = true;
let currentId = 0;
updateLibrary();

class Book {
	constructor(name, author, pages, read) {
		this.name = name;
		this.author = author;
		this.pages = pages;
		this.read = read;
	}
}

function saveBooks() {
	localStorage.setItem('books', JSON.stringify(books));
}

function toggleBookForm(e) {
	const formTitle = bookForm.querySelector('#title');
	const formRead = bookForm.querySelector('#form-read');
	if (!e || e.target === formContainer) {
		bookForm.reset();
		formContainer.classList.toggle('hidden');
	} else if (e.target === addBookButton) {
		bookForm.reset();
		formContainer.classList.toggle('hidden');
		formTitle.textContent = 'Add a new book';
		submitFormButton.value = 'Add';
		formRead.style.display = 'block';
	} else if (e.target.className === 'edit') {
		bookForm.reset();
		formContainer.classList.toggle('hidden');
		formTitle.textContent = 'Edit book';
		submitFormButton.value = 'Edit';
		formRead.style.display = 'none';
		currentId = e.target.parentNode.dataset.id;
		setFormValues(bookForm, books[currentId]);
	}
}

function toggleReadCheckbox(e) {
	if (e.target.className === 'read') {
		currentId = e.target.parentNode.dataset.id;
		books[currentId].read = !books[currentId].read;
		if (books[currentId].read) {
			e.target.title = 'Read';
			e.target.firstElementChild.textContent = 'check_circle_outline';
		} else {
			e.target.title = 'Not Read';
			e.target.firstElementChild.textContent = 'radio_button_unchecked';
		}
		updateStats();
		saveBooks();
	}
}

function removeElement(el) {
	el.classList.toggle('hidden');
	el.addEventListener('transitionend', e => {
		if (e.target === el && e.propertyName === 'opacity') {
			el.remove();
		}
	});
}

function deleteBook(e) {
	if (e.target.className === 'delete') {
		currentId = e.target.parentNode.dataset.id;
		books.splice(currentId, 1);
		updateLibrary()
		saveBooks();
	}
}

function getFormValues(form) {
	const values = [...form.querySelectorAll('div > input')].reduce((obj, input) => {
		obj[input.name] = input[(input.type === 'checkbox') ? 'checked' : 'value'];
		return obj;
	}, {});
	return values;
}

function setFormValues(form, book) {
	form.querySelectorAll('div > input').forEach(input => input[(input.type === 'checkbox') ? 'checked' : 'value'] = book[input.name]);
}

function submitForm(e) {
	e.preventDefault();
	this.checkValidity();
	if (this.reportValidity()) {
		const values = getFormValues(this);
		if (submitFormButton.value === 'Add') {
			books.push(new Book(...Object.values(values)));
		} else if (submitFormButton.value === 'Edit') {
			Object.assign(books[currentId], values);
		}
		saveBooks();
		toggleBookForm();
		updateLibrary();
	}
}

function createBook(name, author, pages, read, id) {
	const book = document.createElement('div');
	const iconName = read ? 'check_circle_outline' : 'radio_button_unchecked';
	book.classList.add('box', 'book');
	book.innerHTML = `<div class="box-header name">${name}</div>
		<div class="author">${author}</div>
		<div class="pages">${pages} pages</div>
		<div class="actions" data-id="${id}">
			<button class="read" title="${read ? '' : 'Not '}Read"><span class="check material-icons-round">${iconName}</span></button>
			<button class="edit" title="Edit"><span class="material-icons-round">edit</span></button>
			<button class="delete" title="Delete"><span class="material-icons-round">delete_outline</span></button>
		</div>`;
	return book;
}

function updateStats() {
	const readAmount = books.reduce((read, book) => read + (book.read ? 1 : 0), 0);
	totalBooks.firstElementChild.textContent = books.length;
	readBooks.firstElementChild.textContent = readAmount;
	notReadBooks.firstElementChild.textContent = books.length - readAmount;
}

function updateLibrary() {
	library.innerHTML = '';
	if (books.length) {
		stats.style.display = 'block';
		buttons.style.display = 'block';
		sortSettings.style.display = 'block';
		noBooks.style.display = 'none';
		buttons.insertBefore(addBookButton, buttons.firstElementChild);
		updateStats();
		sortBooks();
		books.forEach(({ name, author, pages, read }, i) => {
			const book = createBook(name, author, pages, read, i);
			library.appendChild(book);
		});
	} else {
		stats.style.display = 'none';
		buttons.style.display = 'none';
		sortSettings.style.display = 'none';
		noBooks.style.display = 'block';
		noBooks.appendChild(addBookButton);
	}
}

function clearData() {
	books.splice(0, books.length);
	library.innerHTML = '';
	saveBooks();
	updateLibrary();
}

function sortBooks() {
	sortType.textContent = sortBy;
	books.sort((a, b) => {
		[first, second] = (sortBy === 'pages') ? [+a[sortBy], +b[sortBy]] : [a[sortBy].toLowerCase(), b[sortBy].toLowerCase()];
		const direction = ascendingSorting ? 1 : -1;
		return (first > second) ? direction : -direction;
	});
}

function changeSortType() {
	const index = sortTypes.findIndex(type => type === sortType.textContent);
	sortBy = sortTypes[index + 1 > 2 ? index - 2 : index + 1];
	updateLibrary();
}

function changeSortDirection() {
	sortDirection.classList.toggle('descending');
	ascendingSorting = !ascendingSorting;
	updateLibrary();
}

addBookButton.addEventListener('click', toggleBookForm);
clearDataButton.addEventListener('click', clearData);
sortButton.addEventListener('click', changeSortType);
sortDirection.addEventListener('click', changeSortDirection);
formContainer.addEventListener('click', toggleBookForm);
bookForm.addEventListener('submit', submitForm);
library.addEventListener('click', toggleBookForm);
library.addEventListener('click', toggleReadCheckbox);
library.addEventListener('click', deleteBook);
