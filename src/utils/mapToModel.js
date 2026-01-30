/* eslint-disable camelcase */
const mapContactToModel = ({
  id,
  user_id,
  first_name,
  last_name,
  email,
  phone,
  _is_email_verified,
  _is_phone_verified,
  _created_date,
  _updated_date,
}) => ({
  id,
  userId: user_id,
  firstName: first_name,
  lastName: last_name,
  email,
  phone,
  _isEmailVerified: _is_email_verified,
  _isPhoneVerified: _is_phone_verified,
  _createdDate: _created_date,
  _updatedDate: _updated_date,
});

module.exports = { mapContactToModel };
