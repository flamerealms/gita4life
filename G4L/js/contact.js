// EmailJS contact form handler for all pages

document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init({
        publicKey: "JWTlQfyWC05ds7uhv"
    });

    // Handle contact form on contact.html
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields (Name, Email, Message)');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Send email via EmailJS
            emailjs.send('service_gita4life', 'template_contact_form', {
                from_name: name,
                from_email: email,
                phone_number: phone || 'Not provided',
                subject: subject || 'General Inquiry',
                message: message,
                reply_to: email
            }).then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Show success message
                alert('Thank you for contacting us! We will get back to you soon.');
                
                // Reset form
                contactForm.reset();
                
                // Restore button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, function(error) {
                console.log('FAILED...', error);
                
                // Show error message
                alert('Failed to send message. Please try again or contact us directly at 9848762046');
                
                // Restore button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Handle footer contact forms on all pages
    const footerForms = document.querySelectorAll('.footer-right .contact-form');
    footerForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const inputs = form.querySelectorAll('input, textarea');
            const name = inputs[0].value.trim();
            const email = inputs[1].value.trim();
            const subject = inputs[2]?.value.trim() || 'Footer Inquiry';
            const message = inputs[3].value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all required fields');
                return;
            }

            const submitBtn = form.querySelector('button');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            emailjs.send('service_gita4life', 'template_contact_form', {
                from_name: name,
                from_email: email,
                phone_number: 'Not provided',
                subject: subject,
                message: message,
                reply_to: email
            }).then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Thank you! We will be in touch soon.');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, function(error) {
                console.log('FAILED...', error);
                alert('Failed to send. Please try again.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    });
});