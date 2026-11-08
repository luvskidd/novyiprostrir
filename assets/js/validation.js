/**
 * Лабораторна робота №9: Клієнтська валідація форми зворотного зв'язку
 * Проєкт: Архітектурне бюро «Новий простір»
 */

document.addEventListener('DOMContentLoaded', () => {
    // Елементи форми
    const form = document.getElementById('feedback-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectSelect = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const agreementCheckbox = document.getElementById('agreement');
    const charCounter = document.getElementById('char-counter');

    // Елементи модального вікна
    const modal = document.getElementById('success-modal');
    const modalCard = document.getElementById('modal-card');
    const closeModalBtn = document.getElementById('close-modal');
    const summaryName = document.getElementById('summary-name');
    const summaryEmail = document.getElementById('summary-email');
    const summaryPhone = document.getElementById('summary-phone');
    const summarySubject = document.getElementById('summary-subject');

    // Регулярні вирази (RegEx)
    const REGEX_NAME = /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s'-]{2,}$/;
    const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const REGEX_PHONE = /^\+380\d{9}$/;

    // Початкова установка +380 при завантаженні
    if (!phoneInput.value || phoneInput.value.trim() === '') {
        phoneInput.value = '+380';
    }

    /**
     * ЖОРСТКА МАСКА ТЕЛЕФОНУ: захист префікса +380 та обмеження у 9 цифр
     */
    phoneInput.addEventListener('focus', () => {
        if (!phoneInput.value) {
            phoneInput.value = '+380';
        }
    });

    phoneInput.addEventListener('input', () => {
        let val = phoneInput.value;

        if (!val.startsWith('+380')) {
            let digits = val.replace(/\D/g, '');
            if (digits.startsWith('380')) {
                digits = digits.slice(3);
            } else if (digits.startsWith('38')) {
                digits = digits.slice(2);
            } else if (digits.startsWith('3')) {
                digits = digits.slice(1);
            } else if (digits.startsWith('0')) {
                digits = digits.slice(1);
            }
            val = '+380' + digits;
        }

        const digitsAfter = val.slice(4).replace(/\D/g, '').slice(0, 9);
        phoneInput.value = '+380' + digitsAfter;

        validatePhone();
    });

    /**
     * Відображення помилки (Error State)
     */
    function showError(inputElement, errorElementId, messageText = null) {
        inputElement.classList.remove(
            'border-[#333333]', 
            'border-emerald-500', 
            'border-emerald-500/80', 
            'ring-1', 
            'ring-emerald-500/30', 
            'ring-red-500/30',
            'focus:border-accent'
        );
        
        inputElement.classList.add('border-red-500', 'focus:border-red-500');
        inputElement.setAttribute('aria-invalid', 'true');

        const errorEl = document.getElementById(errorElementId);
        if (errorEl) {
            if (messageText) {
                const textSpan = errorEl.querySelector('span');
                if (textSpan) textSpan.textContent = messageText;
            }
            errorEl.classList.remove('hidden');
        }
    }

    /**
     * Успішний стан (Success State) - спрацьовує одразу, як тільки текст стає валідним
     */
    function showSuccess(inputElement, errorElementId) {
        inputElement.classList.remove(
            'border-[#333333]', 
            'border-red-500', 
            'border-red-500/80', 
            'ring-1', 
            'ring-red-500/30', 
            'ring-emerald-500/30',
            'focus:border-accent'
        );

        inputElement.classList.add('border-emerald-500', 'focus:border-emerald-500');
        inputElement.setAttribute('aria-invalid', 'false');

        const errorEl = document.getElementById(errorElementId);
        if (errorEl) {
            errorEl.classList.add('hidden');
        }
    }

    // --- ФУНКЦІЇ ВАЛІДАЦІЇ ---

    function validateName() {
        const val = nameInput.value.trim();
        if (val.length >= 2 && REGEX_NAME.test(val)) {
            showSuccess(nameInput, 'name-error');
            return true;
        } else {
            showError(nameInput, 'name-error');
            return false;
        }
    }

    function validateEmail() {
        const val = emailInput.value.trim();
        if (REGEX_EMAIL.test(val)) {
            showSuccess(emailInput, 'email-error');
            return true;
        } else {
            showError(emailInput, 'email-error');
            return false;
        }
    }

    function validatePhone() {
        const val = phoneInput.value.trim();
        if (REGEX_PHONE.test(val)) {
            showSuccess(phoneInput, 'phone-error');
            return true;
        } else {
            showError(phoneInput, 'phone-error');
            return false;
        }
    }

    function validateMessage() {
        const val = messageInput.value.trim();
        if (val.length >= 10) {
            showSuccess(messageInput, 'message-error');
            return true;
        } else {
            showError(messageInput, 'message-error');
            return false;
        }
    }

    function validateAgreement() {
        if (agreementCheckbox.checked) {
            const errorEl = document.getElementById('agreement-error');
            if (errorEl) errorEl.classList.add('hidden');
            return true;
        } else {
            const errorEl = document.getElementById('agreement-error');
            if (errorEl) errorEl.classList.remove('hidden');
            return false;
        }
    }

    // --- СЛУХАЧІ ПОДІЙ В РЕАЛЬНОМУ ЧАСІ (input) ---

    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    
    messageInput.addEventListener('input', () => {
        const len = messageInput.value.length;
        charCounter.textContent = `${len} / 500 символів`;
        validateMessage();
    });

    agreementCheckbox.addEventListener('change', validateAgreement);

    // --- ОБРОБКА SUBMIT ---

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isMessageValid = validateMessage();
        const isAgreementValid = validateAgreement();

        if (isNameValid && isEmailValid && isPhoneValid && isMessageValid && isAgreementValid) {
            summaryName.textContent = nameInput.value.trim();
            summaryEmail.textContent = emailInput.value.trim();
            summaryPhone.textContent = phoneInput.value.trim();
            summarySubject.textContent = subjectSelect.value;

            openModal();

            // Скидаємо форму і повертаємо +380
            form.reset();
            phoneInput.value = '+380';
            charCounter.textContent = '0 / 500 символів';

            [nameInput, emailInput, phoneInput, messageInput].forEach(el => {
                el.classList.remove('border-emerald-500', 'border-red-500', 'focus:border-emerald-500', 'focus:border-red-500');
                el.classList.add('border-[#333333]');
            });
        }
    });

    // --- АНІМОВАНЕ МОДАЛЬНЕ ВІКНО ---

    function openModal() {
        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0');
            modalCard.classList.remove('scale-90', 'translate-y-4', 'opacity-0');
            modalCard.classList.add('scale-100', 'translate-y-0', 'opacity-100');
        });
    }

    function closeModal() {
        modal.classList.add('opacity-0');
        modalCard.classList.remove('scale-100', 'translate-y-0', 'opacity-100');
        modalCard.classList.add('scale-90', 'translate-y-4', 'opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});