const addBookButton = document.querySelector('#add-book');
const library = document.querySelector('#library');
const formContainer = document.querySelector('#form-container');
const bookForm = formContainer.querySelector('#book-form');
const submitFormButton = document.querySelector('#submit');
const books = [];

class Book {
	constructor(name, author, pages, read) {
		this.name = name;
		this.author = author;
		this.pages = pages;
		this.read = read;
	}
}

function toggleBookForm(e) {
	if (!e || e.target === addBookButton || e.target === formContainer) {
		formContainer.classList.toggle('hidden');
	}
}

function getFormValues(form) {
	const values = [];
	form.querySelectorAll('input').forEach(input => {
		if (input.type !== 'submit') {
			if (input.type === 'checkbox') {
				values.push(input.checked);
			} else {
				values.push(input.value);
			}
		}
	});
	return values;
}

function addBook(e) {
	e.preventDefault();
	books.push(new Book(...getFormValues(bookForm)));
	bookForm.reset();
	toggleBookForm();
	updateLibrary();
}

function createBook(name, author, pages, read) {
	const book = document.createElement('div');
	const iconName = read ? 'check_circle_outline' : 'radio_button_unchecked';
	book.classList.add('box', 'book');
	book.innerHTML = `<div class="box-header" id="name">${name}</div>
		<div id="author">${author}</div>
		<div id="pages">${pages} pages</div>
		<div id="actions">
			<button id="read" title="${read ? '' : 'Not '}Read"><span class="check material-icons-round">${iconName}</span></button>
			<button id="edit" title="Edit"><span class="material-icons-round">edit</span></button>
			<button id="delete" title="Delete"><span class="material-icons-round">delete_outline</span></button>
		</div>`;
	return book;
}

function updateLibrary() {
	library.innerHTML = '';
	for (const { name, author, pages, read } of books) {
		const book = createBook(name, author, pages, read);
		library.appendChild(book);
	}
}

addBookButton.addEventListener('click', toggleBookForm);
formContainer.addEventListener('click', toggleBookForm);
submitFormButton.addEventListener('click', addBook);
