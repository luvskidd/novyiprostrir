document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedback-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectSelect = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const agreementCheckbox = document.getElementById('agreement');
    const charCounter = document.getElementById('char-counter');

    const modal = document.getElementById('success-modal');
    const modalCard = document.getElementById('modal-card');
    const closeModalBtn = document.getElementById('close-modal');
    const summaryName = document.getElementById('summary-name');
    const summaryEmail = document.getElementById('summary-email');
    const summaryPhone = document.getElementById('summary-phone');
    const summarySubject = document.getElementById('summary-subject');

    const infoModal = document.getElementById('info-modal');
    const infoModalCard = document.getElementById('info-modal-card');
    const infoModalBody = document.getElementById('info-modal-body');
    const infoModalCloseX = document.getElementById('info-modal-close-x');

    const backToTopBtn = document.getElementById('back-to-top');

    const REGEX_NAME = /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s'-]{2,}$/;
    const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const REGEX_PHONE = /^\+380\d{9}$/;

    // Кнопка "Нагору"
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
            } else {
                backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
                backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Маска телефону
    if (phoneInput && (!phoneInput.value || phoneInput.value.trim() === '')) {
        phoneInput.value = '+380';
    }

    if (phoneInput) {
        phoneInput.addEventListener('focus', () => {
            if (!phoneInput.value) phoneInput.value = '+380';
        });

        phoneInput.addEventListener('input', () => {
            let val = phoneInput.value;
            if (!val.startsWith('+380')) {
                let digits = val.replace(/\D/g, '');
                if (digits.startsWith('380')) digits = digits.slice(3);
                else if (digits.startsWith('38')) digits = digits.slice(2);
                else if (digits.startsWith('3')) digits = digits.slice(1);
                else if (digits.startsWith('0')) digits = digits.slice(1);
                val = '+380' + digits;
            }
            phoneInput.value = '+380' + val.slice(4).replace(/\D/g, '').slice(0, 9);
            validatePhone();
        });
    }

    function showError(inputElement, errorElementId, messageText = null) {
        inputElement.classList.remove('border-[#333333]', 'border-emerald-500', 'focus:border-emerald-500');
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

    function showSuccess(inputElement, errorElementId) {
        inputElement.classList.remove('border-[#333333]', 'border-red-500', 'focus:border-red-500');
        inputElement.classList.add('border-emerald-500', 'focus:border-emerald-500');
        inputElement.setAttribute('aria-invalid', 'false');
        const errorEl = document.getElementById(errorElementId);
        if (errorEl) errorEl.classList.add('hidden');
    }

    function validateName() {
        if (!nameInput) return true;
        const val = nameInput.value.trim();
        if (val.length >= 2 && REGEX_NAME.test(val)) {
            showSuccess(nameInput, 'name-error');
            return true;
        }
        showError(nameInput, 'name-error');
        return false;
    }

    function validateEmail() {
        if (!emailInput) return true;
        const val = emailInput.value.trim();
        if (REGEX_EMAIL.test(val)) {
            showSuccess(emailInput, 'email-error');
            return true;
        }
        showError(emailInput, 'email-error');
        return false;
    }

    function validatePhone() {
        if (!phoneInput) return true;
        const val = phoneInput.value.trim();
        if (REGEX_PHONE.test(val)) {
            showSuccess(phoneInput, 'phone-error');
            return true;
        }
        showError(phoneInput, 'phone-error');
        return false;
    }

    function validateMessage() {
        if (!messageInput) return true;
        const val = messageInput.value.trim();
        if (val.length >= 10) {
            showSuccess(messageInput, 'message-error');
            return true;
        }
        showError(messageInput, 'message-error');
        return false;
    }

    function validateAgreement() {
        if (!agreementCheckbox) return true;
        if (agreementCheckbox.checked) {
            const errorEl = document.getElementById('agreement-error');
            if (errorEl) errorEl.classList.add('hidden');
            return true;
        }
        const errorEl = document.getElementById('agreement-error');
        if (errorEl) errorEl.classList.remove('hidden');
        return false;
    }

    if (nameInput) nameInput.addEventListener('input', validateName);
    if (emailInput) emailInput.addEventListener('input', validateEmail);
    if (messageInput) {
        messageInput.addEventListener('input', () => {
            if (charCounter) charCounter.textContent = `${messageInput.value.length} / 500 символів`;
            validateMessage();
        });
    }
    if (agreementCheckbox) agreementCheckbox.addEventListener('change', validateAgreement);

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isPhoneValid = validatePhone();
            const isMessageValid = validateMessage();
            const isAgreementValid = validateAgreement();

            const valid = isNameValid && isEmailValid && isPhoneValid && isMessageValid && isAgreementValid;

            if (valid) {
                if (summaryName) summaryName.textContent = nameInput.value.trim();
                if (summaryEmail) summaryEmail.textContent = emailInput.value.trim();
                if (summaryPhone) summaryPhone.textContent = phoneInput.value.trim();
                if (summarySubject) summarySubject.textContent = subjectSelect ? subjectSelect.value : '';

                openModal();
                form.reset();
                if (phoneInput) phoneInput.value = '+380';
                if (charCounter) charCounter.textContent = '0 / 500 символів';

                [nameInput, emailInput, phoneInput, messageInput].forEach(el => {
                    if (el) {
                        el.classList.remove('border-emerald-500', 'border-red-500', 'focus:border-emerald-500', 'focus:border-red-500');
                        el.classList.add('border-[#333333]');
                    }
                });
            }
        });
    }

    function openModal() {
        if (!modal || !modalCard) return;
        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0');
            modalCard.classList.remove('scale-90', 'translate-y-4', 'opacity-0');
            modalCard.classList.add('scale-100', 'translate-y-0', 'opacity-100');
        });
    }

    function closeModal() {
        if (!modal || !modalCard) return;
        modal.classList.add('opacity-0');
        modalCard.classList.remove('scale-100', 'translate-y-0', 'opacity-100');
        modalCard.classList.add('scale-90', 'translate-y-4', 'opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    const modalData = {
        "service-arch": {
            badge: "Тариф • Архітектура",
            title: "Архітектурне проєктування",
            subtitle: "від 35 $/м² • Термін: від 30 робочих днів",
            content: `
                <p class="text-xs text-gray-500 mb-4 font-medium">Склад повного робочого проєкту включає:</p>
                <ul class="space-y-2.5 text-xs text-gray-700 mb-6">
                    <li class="flex items-center gap-2.5"><i class="fas fa-check-circle text-accent text-sm"></i> Генеральний план об'єкта та схематична прив'язка</li>
                    <li class="flex items-center gap-2.5"><i class="fas fa-check-circle text-accent text-sm"></i> 3D-візуалізації фасадів у високій роздільності</li>
                    <li class="flex items-center gap-2.5"><i class="fas fa-check-circle text-accent text-sm"></i> Поверхові плани, поетажна кладка та розрізи</li>
                    <li class="flex items-center gap-2.5"><i class="fas fa-check-circle text-accent text-sm"></i> Специфікація віконних та дверних блоків</li>
                    <li class="flex items-center gap-2.5"><i class="fas fa-check-circle text-accent text-sm"></i> Відповідність будівельним нормам України (ДБН)</li>
                </ul>
                <button id="info-modal-action-btn" type="button" class="w-full bg-accent hover:bg-accent-hover hover:scale-[1.01] active:scale-95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md">
                    Замовити концепт
                </button>
            `,
            subject: "Архітектурне проєктування"
        },
        "service-design": {
            badge: "Тариф • Інтер'єр",
            title: "Дизайн інтер'єру під ключ",
            subtitle: "від 25 $/м² • Термін: від 20 робочих днів",
            content: `
                <p class="text-xs text-gray-500 mb-4 font-medium">Комплексний склад дизайн-проєкту:</p>
                <ul class="space-y-2.5 text-xs text-gray-700 mb-6">
                    <li class="flex items-center gap-2.5"><i class="fas fa-check-circle text-accent text-sm"></i> 3-4 варіативні об'ємно-планувальні рішення</li>
                    <li class="flex items-center gap-2.5"><i class="fas fa-check-circle text-accent text-sm"></i> Фотореалістичні 3D-рендери всіх приміщень</li>
                    <li class="flex items-center gap-2.5"><i class="fas fa-check-circle text-accent text-sm"></i> План прив'язки електрики, розеток та освітлення</li>
                    <li class="flex items-center gap-2.5"><i class="fas fa-check-circle text-accent text-sm"></i> Розгортки стін санвузлів та підбір сантехніки</li>
                    <li class="flex items-center gap-2.5"><i class="fas fa-check-circle text-accent text-sm"></i> Специфікація оздоблювальних матеріалів і меблів</li>
                </ul>
                <button id="info-modal-action-btn" type="button" class="w-full bg-accent hover:bg-accent-hover hover:scale-[1.01] active:scale-95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md">
                    Обрати цей тариф
                </button>
            `,
            subject: "Дизайн інтер'єру"
        },
        "service-supervision": {
            badge: "Супровід",
            title: "Авторський нагляд будівництва",
            subtitle: "від 15 $/м² • Виїзди щотижня",
            content: `
                <p class="text-xs text-gray-500 mb-4 font-medium">Гарантія точної реалізації вашого проєкту:</p>
                <ul class="space-y-2.5 text-xs text-gray-700 mb-6">
                    <li class="flex items-center gap-2.5"><i class="fas fa-check-circle text-accent text-sm"></i> Регулярні виїзди ГАПа/дизайнера на об'єкт</li>
                    <li class="flex items-center gap-2.5"><i class="fas fa-check-circle text-accent text-sm"></i> Контроль відповідності робіт робочим кресленням</li>
                    <li class="flex items-center gap-2.5"><i class="fas fa-check-circle text-accent text-sm"></i> Консультації виконроба та підрядних бригад</li>
                    <li class="flex items-center gap-2.5"><i class="fas fa-check-circle text-accent text-sm"></i> Оперативне внесення коригувань у креслення</li>
                </ul>
                <button id="info-modal-action-btn" type="button" class="w-full bg-accent hover:bg-accent-hover hover:scale-[1.01] active:scale-95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md">
                    Замовити нагляд
                </button>
            `,
            subject: "Авторський нагляд"
        },
        "team-koval": {
            badge: "Головний архітектор",
            title: "Задати питання Олександру Ковалю",
            subtitle: "ГАП • Досвід понад 10 років у житловій та комерційній архітектурі",
            content: `
                <div class="bg-gray-50 border border-gray-200 p-4 rounded-xl mb-5 text-left">
                    <label for="modal-koval-q" class="block text-xs font-bold text-main-text mb-2">Ваше запитання до архітектора: <span class="text-accent">*</span></label>
                    <textarea id="modal-koval-q" rows="3" placeholder="Наприклад: Чи можливе перепланування несучої стіни у цегляному будинку?" class="w-full p-3 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:border-accent resize-none"></textarea>
                    <p id="koval-q-error" class="hidden text-xs text-red-500 mt-1 flex items-center gap-1">
                        <i class="fas fa-exclamation-circle"></i> Будь ласка, введіть запитання (мінімум 5 символів)
                    </p>
                </div>
                <button id="btn-submit-koval-q" type="button" class="w-full bg-accent hover:bg-accent-hover hover:scale-[1.01] active:scale-95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2">
                    <i class="fas fa-paper-plane"></i> Переправити у форму консультації
                </button>
            `,
            subject: "Безкоштовна консультація"
        },
        "team-danylenko": {
            badge: "Портфоліо дизайнерки",
            title: "Олена Даниленко — Галерея інтер'єрів",
            subtitle: "Стилі: Мінімалізм, Джапанді, Сучасний модерн",
            content: `
                <p class="text-xs text-gray-600 mb-3">Натисніть на фото для перегляду в HD-якості:</p>
                <div class="grid grid-cols-3 gap-3 mb-6">
                    <a href="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80" data-fancybox="danylenko-gallery" data-caption="Сучасна світла вітальня (Олена Даниленко)" class="h-24 rounded-lg overflow-hidden border border-gray-200 group block relative cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80" alt="Інтер'єр 1" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                    </a>
                    <a href="https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80" data-fancybox="danylenko-gallery" data-caption="Ергономічна кухня Джапанді (Олена Даниленко)" class="h-24 rounded-lg overflow-hidden border border-gray-200 group block relative cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=400&q=80" alt="Інтер'єр 2" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                    </a>
                    <a href="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80" data-fancybox="danylenko-gallery" data-caption="Мінімалістична спальня (Олена Даниленко)" class="h-24 rounded-lg overflow-hidden border border-gray-200 group block relative cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80" alt="Інтер'єр 3" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                    </a>
                </div>
                <button id="info-modal-action-btn" type="button" class="w-full bg-accent hover:bg-accent-hover hover:scale-[1.01] active:scale-95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md">
                    Замовити дизайн у Олени
                </button>
            `,
            subject: "Дизайн інтер'єру"
        },
        "team-melnyk": {
            badge: "Профіль архітектора-конструктора",
            title: "Ігор Мельник",
            subtitle: "Сертифікований інженер-конструктор та реставратор (НСАУ)",
            content: `
                <div class="space-y-3 mb-6 text-xs text-gray-700 text-left">
                    <div class="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <i class="fas fa-award text-accent text-base mt-0.5"></i>
                        <div>
                            <strong class="block text-main-text font-bold">Офіційна атестація НСАУ</strong>
                            <span>Державний сертифікат на розрахунок складних несучих конструкцій та реставрацію.</span>
                        </div>
                    </div>
                    <div class="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <i class="fas fa-monument text-accent text-base mt-0.5"></i>
                        <div>
                            <strong class="block text-main-text font-bold">Реставрація пам'яток архітектури</strong>
                            <span>Досвід понад 8 років з відновлення історичних фасадів у центральній частині Львова.</span>
                        </div>
                    </div>
                    <div class="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <i class="fas fa-building text-accent text-base mt-0.5"></i>
                        <div>
                            <strong class="block text-main-text font-bold">Моноліт та метал</strong>
                            <span>Розрахунок залізобетонних каркасів, фундаментів та посилення несучих елементів.</span>
                        </div>
                    </div>
                </div>
                <button id="info-modal-action-btn" type="button" class="w-full bg-accent hover:bg-accent-hover hover:scale-[1.01] active:scale-95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md">
                    Проконсультуватися з Ігорем
                </button>
            `,
            subject: "Архітектурне проєктування"
        }
    };

    function openInfoModal(key) {
        const item = modalData[key];
        if (!item || !infoModal || !infoModalBody) return;

        infoModalBody.innerHTML = `
            <span class="inline-block text-[10px] font-bold text-accent bg-accent/10 px-2.5 py-1 rounded uppercase mb-3 tracking-wider">${item.badge}</span>
            <h3 class="font-heading text-xl font-bold text-main-text mb-1">${item.title}</h3>
            <p class="text-xs text-gray-500 mb-4">${item.subtitle}</p>
            ${item.content}
        `;

        infoModal.classList.remove('hidden');
        requestAnimationFrame(() => {
            infoModal.classList.remove('opacity-0');
            infoModalCard.classList.remove('scale-90', 'translate-y-4', 'opacity-0');
            infoModalCard.classList.add('scale-100', 'translate-y-0', 'opacity-100');
        });

        const actionBtn = document.getElementById('info-modal-action-btn');
        if (actionBtn) {
            actionBtn.addEventListener('click', () => {
                closeInfoModal();
                if (subjectSelect && item.subject) subjectSelect.value = item.subject;
                const consultationSection = document.getElementById('consultation');
                if (consultationSection) {
                    consultationSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        const submitKovalBtn = document.getElementById('btn-submit-koval-q');
        const kovalTextarea = document.getElementById('modal-koval-q');
        const kovalErr = document.getElementById('koval-q-error');

        if (submitKovalBtn && kovalTextarea) {
            submitKovalBtn.addEventListener('click', () => {
                const qText = kovalTextarea.value.trim();
                if (!qText || qText.length < 5) {
                    if (kovalErr) kovalErr.classList.remove('hidden');
                    kovalTextarea.classList.add('border-red-500');
                    return;
                }

                if (kovalErr) kovalErr.classList.add('hidden');
                kovalTextarea.classList.remove('border-red-500');

                closeInfoModal();
                if (subjectSelect) subjectSelect.value = "Безкоштовна консультація";
                if (messageInput) {
                    messageInput.value = `Питання до Олександра Коваля: ${qText}`;
                    if (charCounter) charCounter.textContent = `${messageInput.value.length} / 500 символів`;
                }
                const consultationSection = document.getElementById('consultation');
                if (consultationSection) {
                    consultationSection.scrollIntoView({ behavior: 'smooth' });
                }
            });

            kovalTextarea.addEventListener('input', () => {
                if (kovalTextarea.value.trim().length >= 5) {
                    if (kovalErr) kovalErr.classList.add('hidden');
                    kovalTextarea.classList.remove('border-red-500');
                }
            });
        }
    }

    function closeInfoModal() {
        if (!infoModal || !infoModalCard) return;
        infoModal.classList.add('opacity-0');
        infoModalCard.classList.remove('scale-100', 'translate-y-0', 'opacity-100');
        infoModalCard.classList.add('scale-90', 'translate-y-4', 'opacity-0');
        setTimeout(() => infoModal.classList.add('hidden'), 300);
    }

    document.querySelectorAll('[data-modal-trigger]').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-modal-trigger');
            openInfoModal(key);
        });
    });

    if (infoModalCloseX) infoModalCloseX.addEventListener('click', closeInfoModal);
    if (infoModal) infoModal.addEventListener('click', e => { if (e.target === infoModal) closeInfoModal(); });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (document.querySelector('.fancybox__container')) {
                return;
            }
            if (infoModal && !infoModal.classList.contains('hidden')) {
                closeInfoModal();
                return;
            }
            if (modal && !modal.classList.contains('hidden')) {
                closeModal();
                return;
            }
        }
    });

    const range = document.getElementById('comparison-range');
    const beforeWrapper = document.getElementById('before-wrapper');
    const beforeImg = document.getElementById('before-img');
    const handle = document.getElementById('slider-handle');
    const sliderContainer = document.getElementById('before-after-slider');
    const badgeBefore = document.getElementById('badge-before');
    const badgeAfter = document.getElementById('badge-after');

    if (range && beforeWrapper && handle && sliderContainer && beforeImg) {
        function updateSlider() {
            const value = range.value;
            beforeWrapper.style.width = `${value}%`;
            handle.style.left = `${value}%`;
            beforeImg.style.width = `${sliderContainer.offsetWidth}px`;
            if (badgeBefore) badgeBefore.style.opacity = value < 5 ? '0' : '1';
            if (badgeAfter) badgeAfter.style.opacity = value > 95 ? '0' : '1';
        }
        range.addEventListener('input', updateSlider);
        window.addEventListener('resize', updateSlider);
        updateSlider();
    }

    if (typeof Fancybox !== 'undefined') {
        Fancybox.bind("[data-fancybox]", {
            Hash: false,
            Thumbs: { autoStart: true }
        });
    }
});