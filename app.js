// Get the modal
var modal = document.getElementById("myModal");
document.addEventListener("DOMContentLoaded", function () {
  var inputs = document.querySelectorAll("input");
  inputs.forEach(function (input) {
    input.setAttribute("autocomplete", "off");
  });
});

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
// span.onclick = function () {
//   modal.style.display = "none";
// }

// Get all images in the grid
var images = document.querySelectorAll(".grid-img");

// Get the modal image element
var modalImg = document.getElementById("img01");

// Store current image index
var currentImageIndex;

// Loop through each image and add a click event listener
images.forEach(function (img, index) {
  img.onclick = function () {
    modal.style.display = "block";
    modalImg.src = this.src;
    currentImageIndex = index;
  }
});

// Navigation between images
function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  modalImg.src = images[currentImageIndex].src;
}

function showPreviousImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  modalImg.src = images[currentImageIndex].src;
}

const delay = 6000; //ms

const slides = document.querySelector(".slides");
const slidesCount = slides.childElementCount;
const maxLeft = (slidesCount - 1) * 100 * -1;

let current = 0;

function changeSlide(next = true) {
  if (next) {
    current += current > maxLeft ? -100 : current * -1;
  } else {
    current = current < 0 ? current + 100 : maxLeft;
  }

  slides.style.left = current + "%";
}

let autoChange = setInterval(changeSlide, delay);
const restart = function () {
  clearInterval(autoChange);
  autoChange = setInterval(changeSlide, delay);
};

// Controls
document.querySelector(".next-slide").addEventListener("click", function () {
  changeSlide();
  restart();
});

document.querySelector(".prev-slide").addEventListener("click", function () {
  changeSlide(false);
  restart();
});


const thumbnails = document.querySelectorAll('.thumbnail');
thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener('click', () => {
    console.log(thumbnail);
    const mainImage = document.querySelector('.slider .slide img');
    const thumbnailImage = thumbnail.querySelector('img');
    mainImage.src = thumbnailImage.src;
    document.querySelector('.thumbnail.active').classList.remove('active');
    thumbnail.classList.add('active');
  });
});
const thumbnails1 = document.querySelectorAll('.thumbnail1');
thumbnails1.forEach((thumbnail1, index) => {
  thumbnail1.addEventListener('click', () => {
    const mainImage = document.querySelector('.slider1 .slide1 img');
    const thumbnailImage1 = thumbnail1.querySelector('img');
    mainImage.src = thumbnailImage1.src;
    document.querySelector('.thumbnail1.active').classList.remove('active');
    thumbnail1.classList.add('active');
  });
});


const accordionItemHeaders = document.querySelectorAll(".accordion-item-header");

accordionItemHeaders.forEach(accordionItemHeader => {
  accordionItemHeader.addEventListener("click", event => {

    // Uncomment in case you only want to allow for the display of only one collapsed item at a time!

    //     const currentlyActiveAccordionItemHeader = document.querySelector(".accordion-item-header.active");
    //     if(currentlyActiveAccordionItemHeader && currentlyActiveAccordionItemHeader!==accordionItemHeader) {
    //        currentlyActiveAccordionItemHeader.classList.toggle("active");
    //        currentlyActiveAccordionItemHeader.nextElementSibling.style.maxHeight = 0;
    //      }

    accordionItemHeader.classList.toggle("active");
    const accordionItemBody = accordionItemHeader.nextElementSibling;
    if (accordionItemHeader.classList.contains("active")) {
      accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
    }
    else {
      accordionItemBody.style.maxHeight = 0;
    }

  });
});



function showAlert(message, type) {
  const alertBox = document.getElementById('customAlert');
  alertBox.textContent = message;

  if (type === 'success') {
    alertBox.classList.add('success');
  } else if (type === 'error') {
    alertBox.classList.add('error');
  }

  alertBox.style.display = 'block';

  // Automatically hide after 3 seconds
  setTimeout(() => {
    alertBox.style.display = 'none';
    alertBox.classList.remove('success', 'error');
  }, 3000);
}
function ShowSuccussCard() {
  const alertBox = document.getElementById('SuccesCard');
  alertBox.style.display = 'block';

  // Automatically hide after 3 seconds
  setTimeout(() => {
    alertBox.style.display = 'none';
    alertBox.classList.remove('success', 'error');
  }, 3000);
}
let submitClicked = false;

document.getElementById('shippingForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  if (submitClicked) return;

  const quantity = parseInt(document.getElementById('quantity').value);
  const phoneInput = document.getElementById('number');
  let phoneNumber = phoneInput.value.replace(/\s+/g, '').replace(/^\+91/, '').replace(/^0/, '');
  const phoneRegex = /^[6-9]\d{9}$/;

  if (quantity < 1) return showAlert('Quantity must be at least 1', 'error');
  if (!phoneRegex.test(phoneNumber)) {
    phoneInput.focus();
    return showAlert('Please enter valid number', 'error');
  }

  phoneInput.value = phoneNumber;
  const formData = new FormData(this);
  const jsonData = {};
  formData.forEach((value, key) => (jsonData[key] = value));

  const button = $('#submitButton2');
  button.addClass("loading").prop('disabled', true);

  try {
    const authRes = await fetch('https://organic-store-backend.onrender.com/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const authData = await authRes.json();
    if (!authData.token) throw new Error('Auth token missing');
    await triggerDelivery(authData.token, jsonData, phoneNumber);
    document.getElementById('shippingForm').reset();
    closeModal();
    submitClicked = true;
    disableSubmitButton();

  } catch (error) {
    showAlert('Something went wrong. Please try again.', 'error');
    submitClicked = false;
    button.removeClass('loading').prop('disabled', false);
  }
});

async function triggerDelivery(token, formData, phone) {
  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 16).replace('T', ' ');
  const quantity = parseInt(formData.quantity);
  const amount = quantity * 999;
  const discount = quantity * 600;

  const payload = {
    token: token,
    orderData: {
      order_id: Date.now(),
      order_date: formattedDate,
      pickup_location: "@MR.MONKSKINO ,Shop no, 77/2 heena colony khajrana, Indore,  heena colony, Indore, Madhya Pradesh, 452016",
      comment: "Reseller: MONK2SKINO",
      billing_customer_name: formData.firstName,
      billing_last_name: formData.lastName,
      billing_address: formData.fulladdress,
      billing_address_2: formData.fulladdress,
      billing_city: formData.district,
      billing_pincode: formData.pincode,
      billing_state: formData.state,
      billing_country: "India",
      billing_email: formData.email,
      billing_phone: phone,
      shipping_is_billing: true,
      shipping_customer_name: formData.firstName,
      shipping_last_name: formData.lastName,
      shipping_address: formData.fulladdress,
      shipping_address_2: formData.fulladdress,
      shipping_city: formData.district,
      shipping_pincode: formData.pincode,
      shipping_state: formData.state,
      shipping_country: "India",
      shipping_email: formData.email,
      shipping_phone: phone,
      order_items: [
        {
          name: "M2S160-MONk 2 SKINo",
          sku: "M2S-160",
          units: quantity,
          selling_price: 1599,
          discount: discount,
          tax: 12,
          hsn: 30049011
        }
      ],
      payment_method: "COD",
      shipping_charges: 0,
      total_discount: 0,
      sub_total: amount,
      length: 15.24,
      breadth: 10.16,
      height: 6.35,
      weight: 0.2
    }
  };

  const response = await fetch('https://organic-store-backend.onrender.com/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error('Order creation failed');

  const data = await response.json();
  console.log('Order created:', data);
}
function closeModal() {
  // Hide the modal
  // ShowSuccussCard();
  const modal = document.querySelector('.modal');
  modal.style.display = "none";
  setTimeout(() => {
    window.location.replace(
      "/success.html",
    );
  }, 100);


  console.log('here');
  // window.location.href = "/index.html";
}
function disableSubmitButton() {
  document.getElementById('submitButton').disabled = true;
}



// accordion
$(document).ready(function () {
  $('.accordion-list > li > .answer').hide();

  $('.accordion-list > li').click(function () {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active").find(".answer").slideUp();
    } else {
      $(".accordion-list > li.active .answer").slideUp();
      $(".accordion-list > li.active").removeClass("active");
      $(this).addClass("active").find(".answer").slideDown();
    }
    return false;
  });

});
document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.querySelector('.carousel2');
  const slides = carousel.querySelector('.slides2');
  const slideItems = carousel.querySelectorAll('.slid2');
  const prevButton = carousel.querySelector('.prev-slide');
  const nextButton = carousel.querySelector('.next-slide');
  let currentIndex = 0;
  const slideWidth = slideItems[0].offsetWidth;
  const totalSlides = slideItems.length;
  let autoSlideInterval;
  const autoSlideDelay = 3000; // Change this value to adjust the delay between auto slides (in milliseconds)

  function goToSlide(index) {
    if (index < 0) {
      index = totalSlides - 1; // Move to the last slide when reaching the beginning
    } else if (index >= totalSlides) {
      index = 0; // Move to the first slide when reaching the end
    }
    slides.style.transition = 'transform 0.5s ease-in-out';
    slides.style.transform = `translateX(-${index * slideWidth}px)`;
    currentIndex = index;
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, autoSlideDelay);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  carousel.addEventListener('mouseenter', stopAutoSlide);
  carousel.addEventListener('mouseleave', startAutoSlide);

  prevButton.addEventListener('click', function () {
    goToSlide(currentIndex - 1);
  });

  nextButton.addEventListener('click', function () {
    goToSlide(currentIndex + 1);
  });

  startAutoSlide(); // Start auto sliding initially
});

var button = $('.reviewbtn'),
  spinner = '<span class="spinner"></span>';

// Function to handle star ratings
// Star rating interaction
document.querySelectorAll('.rating .star-css').forEach(item => {
  item.addEventListener('click', event => {
    const selectedIndex = parseInt(event.currentTarget.getAttribute('data-index'));
    document.querySelectorAll('.rating .star-css').forEach(star => {
      const starIndex = parseInt(star.getAttribute('data-index'));
      if (starIndex <= selectedIndex) {
        star.innerHTML = '<img src="./img/star fill.svg" alt="Filled Star" />';
      } else {
        star.innerHTML = '<img src="./img/star blank.svg" alt="Blank Star" />';
      }
    });
    document.getElementById('rating').value = selectedIndex;
  });
});

button.click(function () {

})
// Form submission
// document.getElementById('reviewForm').addEventListener('submit', function (event) {
//   event.preventDefault();
//   const formData = new FormData();
//   formData.append('name', document.getElementById('name').value);
//   formData.append('email', document.getElementById('email2').value);
//   formData.append('message', document.getElementById('message').value);
//   formData.append('image', document.getElementById('image').files[0]);
//   formData.append('rating', document.getElementById('rating').value);

//   const button = $('#submitButton'); 
//   button.addClass("loading").prop('disabled', true);
//     fetch('https://api.mmskino.com/v1/api/setdata', {
//     method: 'POST',
//     body: formData
//   })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       button.removeClass('loading').prop('disabled', false);
//       return response.json();
//     })
//     .then(data => {
//       if (data.code == 200) {
//         showAlert('Review submitted successfully!', 'success');
//         document.getElementById('email2').value = '';
//         document.getElementById('name').value = '';
//         document.getElementById('message').value = '';
//         document.getElementById('image').value = ''; // Clear the file input
//         document.getElementById('rating').value = '';
//       }
//       else {
//         showAlert(`${data.message}`, 'error');
//       }
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       button.removeClass('loading').prop('disabled', false)
//     });
// });

document.getElementById('reviewForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const formData = new FormData();
  formData.append('name', document.getElementById('name').value);
  formData.append('email', document.getElementById('email2').value);
  formData.append('message', document.getElementById('message').value);
  formData.append('image', document.getElementById('image').files[0]);

  // Get the rating value, if not set, default to 5
  let rating = document.getElementById('rating').value;
  if (rating === '0') {
    rating = '5'; // Set default rating to 5
  }
  formData.append('rating', rating);

  const button = $('#submitButton');
  button.addClass("loading").prop('disabled', true);
  fetch('https://api.mmskino.com/v1/api/setdata', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      button.removeClass('loading').prop('disabled', false);
      return response.json();
    })
    .then(data => {
      if (data.code == 200) {
        showAlert('Review submitted successfully!', 'success');
        document.getElementById('email2').value = '';
        document.getElementById('name').value = '';
        document.getElementById('message').value = '';
        document.getElementById('image').value = ''; // Clear the file input
        document.getElementById('rating').value = '0'; // Reset rating to default value
        document.getElementById('imageName').innerText = ''; // Clear selected image name
      } else {
        showAlert(`${data.message}`, 'error');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      button.removeClass('loading').prop('disabled', false);
    });
});

function displayImageName() {
  const fileInput = document.getElementById('image');
  const imageNameSpan = document.getElementById('imageName');
  if (fileInput.files.length > 0) {
    imageNameSpan.innerText = fileInput.files[0].name;
    document.getElementById('Chose_Image').style.display = 'none';
  } else {
    imageNameSpan.innerText = '';
    document.getElementById('Chose_Image').style.display = 'block';
  }
}


fetch('https://api.mmskino.com/v1/api/getdata', {
  method: 'POST',
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (data.status === 'success') {
      const reviews = data.data;
      const reviewContainer = document.getElementById('reviewContainer');

      reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review', 'card'); // Adding 'card' class for styling

        const nameElement = document.createElement('p');
        nameElement.style.fontSize = '12px';
        nameElement.style.color = '#435979'
        nameElement.textContent = `${review.name}`;

        const ratingElement = document.createElement('div'); // Container for rating stars
        ratingElement.classList.add('rating');

        for (let i = 1; i <= 5; i++) {
          const star = document.createElement('span');
          // star.classList.add('star-css');
          // star.setAttribute('data-index', i);

          if (i <= review.rating) {
            star.innerHTML = '<img src="./img/star fill.svg" alt="Filled Star" />';
          } else {
            star.innerHTML = '<img src="./img/star blank.svg" alt="Blank Star" />';
          }

          ratingElement.appendChild(star);
        }

        const messageElement = document.createElement('p');
        messageElement.style.fontSize = "10px";
        messageElement.style.maxInlineSize = '1';
        messageElement.style.overflow = 'hidden';
        messageElement.style.textOverflow = 'ellipsis'; // Adds ellipsis if text overflows
        messageElement.style.display = '-webkit-box';
        messageElement.style.webkitBoxOrient = 'vertical';
        messageElement.style.webkitLineClamp = '3'; // Number of lines to show
        messageElement.textContent = `${review.message}`;


        const contentContainer = document.createElement('div'); // Container for name, rating, and message
        contentContainer.classList.add('content-container');

        contentContainer.appendChild(nameElement);
        contentContainer.appendChild(ratingElement);
        contentContainer.appendChild(messageElement);

        reviewElement.appendChild(contentContainer);

        const imageElement = document.createElement('img');
        imageElement.src = `https://api.mmskino.com/v1/api/${review.path}`;
        imageElement.alt = review.filename;

        reviewElement.appendChild(imageElement);

        reviewContainer.appendChild(reviewElement);
      });
    } else {
      throw new Error(data.message);
    }
  })
  .catch(error => {
    console.log('Error:', error);
    const reviewContainer = document.getElementById('reviewContainer');
    reviewContainer.textContent = 'An error occurred while fetching reviews.';
  });
