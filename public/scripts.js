
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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
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