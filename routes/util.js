module.exports = {
	requireLoggedIn: requireLoggedIn,
	requireNotLoggedIn: requireNotLoggedIn,
	extractRequiredFields: extractRequiredFields
}

function requireNotLoggedIn(req, res) {
	if (req.session.key) {
		res.status(200).json({ success: false, cause: 'Already logged in' }).end();
		return false;
	}
	return true;
}

function requireLoggedIn(req, res) {
	if (!req.session.key) {
		res.status(401).send('Not logged in').end();
		return false;
	}
	return true;
}


function extractRequiredFields(body, res, requiredFields, err=true) {
	if (!body) {
		res.status(400).end();
		return false;
	}

	var fields = {}

	for (let i = 0; i < requiredFields.length; i++) {
		var field = requiredFields[i];
		var passedField = body[field];
		if (passedField === undefined && err) {
			res.status(400).send(`Missing field \`${field}\``).end();
			return false;
		} else {
			fields[field] = passedField;
		}
	}

	return fields;
}
