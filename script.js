document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('success-msg');
    const formContainer = document.getElementById('form-container');
    const title = document.querySelector('h1');
    const subtitle = document.querySelector('.subtitle');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simple validation check
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Formulario recibido:', data);

        // Visual feedback
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // Actual server request
        fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                // Hide form and headers smoothly
                contactForm.style.display = 'none';
                title.style.display = 'none';
                subtitle.style.display = 'none';

                // Show success message
                successMsg.style.display = 'block';
                
                // Add a little extra flair to the card
                formContainer.style.borderColor = '#4ade80';

                // Redirigir opcionalmente tras unos segundos o mostrar link
                setTimeout(() => {
                    window.location.href = 'index_resultado.html';
                }, 3000);
            }
        })
        .catch(err => {
            console.error('Error:', err);
            submitBtn.innerHTML = 'Error al enviar';
            submitBtn.disabled = false;
        });

    });

    // Exit functionality
    const exitBtn = document.getElementById('exit-btn');
    if (exitBtn) {
        exitBtn.addEventListener('click', async () => {
            if (confirm('¿Estás seguro de que quieres cerrar la aplicación y apagar el servidor?')) {
                try {
                    await fetch('/api/shutdown', { method: 'POST' });
                    document.body.innerHTML = `
                        <div class="glass-card" style="text-align:center; margin-top: 100px;">
                            <h1>Servidor Apagado</h1>
                            <p>Ya puedes cerrar esta pestaña.</p>
                        </div>`;
                } catch (e) {
                    window.close();
                }
            }
        });
    }

    // Add focus effects for labels

    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const label = input.previousElementSibling;
            if (label) label.style.color = '#818cf8';
        });

        input.addEventListener('blur', () => {
            const label = input.previousElementSibling;
            if (label) label.style.color = '#94a3b8';
        });
    });
});
