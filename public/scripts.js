
if (getCookie('authenticated') == 'true') {
    if (document.getElementById("welcome")) {
        document.getElementById("welcome").textContent += getCookie('username') + '!';
    }
    if (document.getElementById("loginnotice")) {
        document.getElementById("loginnotice").textContent = "You are logged in.";
    }
    if (document.getElementById("logout")) {
        document.getElementById("logout").style.visibility = "visible";
    }
}
else{
    if (document.getElementById("logout")) {
        document.getElementById("logout").style.visibility = "hidden";
    }
}

fetchSettings();

if (document.getElementById("messageboard")) {
    fetchMessages();
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function fetchMessages() {
    try {
        const res = await fetch('/messages');
        const messages = await res.json();
        console.log(messages);

        var node = document.getElementById("messagebox").cloneNode();

        // for each setting (BA,XSS...) read value and assign it to toggler
        messages.forEach(msg => {
            var clone = node.cloneNode();
            clone.innerHTML = msg.message;
            clone.style.visibility = "visible";
            document.getElementById("messageboard").appendChild(clone);
        });
    } catch (e) {
        console.log(`fetching messages failed.${e}`);
    }
}

async function fetchSettings() {
    try {
        const res = await fetch('/settings');
        const settings = await res.json();
        console.log(settings);

        // for each setting (BA,XSS...) read value and assign it to toggler
        settings.forEach(pair => {
            document.getElementById(pair[0]).checked = pair[1];
        });
    } catch (e) {
        console.log(`fetching settings failed.${e}`);
    }
}

function toggle(id) {
    let array = [id, document.getElementById(id).checked];
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(array)
    };
    const res = fetch('/settings', options);
    console.log(`setting ${array} sent.`);
}