const validateJwt = async (decoded, request, h) => {
  let isValid = false;

  const user = await request.mongo.db.collection('users')
    .findOne({ username: decoded.username });

  if (user) {
    isValid = true;
  }

  return { isValid };
};

const generateJwt = (jwt, username) => jwt.sign(
  { username },
  process.env.JWT_SECRET,
);

module.exports = { validateJwt, generateJwt };
