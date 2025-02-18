document.addEventListener('DOMContentLoaded', () => {
    loadAppointments();
});

function openForm(button, service) {
    const formContainer = button.parentElement.nextElementSibling;

    if (formContainer.innerHTML.trim() !== '') {
        formContainer.innerHTML = '';
        return;
    }

    formContainer.innerHTML = getFormHTML(service);
    formContainer.querySelector('form').addEventListener('submit', submitForm);
}

function getFormHTML(service) {
    return `
        <div class="form-popup">
            <form>
                <label>Full Name</label>
                <input type="text" class="name" required>
                <span class="error nameError"></span>

                <label>Email Address</label>
                <input type="email" class="email" required>
                <span class="error emailError"></span>

                <label>Phone Number</label>
                <input type="text" class="phone" pattern="\\d{10}" required>
                <span class="error phoneError"></span>

                <label>Service</label>
                <select class="serviceSelect" required>
                    <option value="Doctor Consultation">Doctor Consultation</option>
                    <option value="Salon Appointment">Salon Appointment</option>
                    <option value="Car Service" selected>${service}</option>
                </select>

                <label>Preferred Date & Time</label>
                <input type="datetime-local" class="datetime" required>
                <span class="error datetimeError"></span>

                <label>Special Requests</label>
                <textarea class="requests"></textarea>

                <label>
                    <input type="checkbox" class="terms" required> Agree to Terms
                </label>
                <span class="error termsError"></span>

                <button type="submit">Submit</button>
            </form>
        </div>
    `;
}

function submitForm(event) {
    event.preventDefault();
    const form = event.target;

    const name = form.querySelector('.name').value.trim();
    const email = form.querySelector('.email').value.trim();
    const phone = form.querySelector('.phone').value.trim();
    const service = form.querySelector('.serviceSelect').value;
    const datetime = form.querySelector('.datetime').value;
    const requests = form.querySelector('.requests').value.trim();
    const termsChecked = form.querySelector('.terms').checked;

    let valid = true;
    const errors = form.querySelectorAll('.error');
    errors.forEach(err => err.textContent = '');

    if (name === '') {
        form.querySelector('.nameError').textContent = 'Name is required';
        valid = false;
    }
    if (!email.includes('@')) {
        form.querySelector('.emailError').textContent = 'Invalid email';
        valid = false;
    }
    if (!/^\d{10}$/.test(phone)) {
        form.querySelector('.phoneError').textContent = '10-digit phone number required';
        valid = false;
    }
    if (new Date(datetime) <= new Date()) {
        form.querySelector('.datetimeError').textContent = 'Future date required';
        valid = false;
    }
    if (!termsChecked) {
        form.querySelector('.termsError').textContent = 'You must agree to terms';
        valid = false;
    }

    if (!valid) return;

    const appointment = { name, service, datetime, status: 'Pending' };

    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    displayAppointment(appointment);
    showConfirmationPopup(name, service, datetime);
    form.parentElement.parentElement.innerHTML = '';
}

function displayAppointment(appointment) {
    const list = document.getElementById('appointments');
    const item = document.createElement('li');
    item.textContent = `${appointment.name} - ${appointment.service} - ${appointment.datetime} - Status: ${appointment.status}`;
    list.appendChild(item);
}

function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.forEach(displayAppointment);
}

function showConfirmationPopup(name, service, datetime) {
    const popup = document.getElementById('confirmationPopup');
    document.getElementById('confirmationMessage').textContent = `Thank you, ${name}! Your appointment for ${service} on ${datetime} is confirmed.`;
    popup.style.display = 'block';

    setTimeout(() => popup.style.display = 'none', 4000);
}

function closePopup() {
    document.getElementById('confirmationPopup').style.display = 'none';
}
