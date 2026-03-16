function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateAppointment(payload) {
  const { title, date, time } = payload;
  if (!isNonEmptyString(title) || !isNonEmptyString(date) || !isNonEmptyString(time)) {
    return 'Fields title, date, and time are required.';
  }
  return null;
}

function validateContact(payload) {
  const { name, relation } = payload;
  if (!isNonEmptyString(name) || !isNonEmptyString(relation)) {
    return 'Fields name and relation are required.';
  }
  return null;
}

function validateReminder(payload) {
  const { title, time } = payload;
  if (!isNonEmptyString(title) || !isNonEmptyString(time)) {
    return 'Fields title and time are required.';
  }
  return null;
}

function validateEmergency(payload) {
  const { message, location } = payload;
  if (message !== undefined && !isNonEmptyString(message)) {
    return 'If provided, message must be a string.';
  }
  if (location && !isNonEmptyString(location)) {
    return 'If provided, location must be a string.';
  }
  return null;
}

module.exports = {
  validateAppointment,
  validateContact,
  validateReminder,
  validateEmergency
};
