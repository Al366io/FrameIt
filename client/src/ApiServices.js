exports.createOwner = async (user_email) => {
  const data = {
    email: user_email,
  };
  const response = await fetch(`http://localhost:3001/users/owner`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => response.text());
  if (response.status === 204) return 1;
  return null;
};

exports.createParty = async (email) => {
  const data = {
    email: email,
  };
  const response = fetch(`http://localhost:3001/users/party/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((response) => response);
  return response;
};

exports.checkForParty = async (email) => {
  const response = fetch(`http://localhost:3001/users/info/party/${email}`)
    .then((response) => {
      if(response.status === 200)
        return response.text();
      else
        return false;
    })
    .then((response) => {
      if (response) return response;
      return false;
    });
  return response;
};
