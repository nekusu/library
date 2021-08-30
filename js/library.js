const addBookButton = document.querySelector('#add-book');
const library = document.querySelector('#library');
const formContainer = document.querySelector('#form-container');
const bookForm = formContainer.querySelector('#book-form');
const submitFormButton = document.querySelector('#submit');
const books = [];
let currentId = 0;

class Book {
	constructor(name, author, pages, read) {
		this.name = name;
		this.author = author;
		this.pages = pages;
		this.read = read;
	}
}

function toggleBookForm(e) {
	if (!e || [formContainer, addBookButton].includes(e.target) || e.target.className === 'edit') {
		bookForm.reset();
		formContainer.classList.toggle('hidden');
		if (e && e.target !== formContainer) {
			const formTitle = bookForm.querySelector('#title');
			const formRead = bookForm.querySelector('#form-read');
			const submitButton = bookForm.querySelector('#submit');
			if (e.target === addBookButton) {
				formTitle.textContent = 'Add a new book';
				submitButton.value = 'Add';
				formRead.style.display = 'block';
			} else if (e.target.className === 'edit') {
				formTitle.textContent = 'Edit book';
				submitButton.value = 'Edit';
				formRead.style.display = 'none';
				currentId = e.target.parentNode.dataset.id;
				const { name, author, pages, read } = books[currentId];
				setFormValues(bookForm, [name, author, pages, read]);
			}
		}
	}
}

function toggleReadCheckbox(e) {
	if (e.target.className === 'read') {
		currentId = e.target.parentNode.dataset.id;
		books[currentId].read = !books[currentId].read;
		e.target.title = (books[currentId].read ? '' : 'Not ') + 'Read';
		e.target.firstElementChild.textContent = books[currentId].read ? 'check_circle_outline' : 'radio_button_unchecked';
	}
}

function deleteBook(e) {
	if (e.target.className === 'delete') {
		currentId = e.target.parentNode.dataset.id;
		books.splice(currentId, 1);
		book = e.target.parentNode.parentNode;
		book.classList.toggle('hidden');
		book.addEventListener('transitionend', () => book.remove(), { once: true });
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

function setFormValues(form, values) {
	form.querySelectorAll('input').forEach((input, i) => {
		if (input.type !== 'submit') {
			if (input.type === 'checkbox') {
				input.checked = values[i];
			} else {
				input.value = values[i];
			}
		}
	})
}

function submitForm(e) {
	e.preventDefault();
	bookForm.checkValidity();
	if (bookForm.reportValidity()) {
		if (e.target.value === 'Add') {
			books.push(new Book(...getFormValues(bookForm)));
		} else if (e.target.value === 'Edit') {
			const values = getFormValues(bookForm);
			Object.assign(books[currentId], { name: values[0], author: values[1], pages: values[2], read: values[3] });
		}
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

function updateLibrary() {
	library.innerHTML = '';
	books.forEach(({ name, author, pages, read }, i) => {
		const book = createBook(name, author, pages, read, i);
		library.appendChild(book);
	});
}

addBookButton.addEventListener('click', toggleBookForm);
formContainer.addEventListener('click', toggleBookForm);
submitFormButton.addEventListener('click', submitForm);
library.addEventListener('click', toggleBookForm);
library.addEventListener('click', toggleReadCheckbox);
library.addEventListener('click', deleteBook);
