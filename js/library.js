const addBookButton = document.querySelector('#add-book');
const clearDataButton = document.querySelector('#clear-data');
const library = document.querySelector('#library');
const formContainer = document.querySelector('#form-container');
const bookForm = formContainer.querySelector('#book-form');
const submitFormButton = document.querySelector('#submit');
const books = JSON.parse(localStorage.getItem('books')) || [];
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

function toggleBookForm(e) {
	if (!e || [formContainer, addBookButton].includes(e.target) || e.target.className === 'edit') {
		bookForm.reset();
		formContainer.classList.toggle('hidden');
		if (e && e.target !== formContainer) {
			const formTitle = bookForm.querySelector('#title');
			const formRead = bookForm.querySelector('#form-read');
			if (e.target === addBookButton) {
				formTitle.textContent = 'Add a new book';
				submitFormButton.value = 'Add';
				formRead.style.display = 'block';
			} else if (e.target.className === 'edit') {
				formTitle.textContent = 'Edit book';
				submitFormButton.value = 'Edit';
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
		localStorage.setItem('books', JSON.stringify(books));
	}
}

function deleteBook(e) {
	if (e.target.className === 'delete') {
		currentId = e.target.parentNode.dataset.id;
		books.splice(currentId, 1);
		book = e.target.parentNode.parentNode;
		book.classList.toggle('hidden');
		book.addEventListener('transitionend', () => book.remove(), { once: true });
		localStorage.setItem('books', JSON.stringify(books));
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
	this.checkValidity();
	if (this.reportValidity()) {
		if (submitFormButton.value === 'Add') {
			books.push(new Book(...getFormValues(this)));
		} else if (submitFormButton.value === 'Edit') {
			const values = getFormValues(this);
			Object.assign(books[currentId], { name: values[0], author: values[1], pages: values[2], read: values[3] });
		}
		localStorage.setItem('books', JSON.stringify(books));
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
	if (books.length) {
		library.innerHTML = '';
		clearDataButton.classList.remove('hidden');
		books.forEach(({ name, author, pages, read }, i) => {
			const book = createBook(name, author, pages, read, i);
			library.appendChild(book);
		});
	} else {
		clearDataButton.classList.add('hidden');
	}
}

function clearData() {
	books.splice(0, books.length);
	localStorage.setItem('books', JSON.stringify(books));
	for (const book of library.childNodes) {
		book.classList.toggle('hidden');
		book.addEventListener('transitionend', () => book.remove(), { once: true });
	}
	updateLibrary();
}

addBookButton.addEventListener('click', toggleBookForm);
clearDataButton.addEventListener('click', clearData);
formContainer.addEventListener('click', toggleBookForm);
bookForm.addEventListener('submit', submitForm);
library.addEventListener('click', toggleBookForm);
library.addEventListener('click', toggleReadCheckbox);
library.addEventListener('click', deleteBook);
