// ===========================================
// DOCUMENT READY - Initialize on page load
// ===========================================
$(document).ready(function () {
    initializeEventListeners();
});

// ===========================================
// INITIALIZE EVENT LISTENERS
// ===========================================
function initializeEventListeners() {
    // Button click to open website
    $('#submitBtn').on('click', function (e) {
        e.preventDefault();
        handleButtonClick();
    });

    // Real-time input validation
    $('#fullName').on('blur', validateFullName);
    $('#email').on('blur', validateEmail);
    $('#phone').on('blur', validatePhone);
    $('#dob').on('blur', validateDOB);
    $('#password').on('blur', validatePassword);
    $('#confirmPassword').on('blur', validateConfirmPassword);

    // Clear error on focus
    $('#fullName, #email, #phone, #dob, #password, #confirmPassword').on('focus', function () {
        clearError($(this));
    });

    // Toggle password visibility
    $('#togglePassword').on('click', function () {
        togglePasswordVisibility('#password', '#togglePassword');
    });

    $('#toggleConfirmPassword').on('click', function () {
        togglePasswordVisibility('#confirmPassword', '#toggleConfirmPassword');
    });
}

// ===========================================
// BUTTON CLICK HANDLER (Display Registration Details)
// ===========================================
function handleButtonClick() {
    // Clear previous messages
    hideMessage();

    // Validate all fields
    const isValid = 
        validateFullName() &&
        validateEmail() &&
        validatePhone() &&
        validateDOB() &&
        validatePassword() &&
        validateConfirmPassword();

    if (!isValid) {
        return;
    }
    // Collect form data (including passwords for server validation)
    const payload = {
        fullName: $('#fullName').val().trim(),
        email: $('#email').val().trim(),
        phone: $('#phone').val().trim(),
        dob: $('#dob').val(),
        password: $('#password').val(),
        confirmPassword: $('#confirmPassword').val()
    };

    // Disable submit button and show spinner for UX
    const $submitBtn = $('#submitBtn');
    const $btnText = $('#btnText');
    const $btnSpinner = $('#btnSpinner');
    $submitBtn.prop('disabled', true);
    $btnText.text('Registering...');
    $btnSpinner.show();

    // Send JSON POST to serverless API
    $.ajax({
        url: '/api/process',
        type: 'POST',
        data: JSON.stringify(payload),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        timeout: 10000,
        success: function (response) {
            if (response && response.status === 'success') {
                // Build modal using the submitted (sanitized) payload
                const registrationDetails = `
                    <div class="registration-details">
                        <h2>✅ Registration Successful!</h2>
                        <div class="details-content">
                            <p><strong>Full Name:</strong> ${escapeHtml(payload.fullName)}</p>
                            <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
                            <p><strong>Phone Number:</strong> ${escapeHtml(payload.phone)}</p>
                            <p><strong>Date of Birth:</strong> ${formatDate(payload.dob)}</p>
                            <p style="margin-top: 20px; font-size: 14px; color: #666;">
                                ${escapeHtml(response.message)}
                            </p>
                        </div>
                        <button class="btn-close-details" onclick="closeRegistrationDetails()">Close</button>
                    </div>
                `;

                // Append modal
                $('body').append(`
                    <div class="modal-overlay" id="detailsModal">
                        ${registrationDetails}
                    </div>
                `);

                // Show top message
                showMessage(response.message || 'Registration successful', 'success');

                // Reset form (client-side)
                $('#registrationForm')[0].reset();
            } else {
                showMessage(response.message || 'An error occurred', 'error');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            let err = 'An error occurred. Please try again.';
            if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.message) err = jqXHR.responseJSON.message;
            showMessage(err, 'error');
            console.error('API error', textStatus, errorThrown);
        },
        complete: function () {
            $submitBtn.prop('disabled', false);
            $btnText.text('Register Now');
            $btnSpinner.hide();
        }
    });
}

// ===========================================
// FORMAT DATE FUNCTION
// ===========================================
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// ===========================================
// ESCAPE HTML (prevent XSS in modal output)
// ===========================================
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ===========================================
// CLOSE REGISTRATION DETAILS
// ===========================================
function closeRegistrationDetails() {
    $('#detailsModal').fadeOut(300, function() {
        $(this).remove();
    });
}

// ===========================================
// VALIDATION FUNCTIONS
// ===========================================

/**
 * Validate Full Name
 * @returns {boolean} True if valid, false otherwise
 */
function validateFullName() {
    const $input = $('#fullName');
    const value = $input.val().trim();
    const $error = $('#fullNameError');

    if (value === '') {
        showError($input, $error, 'Full name is required');
        return false;
    }

    if (value.length < 3) {
        showError($input, $error, 'Full name must be at least 3 characters');
        return false;
    }

    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
        showError($input, $error, 'Full name contains invalid characters');
        return false;
    }

    clearError($input);
    return true;
}

/**
 * Validate Email
 * @returns {boolean} True if valid, false otherwise
 */
function validateEmail() {
    const $input = $('#email');
    const value = $input.val().trim();
    const $error = $('#emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === '') {
        showError($input, $error, 'Email is required');
        return false;
    }

    if (!emailRegex.test(value)) {
        showError($input, $error, 'Please enter a valid email address');
        return false;
    }

    if (value.length > 254) {
        showError($input, $error, 'Email is too long');
        return false;
    }

    clearError($input);
    return true;
}

/**
 * Validate Phone Number
 * @returns {boolean} True if valid, false otherwise
 */
function validatePhone() {
    const $input = $('#phone');
    const value = $input.val().trim();
    const $error = $('#phoneError');
    const phoneRegex = /^[0-9+\-\s()]+$/;

    if (value === '') {
        showError($input, $error, 'Phone number is required');
        return false;
    }

    if (value.length < 7) {
        showError($input, $error, 'Phone number must be at least 7 digits');
        return false;
    }

    if (!phoneRegex.test(value)) {
        showError($input, $error, 'Phone number contains invalid characters');
        return false;
    }

    clearError($input);
    return true;
}

/**
 * Validate Date of Birth
 * @returns {boolean} True if valid, false otherwise
 */
function validateDOB() {
    const $input = $('#dob');
    const value = $input.val().trim();
    const $error = $('#dobError');

    if (value === '') {
        showError($input, $error, 'Date of Birth is required');
        return false;
    }

    const selectedDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
        age--;
    }

    if (age < 13) {
        showError($input, $error, 'You must be at least 13 years old');
        return false;
    }

    if (age > 120) {
        showError($input, $error, 'Please enter a valid date of birth');
        return false;
    }

    clearError($input);
    return true;
}

/**
 * Validate Password
 * @returns {boolean} True if valid, false otherwise
 */
function validatePassword() {
    const $input = $('#password');
    const value = $input.val();
    const $error = $('#passwordError');

    if (value === '') {
        showError($input, $error, 'Password is required');
        return false;
    }

    if (value.length < 6) {
        showError($input, $error, 'Password must be at least 6 characters');
        return false;
    }

    if (value.length > 128) {
        showError($input, $error, 'Password is too long');
        return false;
    }

    clearError($input);
    return true;
}

/**
 * Validate Confirm Password
 * @returns {boolean} True if valid, false otherwise
 */
function validateConfirmPassword() {
    const $input = $('#confirmPassword');
    const value = $input.val();
    const password = $('#password').val();
    const $error = $('#confirmPasswordError');

    if (value === '') {
        showError($input, $error, 'Please confirm your password');
        return false;
    }

    if (value !== password) {
        showError($input, $error, 'Passwords do not match');
        return false;
    }

    clearError($input);
    return true;
}

// ===========================================
// UI HELPER FUNCTIONS
// ===========================================

/**
 * Show error for a specific input field
 */
function showError($input, $error, message) {
    $input.closest('.form-group').addClass('error');
    $error.text(message).addClass('show');
}

/**
 * Clear error for a specific input field
 */
function clearError($input) {
    $input.closest('.form-group').removeClass('error');
    $input.closest('.form-group').find('.error-message').removeClass('show').text('');
}

/**
 * Show success or error message
 */
function showMessage(message, type) {
    const $container = $('#messageContainer');
    $container.removeClass('success error').addClass(type).text(message).addClass('show');
}

/**
 * Hide message
 */
function hideMessage() {
    $('#messageContainer').removeClass('show success error').text('');
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility(inputSelector, toggleSelector) {
    const $input = $(inputSelector);
    const $toggle = $(toggleSelector);
    const inputType = $input.attr('type');

    if (inputType === 'password') {
        $input.attr('type', 'text');
        $toggle.find('i').removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
        $input.attr('type', 'password');
        $toggle.find('i').removeClass('fa-eye-slash').addClass('fa-eye');
    }
}
