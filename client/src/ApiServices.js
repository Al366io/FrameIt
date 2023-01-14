export function generateRandomString(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function createOwner(user_email) {
  try {
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
    console.log(response.status);
    if (response.status == 204) 
      return 1
    else
      return 0
  } catch (error) {
    return 0;
  }
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
      if (response.status === 200) return response.text();
      else return false;
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
    body: JSON.stringify({ id }),
  })
    .then((response) => response.text())
    .then((response) => response);
  return response;
}

export async function sendImage(data) {
  const formData = new FormData();
  formData.append('file', data, generateRandomString(10));
  formData.append('upload_preset', 'frameit');

  const response = fetch(`https://api.cloudinary.com/v1_1/dkqmqt1gr/image/upload`, {
    method: 'POST',
    body: formData,
  }).then(async (res) => {
    const result = await res.json();
    return result["secure_url"];
  });
  return response;
}

export async function sendUrlToDb(url, id) {
  const data = {
    url: url,
    partyId: id
  };
  const response = fetch(`https://www.frameit.social/party/upload`, {
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

export async function getSocketRoomId (id) {
  try {
    const response = fetch(`https://www.frameit.social/party/socketRoom/${id}`).then(
      (response) => response.text()
    );
    return response;
  } catch (error) {
    console.log(error);
    return '';
  }
}