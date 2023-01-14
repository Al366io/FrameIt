export function generateRandomString (length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export async function createOwner(user_email) {
  const data = {
    email: user_email,
  };
  const response = await fetch(`https://www.frameit.social/users/owner`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => response.text());
  if (response.status === 204) return 1;
  return null;
}

export async function createParty(email) {
  const data = {
    email: email,
  };
  const response = fetch(`https://www.frameit.social/users/party/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((response) => response);
  return response;
}

export async function checkForParty(email) {
  const response = fetch(`https://www.frameit.social/users/info/party/${email}`)
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
}

export async function deleteParty(id) {
  const response = fetch(`https://www.frameit.social/party`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({id}),
  })
    .then((response) => response.text())
    .then((response) => response);
  return response;
}

export async function sendImage(data) {
  const formData = new FormData();
  formData.append('file', data, generateRandomString(10));
  formData.append('upload_preset', 'frameit')

  const response = fetch(`https://api.cloudinary.com/dkqmqt1gr/image/upload`, {
    method: 'POST',
    // headers: {
    //   // 'Content-Type': 'application/json',
    // },
    body: formData,
  }).then(async (res) => {
    console.log(res);
    const result = await res.data['secure_url'];
    console.log(result);
    return result
  });
  return response;
}