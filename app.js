const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({
    limit: '10mb'
}));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    limit: '5000mb',
    extended: true,
    parameterLimit: 100000000000
}));
app.set('view engine', 'html')

const auth = require('./auth-mw');
const {
    time
} = require('console');
auth.initCookieAuth(app);
app.use(auth.getUserFromCookie);

app.get('/', function (req, res) {
    res.render('index.html', {
        user: req.user
    });
});

app.get('/messageboard', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'messageboard.html'));
    console.log('GET /messageboard recieved.');
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
    console.log('GET /login recieved.');
});

app.get('/private', function (req, res) {
    if (req.user.isAuthenticated) {
        res.render('private', {
            username: req.user.username
        });
    } else {
        res.redirect(302, 'login?returnUrl=/private');
    }
});

var ipAddrs = new Map();

app.get('/blocked', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'blocked.html'));
    console.log('GET /blocked recieved.');
});

app.post('/login', function (req, res) {
    console.log(ipAddrs, ipAddrs.get(res.ip));
    var redirects = false;
    if (!settings.get('BA')) {
        if (!ipAddrs.has(req.ip)) {
            ipAddrs.set(req.ip, [Date.now(), 1]);
        } else {
            if (Date.now() - ipAddrs.get(req.ip)[0] > 600000) {
                ipAddrs.set(req.ip, [Date.now(), 1]);
            } else {
                if (ipAddrs.get(req.ip)[1] < 3) {
                    ipAddrs.set(req.ip, [Date.now(), ipAddrs.get(req.ip)[1] + 1]);
                } else {
                    res.redirect(302, "blocked");
                    res.end();
                    redirects = true;
                }
            }
        }
    }

    if (!redirects) {
        console.log(req.ip);
        var username = req.body.username;
        var password = req.body.password;
        if ((username == 'bob') && (password == 'password4')) {
            ipAddrs.delete(req.ip);
            auth.signInUser(res, username);

            let returnUrl = req.query.returnUrl;
            if (returnUrl !== undefined) {
                res.redirect(returnUrl);
            } else {
                res.redirect("/");
            }
        } else {
            console.log(req.body);
            res.sendFile(path.join(__dirname, 'public', 'login.html'));
        }
    }
});

app.post('/logout', function (req, res) {
    auth.signOutUser(res);
    res.redirect("/");
});

var settings = new Map([
    ["BA", true],
    ["XSS", false],
    ["CSRF", true]
]);

app.get('/settings', function (req, res) {
    res.send(JSON.stringify(Array.from(settings.entries())));
    console.log('Security settings sent...');
    res.end();
});

app.post('/settings', function (req, res) {
    let setting = req.body;
    console.log(`POST /settings recieved ${setting[0]}.`);
    settings.set(setting[0], setting[1]);
    res.end();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});