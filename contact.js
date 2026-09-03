// WhatsApp Direct Message Function
function sendToWhatsApp() {
    // User ka naam aur message lein
    const name = document.getElementById('userName').value;
    const message = document.getElementById('userMessage').value;

    // Validate fields
    if (!name || !message) {
        alert('Please enter both your name and message.');
        return;
    }

    // Aapka WhatsApp Number (Country code ke saath, bina '+' ke)
    const phoneNumber = "918674905521"; 

    // WhatsApp ke liye message format (URL encoded)
    const text = `Hi, I am ${name}. %0A${message}`;

    // WhatsApp URL create karna
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    // Naye tab mein kholna
    window.open(url, '_blank');
}