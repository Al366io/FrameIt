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

const {REACT_APP_BACKEND_HOST} = process.env

export async function createOwner(user_email) {
  try {
    const data = {
      email: user_email,
    };
  const response = await fetch(`${REACT_APP_BACKEND_HOST}/users/owner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => response);
    if (response.status === 204) 
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
  const response = fetch(`${REACT_APP_BACKEND_HOST}/users/party/create`, {
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
  const response = fetch(`${REACT_APP_BACKEND_HOST}/users/info/party/${email}`)
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
  const response = fetch(`${REACT_APP_BACKEND_HOST}/party`, {
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

  console.log(formData)

  const response = fetch(`https://api.cloudinary.com/v1_1/dlshfgwja/image/upload`, {
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
  const response = fetch(`${REACT_APP_BACKEND_HOST}/party/upload`, {
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
    const response = fetch(`${REACT_APP_BACKEND_HOST}/party/socketRoom/${id}`).then(
      (response) => response.text()
    );
    return response;
  } catch (error) {
    console.log(error);
    return '';
  }
}

export async function checkRoom (id) {
  try {
    const response = fetch(`${REACT_APP_BACKEND_HOST}/party/${id}`).then(
      (response) => response.json()
    ).then((res) => res)
    return response;
  } catch (error) {
    console.log(error);
    return false;
  }
} 