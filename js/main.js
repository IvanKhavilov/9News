const buttons = document.querySelectorAll('.header-btn')
const dropdowns = document.querySelectorAll('.header-dropdown')
const closeButtons = document.querySelectorAll('.close-btn')
const menu = document.querySelector('.menu')

buttons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    const id = btn.dataset.target
    let opened = false

    dropdowns.forEach((drop) => {
      if (drop.id === id) {
        drop.classList.toggle('active')
        opened = drop.classList.contains('active')
        btn.setAttribute('aria-expanded', opened)
      } else {
        drop.classList.remove('active')
      }
    })

    if (opened) {
      menu.classList.add('hide')
    } else {
      menu.classList.remove('hide')
    }
  })
})

closeButtons.forEach((closeBtn) => {
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    const parentDropdown = closeBtn.closest('.header-dropdown')
    if (parentDropdown) {
      parentDropdown.classList.remove('active')
    }
    menu.classList.remove('hide')
    buttons.forEach((btn) => btn.setAttribute('aria-expanded', 'false'))
  })
})

dropdowns.forEach((drop) => {
  drop.addEventListener('click', (e) => {
    e.stopPropagation()
  })
})

const burgerBtn = document.querySelector('.burger-btn')
const asideMenu = document.querySelector('.aside-menu')
burgerBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  asideMenu.classList.toggle('active')
  burgerBtn.classList.toggle('active')
})

const logo = document.querySelector('.logo-visible')

window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    menu.classList.add('hidden')
    logo.classList.add('visible')
  } else {
    menu.classList.remove('hidden')
    logo.classList.remove('visible')
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const triggers = document.querySelectorAll('.scroll-to-form')
  const form = document.getElementById('lead-form')

  if (form) {
    triggers.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault()
        form.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('leadForm')
  const firstName = document.getElementById('firstName')
  const lastName = document.getElementById('lastName')
  const phoneInput = document.getElementById('phone')
  const email = document.getElementById('email')

  /* === intl-tel-input === */
  const iti = window.intlTelInput(phoneInput, {
    initialCountry: 'gb',
    onlyCountries: ['gb'],
    allowDropdown: false,
    nationalMode: false,
    utilsScript: 'js/utils.js',
  })

  /* === helpers === */
  const showError = (input, message) => {
    const group = input.closest('.form-group')
    const error = group.querySelector('.error-message')
    input.classList.add('error')
    error.textContent = message
    error.classList.add('active')
  }

  const clearError = (input) => {
    const group = input.closest('.form-group')
    const error = group.querySelector('.error-message')
    input.classList.remove('error')
    error.textContent = ''
    error.classList.remove('active')
  }

  /* === запрет цифр в имени и фамилии === */
  const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/

  ;[firstName, lastName].forEach((input) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[0-9]/g, '')
    })
  })

  /* === submit === */
  form.addEventListener('submit', (e) => {
    e.preventDefault()

    let valid = true

    /* === First name === */
    if (!firstName.value.trim()) {
      showError(firstName, 'Введите имя')
      valid = false
    } else if (!nameRegex.test(firstName.value)) {
      showError(firstName, 'Имя не должно содержать цифры')
      valid = false
    } else {
      clearError(firstName)
    }

    /* === Last name === */
    if (!lastName.value.trim()) {
      showError(lastName, 'Введите фамилию')
      valid = false
    } else if (!nameRegex.test(lastName.value)) {
      showError(lastName, 'Фамилия не должна содержать цифры')
      valid = false
    } else {
      clearError(lastName)
    }

    /* === Phone === */
    const phoneValue = phoneInput.value.trim()
    const phoneError = iti.getValidationError()

    console.log('RAW:', phoneValue)
    console.log('E164:', iti.getNumber())
    console.log('ERROR CODE:', phoneError)

    if (!phoneValue) {
      showError(phoneInput, 'Введите номер телефона')
      valid = false
    } else if (phoneError !== 0) {
      showError(phoneInput, 'Введите корректный номер UK')
      valid = false
    } else {
      clearError(phoneInput)
    }

    /* === Email === */
    if (!email.value.trim()) {
      showError(email, 'Введите email')
      valid = false
    } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
      showError(email, 'Некорректный email')
      valid = false
    } else {
      clearError(email)
    }

    if (!valid) {
      console.log('❌ FORM INVALID')
      return
    }

    console.log('✅ FORM VALID — SENDING')

    /* === отправка === */
    const formData = new FormData(form)
    formData.set('phone', iti.getNumber())

    fetch('send.php', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.text())
      .then(() => {
        form.reset()
        iti.setNumber('')
        alert('Заявка отправлена')
      })
      .catch((err) => {
        console.error(err)
        alert('Ошибка отправки')
      })
  })
})

// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.getElementById('leadForm')
//   const firstName = document.getElementById('firstName')
//   const lastName = document.getElementById('lastName')
//   const phoneInput = document.getElementById('phone')
//   const email = document.getElementById('email')

//   /* === intl-tel-input === */
//   const iti = window.intlTelInput(phoneInput, {
//     initialCountry: 'gb',
//     onlyCountries: ['gb'],
//     allowDropdown: false,
//     nationalMode: false,
//   })

//   /* === helpers === */
//   const showError = (input, message) => {
//     const group = input.closest('.form-group')
//     const error = group.querySelector('.error-message')
//     input.classList.add('error')
//     error.textContent = message
//     error.classList.add('active')
//   }

//   const clearError = (input) => {
//     const group = input.closest('.form-group')
//     const error = group.querySelector('.error-message')
//     input.classList.remove('error')
//     error.textContent = ''
//     error.classList.remove('active')
//   }

//   /* === запрет цифр в имени и фамилии === */
//   const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/

//   ;[firstName, lastName].forEach((input) => {
//     input.addEventListener('input', () => {
//       input.value = input.value.replace(/[0-9]/g, '')
//     })
//   })

//   /* === submit === */
//   form.addEventListener('submit', (e) => {
//     e.preventDefault()
//     let valid = true

//     // First name
//     if (!firstName.value.trim()) {
//       showError(firstName, 'Введите имя')
//       valid = false
//     } else if (!nameRegex.test(firstName.value)) {
//       showError(firstName, 'Имя не должно содержать цифры')
//       valid = false
//     } else {
//       clearError(firstName)
//     }

//     // Last name
//     if (!lastName.value.trim()) {
//       showError(lastName, 'Введите фамилию')
//       valid = false
//     } else if (!nameRegex.test(lastName.value)) {
//       showError(lastName, 'Фамилия не должна содержать цифры')
//       valid = false
//     } else {
//       clearError(lastName)
//     }
//     console.log('--- SUBMIT PHONE CHECK ---')
//     console.log('RAW:', phoneInput.value)
//     console.log('E164:', iti.getNumber())
//     console.log('VALID:', iti.isValidNumber())
//     // Phone
//     if (!phoneInput.value.trim()) {
//       showError(phoneInput, 'Введите номер телефона')
//       valid = false
//     } else if (!iti.isValidNumber()) {
//       showError(phoneInput, 'Введите корректный номер UK')
//       valid = false
//     } else {
//       clearError(phoneInput)
//     }

//     // Email
//     if (!email.value.trim()) {
//       showError(email, 'Введите email')
//       valid = false
//     } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
//       showError(email, 'Некорректный email')
//       valid = false
//     } else {
//       clearError(email)
//     }

//     if (!valid) return

//     /* === отправка === */
//     const formData = new FormData(form)
//     formData.append('phone', iti.getNumber())

//     fetch('send.php', {
//       method: 'POST',
//       body: formData,
//     })
//       .then((res) => res.text())
//       .then(() => {
//         form.reset()
//         iti.setNumber('')
//         alert('Заявка отправлена')
//       })
//       .catch(() => {
//         alert('Ошибка отправки')
//       })
//   })
// })
